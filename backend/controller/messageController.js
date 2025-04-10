import asyncHandler from "express-async-handler";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import Chat from "../model/chatModel.js";
import fs from "fs";
import crypto from "crypto";
import cloudinary from "cloudinary";


// Old Only Send Msg Controler
// export const sendMessage = asyncHandler(async (req, res) => {
//     const { content, chatId } = req.body;

//     if (!content || !chatId) {
//         console.log("Invalid data passed into request");
//         return res.sendStatus(400);
//     }

//     var newMessage = {
//         sender: req.user._id,
//         content: content,
//         chat: chatId,
//     }

//     try {
//         var message = await Message.create(newMessage)

//         message = await message.populate("sender", "name pic");
//         message = await message.populate("chat");
//         message = await User.populate(message, {
//             path: "chat.users",
//             select: "name pic email",
//         })

//         await Chat.findByIdAndUpdate(req.body.chatId, {
//             latestMessage: message
//         })

//         res.json(message);
//     } catch (error) {
//         res.status(400);
//         throw new error(error.message);
//     }
// });


// Setup cloudinary


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// In-memory cache for file hashes
const uploadedFileMap = {};

export const sendMessage = asyncHandler(async (req, res) => {

  const { chatId, content ,replyOf} = req.body;

  console.log("ID->", chatId);
  console.log("Content->", content);
  console.log("Reply of data->", replyOf);
  console.log("-->", req.file);


  if (!chatId) {
    console.log("No Id passed into request");
    return res.sendStatus(400);
  }

  let attachmentData = null;
  let messageType = 'text';

  if (req.file) {
    try {
      const filePath = req.file.path;

      // Generate hash
      const fileBuffer = fs.readFileSync(filePath);
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // Check for duplicates
      let cloudinaryResult = uploadedFileMap[fileHash];

      if (!cloudinaryResult) {
        // Upload to Cloudinary
        cloudinaryResult = await cloudinary.v2.uploader.upload(filePath, {
          resource_type: 'auto',
          folder: 'Chat'
        });

        uploadedFileMap[fileHash] = cloudinaryResult;
      }

      // Delete local file
      fs.unlink(filePath, () => { });

      // Set message type based on resource_type
      const resType = cloudinaryResult.resource_type;
      if (resType === 'image') messageType = 'image';
      else if (resType === 'video') messageType = 'video';
      else if (resType === 'raw') messageType = 'file';
      else messageType = 'file';

      // Prepare attachment data
      attachmentData = {
        fileHash,
        originalFilename: req.file.originalname,
        secure_url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
        resource_type: cloudinaryResult.resource_type,
        folder: cloudinaryResult.folder || 'Chat',
        uploaded_at: cloudinaryResult.created_at
      };

    } catch (err) {
      console.error("File upload error:", err);
      return res.status(500).json({ success: false, message: "File upload failed" });
    }
  }

  // Create the message object
  const newMessage = {
    sender: req.user._id,
    content: content || '',
    chat: chatId,
    type: messageType,
    attachment: attachmentData,
    replyOf: replyOf || null
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await message.populate({
      path: "replyOf",
      populate: {
        path: "sender",
        select: "username"
      }
    });
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


export const reactToMessage = async (req, res) => {

  console.log("____WORKING_____");
  const { messageId } = req.params;
  const { emoji } = req.body;
  const userId = req.user._id;
  console.log("MID-->",messageId);
  console.log("EMJ-->",emoji);
  console.log("UID-->",userId);

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user already reacted
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingReactionIndex > -1) {
      const existingEmoji = message.reactions[existingReactionIndex].emoji;

      if (existingEmoji === emoji) {
        // Toggle off the same reaction
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        // Update with new emoji
        message.reactions[existingReactionIndex].emoji = emoji;
        message.reactions[existingReactionIndex].reactedAt = new Date();
      }
    } else {
      // Add new reaction
      message.reactions.push({
        user: userId,
        emoji: emoji,
        reactedAt: new Date()
      });
    }

    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('reactions.user', 'username avatar') // adjust fields as needed
      .exec();

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Reaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .populate({
        path: "replyOf",
        select: "-reactions",
        populate: {
          path: "sender",
          select: "name username"
        }
      });
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  console.log("-->",messageId);
  
  if (!messageId) {
    res.status(400);
    throw new Error("Message ID is required");
  }

  const message = await Message.findById(messageId);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  // Authorization check (optional, but recommended)
  if (message.sender.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this message");
  }

  // Delete file from Cloudinary (if exists)

  if (message?.attachment != null) {
      try {
        await cloudinary.uploader.destroy(message.attachment.public_id);
      } catch (error) {
        console.error("Failed to delete file from Cloudinary:", error);
      }
  }
  else{
    console.log("Message Do Not Contains Any File With it");
  }

  // Delete the message from DB
  await message.deleteOne();

  res.status(200).json({ success: true, message: "Message and file deleted" });
});