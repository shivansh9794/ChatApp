import asyncHandler from 'express-async-handler';
import Chat from '../model/chatModel.js'
import User from '../model/userModel.js';
import Message from "../model/messageModel.js";


export const accessChat = asyncHandler(async(req,res) => {
    const {userId} = req.body;

    console.log("Id is--->",userId);
    
    if(!userId) {
        console.log("User ID param not sent with request");
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch:{$eq:req.user._id}}},
            {users: {$elemMatch: {$eq:userId}}},
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name pic email",
    })

    if(isChat.length > 0) {
        res.send(isChat[0]);
    }
    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);

            const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users","-password");
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
  
export const createGroupChat = asyncHandler(async(req,res) => {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({message:"Please fill all the fields"})
    }

    var users = JSON.parse(req.body.users);
    if(users.length<2){
        return res.status(400).send("More than 2 users are required to form a group chat")
    }

    users.push(req.user); // adding currently Logged in user to a Group

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    } catch (error) {
        throw new Error(error.message);
    }
})

export const renameGroup = asyncHandler(async(req,res) => {
    const {chatId, chatName} = req.body;
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

    if(!updatedChat){
        res.status(404);
        throw new Error("Chat not Found");
    }else{
        res.json(updatedChat);
    }
})

export const addToGroup = asyncHandler(async(req,res) => {
    const {chatId, userId} = req.body;

    const added  = await Chat.findByIdAndUpdate(chatId, {
        $push: {users:userId},

    }, {new:true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added){
        res.status(404);
        throw new Error("Chat not Found");
    }else{
        res.json(added);
    }

})

export const removeFromGroup = asyncHandler(async(req,res) => {
    const {chatId, userId} = req.body;

    const remove  = await Chat.findByIdAndUpdate(chatId, {
        $pull: {users:userId},

    }, {new:true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!remove){
        res.status(404);
        throw new Error("Chat not Found");
    }else{
        res.json(remove);
    }

})
