import asyncHandler from 'express-async-handler';
import Message from '../model/messageModel.js'
import User from '../model/userModel.js';
import Chat from '../model/chatModel';

export const sendMessage = asyncHandler(async (req,res) => {
    const { content, chatId } = req.body;

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try {
        var message =  await Message.create(newMessage)
        message = await message.populate("sender", "name pic").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate()
    } catch (error) {
        
    }
});