import asyncHandler from 'express-async-handler';
import Chat from '../model/chatModel.js'
import User from '../model/userModel.js';
import Message from "../model/messageModel.js";
import fs from "fs";
import crypto from "crypto";
import cloudinary from "cloudinary";
import mime from 'mime-types';


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// In-memory cache for file hashes
const uploadedFileMap = {};


export const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    console.log("Id is--->", userId);

    if (!userId) {
        console.log("User ID param not sent with request");
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name pic email",
    })

    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);

            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
})

export const fetchChats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        let chats = await Chat.find({
            users: { $elemMatch: { $eq: userId } },
            deletedBy: { $ne: userId }
        })
            .populate("users", "name")
            .populate("groupAdmin", "name")
            .populate("latestMessage", "content sender")
            .sort({ updatedAt: -1 });

        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name",
        });



        // Add unread message count for each chat
        const chatsWithUnreadCount = await Promise.all(
            chats.map(async (chat) => {
                const unreadCount = await Message.countDocuments({
                    chat: chat._id,
                    sender: { $ne: userId },
                    seenBy: { $ne: userId },
                });

                return {
                    ...chat.toObject(),
                    unreadCount,
                };
            })
        );

        res.status(200).send(chatsWithUnreadCount);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

export const createGroupChat = asyncHandler(async (req, res,next) => {

    const { userList, groupName } = req.body;

    if (!userList || !groupName) {
        return res.status(400).send({ message: "Please fill all the fields" })
    }

    console.log("UsersList ==>", userList);
    console.log("GrpName-->", groupName);
    console.log("User->", req.user._id);
    console.log("file-->", req.file);


    let cloudinaryData;
    if (req.file) {
        try {
            const filePath = req.file.path;

            const mimeType = mime.lookup(filePath);
            let resourceType = 'auto';

            // Generate hash
            const fileBuffer = fs.readFileSync(filePath);
            const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

            // Check for duplicates
            let cloudinaryResult = uploadedFileMap[fileHash];

            if (!cloudinaryResult) {
                // Upload to Cloudinary
                cloudinaryResult = await cloudinary.v2.uploader.upload(filePath, {
                    resource_type: resourceType,
                    folder: 'Chat/GroupProfilePics',
                    use_filename: true,
                    unique_filename: false
                });
                uploadedFileMap[fileHash] = cloudinaryResult;
            }

            // Delete local file
            fs.unlink(filePath, () => { });

            cloudinaryData = {
                url: cloudinaryResult?.secure_url,
                public_id: cloudinaryResult?.public_id,
            };
        } catch (err) {
            console.error("File upload error:", err);
            return res.status(500).json({ success: false, message: "File upload failed" });
        }
    }

    let users;

    try {
        users = JSON.parse(req.body.userList);
    } catch (err) {
        return res.status(400).send({ message: "Invalid userList format" });
    }

    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat")
    }
    console.log("Check type->", typeof (users));
    users?.push(req.user._id); // adding currently Logged in user to a Group 

    try {
        const groupChat = await Chat.create({
            chatName: groupName,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id,
            groupProfilePic: cloudinaryData
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "name profilePicture")
            .populate("groupAdmin", "name profilePicture");

        res.status(200).json({ message: "Group created Successfully", fullGroupChat });

    } catch (error) {
        throw new Error(error.message);
    }
})

export const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat not Found");
    } else {
        res.json(updatedChat);
    }
})

export const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        res.status(400);
        throw new Error("chatId and userId are required");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404);
        throw new Error("Chat not found");
    }

    // Checking if the user is already in the group or not
    if (chat.users.includes(userId)) {
        res.status(400).json({
            message: "User Is Already Added to group",
        })
        throw new Error("User already in the group");
    }

    // Adding user to group
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    res.status(200).json({
        message: "User added to group successfully",
        chat: updatedChat,
    });
});

export const removeUserFromGroupOrLeave = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        res.status(400);
        throw new Error("chatId and userId are required");
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat not found or user not removed");
    }

    res.status(200).json({
        message: "User Exited From Group Successfully",
        chat: updatedChat,
    });
});

export const deleteGroup = asyncHandler(async (req, res) => {

    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId);

    if (!chat) {
        return res.status(404).json({ message: "Group Chat not found" });
    }

    if (!chat.isGroupChat) {
        return res.status(400).json({ message: "Only group chats can be deleted." });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Only group admin can delete the group." });
    }

    try {
        await Message.deleteMany({ chat: chatId });
        await Chat.findByIdAndDelete(chatId);
        return res.status(200).json({ message: "Group Deleted Successfully" });
    }
    catch (error) {
        console.error("Delete Group error:", error);
        return res.status(500).json({ message: "error" });
    }
});

export const deleteChatForMe = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user._id;

    try {
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // If already deleted by this user, no need to update
        if (chat.deletedBy.includes(userId)) {
            return res.status(200).json({ message: "Chat already deleted for this user" });
        }

        chat.deletedBy.push(userId);
        await chat.save();
        return res.status(200).json({ message: "Chat deleted for current user" });
    } catch (err) {
        console.error("Delete chat for me error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};






// export const GroupChat = asyncHandler(async (req, res, next) => {

//     const { userList, groupName } = req.body;

//     // if (!req.body.users || !req.body.name) {
//     //     return res.status(400).send({ message: "Please fill all the fields" })
//     // }

//     console.log("UserList ==>", userList);
//     console.log("GrpName-->", groupName);
//     console.log("User->", req.user._id);
//     console.log("Pro..file-->", req.file);


//     if (req.file) {
//         try {
//             const filePath = req.file.path;

//             const mimeType = mime.lookup(filePath);
//             let resourceType = 'auto';

//             // Generate hash
//             const fileBuffer = fs.readFileSync(filePath);
//             const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

//             // Check for duplicates
//             let cloudinaryResult = uploadedFileMap[fileHash];

//             if (!cloudinaryResult) {
//                 // Upload to Cloudinary
//                 cloudinaryResult = await cloudinary.v2.uploader.upload(filePath, {
//                     resource_type: resourceType,
//                     folder: 'Chat',
//                     use_filename: true,
//                     unique_filename: false
//                 });
//                 uploadedFileMap[fileHash] = cloudinaryResult;
//             }

//             // Delete local file
//             fs.unlink(filePath, () => { });

//             // Set message type based on resource_type

//             console.log("Result --->", cloudinaryResult);

//         } catch (err) {
//             console.error("File upload error:", err);
//             return res.status(500).json({ success: false, message: "File upload failed" });
//         }
//     }


//     res.status(200).send({ message: "Group With Profile Photo Created" });




//     // var users = JSON.parse(userList);


//     // if (users.length < 2) {
//     //     return res.status(400).send("More than 2 users are required to form a group chat")
//     // }
//     // users.push(req.userId); // adding currently Logged in user to a Group
//     // try {
//     //     const groupChat = await Chat.create({
//     //         chatName: req.body.name,
//     //         users: users,
//     //         isGroupChat: true,
//     //         groupAdmin: req.userId
//     //     })
//     //     const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
//     //         .populate("users", "-password")
//     //         .populate("groupAdmin", "-password");
//     //     res.status(200).json(fullGroupChat);
//     // } catch (error) {
//     //     throw new Error(error.message);
//     // }
// })