import asyncHandler from 'express-async-handler';
import Chat from '../model/chatModel.js'
import User from '../model/userModel.js';
import Message from "../model/messageModel.js";


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

// export const fetchChats = asyncHandler(async(req, res) => {
//     try {
//         Chat.find({users: { $elemMatch: { $eq: req.user._id}}})
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password")
//         .populate("latestMessage")
//         .sort({updatedAt: -1})
//         .then(async(results) => {
//             results = await User.populate(results, {
//                 path: "latestMessage.sender",
//                 select:"name pic email",
//             });
//             res.status(200).send(results);
//         })
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
// })

// Group routes


export const fetchChats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        let chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
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

export const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" })
    }

    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat")
    }

    users.push(req.user); // adding currently Logged in user to a Group

    console.log("++", users);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
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

export const removeFromGroup = asyncHandler(async (req, res) => {
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
        message: "User Removed From Group Successfully",
        chat: updatedChat,
    });
});

export const deleteChat = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.user._id;

    console.log("chatId-->",chatId);

    const chat = await Chat.findById(chatId);

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }
    console.log("user->",userId);
    console.log("Users->",chat.users);

    // Check if user is part of the chat
    if (!chat.users.includes(userId)) {
        return res.status(403).json({ message: "You are not part of this chat" });
    }

    // Remove user from the chat
    chat.users = chat.users.filter(id => id.toString() !== userId.toString());

    // Optional: If groupAdmin left, you could assign a new admin
    if (chat.isGroupChat && chat.groupAdmin.toString() === userId.toString()) {
        if (chat.users.length > 0) {
            chat.groupAdmin = chat.users[0]; // assign new admin
        } else {
            chat.groupAdmin = null;
        }
    }

    await chat.save();

    const message = chat.isGroupChat ? "Group chat left successfully" : "Chat deleted for you";
    res.status(200).json({ message });
});