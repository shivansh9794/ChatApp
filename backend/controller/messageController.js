import asyncHandler from "express-async-handler";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import Chat from "../model/chatModel.js";
import fs from "fs";
import crypto from "crypto";
import cloudinary from "cloudinary";
import mime from 'mime-types';
import path from 'path';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Test for Cloudinary
async function uploadToCloudinary(filePath) {
  const mimeType = mime.lookup(filePath); 
  let resourceType = 'auto'; 
        
  if (!mimeType) {
    console.warn('Could not detect MIME type, using "raw" as fallback.');
    resourceType = 'raw';
  } else if (mimeType.startsWith('image/')) {
    resourceType = 'image';
  } else if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
    resourceType = 'video';
  } else {
    resourceType = 'raw';
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: 'Chat',
      use_filename: true,
      unique_filename: false
    });
    console.log('Upload successful:', result.secure_url);
    console.log("-->",result);
    return result;
  } catch (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }
}
// Clodinary Test
export const uploadFile = asyncHandler(async (req, res, next) => {
  try{
  if (req.file) {
    const result = uploadToCloudinary(req.file.path);
    console.log(result);
    res.status(200).json(result);
  }}catch(err){
    res.status(404).json("No file found");
  }
  
});


// In-memory cache for file hashes
const uploadedFileMap = {};

// Send Message API
export const sendMessage = asyncHandler(async (req, res) => {

  const { chatId, content ,replyOf} = req.body;
  console.log("User",req.user?._id);
  if (!chatId) {
    console.log("No Id passed into request");
    return res.sendStatus(400);
  }

  let attachmentData = null;
  let messageType = 'text';

  if (req.file) {
    try {
      const filePath = req.file.path;

      const mimeType = mime.lookup(filePath); 
      let resourceType = 'auto'; 
      if (!mimeType) {
        console.warn('Could not detect MIME type, using "raw" as fallback.');
        resourceType = 'raw';
      } else if (mimeType.startsWith('image/')) {
        resourceType = 'image';
      } else if (mimeType.startsWith('video/') || mimeType.startsWith('audio/')) {
        resourceType = 'video';
      } else {
        resourceType = 'raw';
      }

      // Generate hash
      const fileBuffer = fs.readFileSync(filePath);
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // Check for duplicates
      let cloudinaryResult = uploadedFileMap[fileHash];

      if (!cloudinaryResult) {
        // Upload to Cloudinary
        cloudinaryResult = await cloudinary.v2.uploader.upload(filePath, {
          resource_type: resourceType,
          folder: 'Chat'
        });

        uploadedFileMap[fileHash] = cloudinaryResult;
      }

      // Delete local file
      fs.unlink(filePath, () => { });

      // Set message type based on resource_type
      
      const resType = cloudinaryResult.resource_type;
      console.log(resType);

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

    message = await message.populate("sender","name");
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
      select: "name",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    //  remove the user from deleted list
    await Chat.findByIdAndUpdate(chatId, {
      $pull: { deletedBy: { $in: message.chat.users.map(user => user._id) } }
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


export const message = asyncHandler(async (req, res, next) => {
  const { chatId, content, replyOf, type } = req.body;
  console.log("---><---")
  if (!chatId) {
    console.log("No chatId passed into request");
    return res.sendStatus(400);
  }

  let attachmentData = null;
  let messageType = type || 'text'; // Default to text unless overridden or uploaded

  if (req.file) {
    try {
      const filePath = req.file.path;
      const mimeType = mime.lookup(filePath);
      const fileBuffer = fs.readFileSync(filePath);
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      let cloudinaryResult = uploadedFileMap[fileHash];

      if (!cloudinaryResult) {
        cloudinaryResult = await cloudinary.v2.uploader.upload(filePath, {
          resource_type: 'auto',
          folder: 'Chat/messageData',
          use_filename: true,
          unique_filename: false
        });
        uploadedFileMap[fileHash] = cloudinaryResult;
      }

      fs.unlink(filePath, () => {});

      // Determine type based on MIME if not explicitly provided
      if (!type) {
        if (mimeType.startsWith("image")) messageType = "image";
        else if (mimeType.startsWith("video")) messageType = "video";
        else if (mimeType.startsWith("audio")) messageType = "audio";
        else if (
          mimeType.includes("pdf") ||
          mimeType.includes("msword") ||
          mimeType.includes("officedocument")
        ) messageType = "document";
        else messageType = "file";
      }

      attachmentData = {
        fileHash,
        originalFilename: req.file.originalname,
        secure_url: cloudinaryResult.secure_url,
        url: cloudinaryResult.url,
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

  // Support sending location as a message
  if (type === 'location' && req.body.coordinates) {
    console.log("Location Found.....");
    console.log("Crd--<>",req.body.coordinates)
    messageType = 'location';
    attachmentData = {
      coordinates: req.body.coordinates, // { lat, lng }
      label: req.body.label || ''
    };
  }

  const newMessage = {
    sender: req.user._id,
    content: content || null,
    chat: chatId,
    type: messageType,
    attachment: attachmentData,
    replyOf: replyOf || null
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await message.populate({
      path: "replyOf",
      populate: {
        path: "sender",
        select: "name"
      }
    });

    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    await Chat.findByIdAndUpdate(chatId, {
      $pull: { deletedBy: { $in: message.chat.users.map(user => user._id) } }
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});




// React to mesaage
export const reactToMessage = async (req, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;
  console.log("User-->",req.user);

  const userId = req.user?._id;

  console.log("MID-->", messageId);
  console.log("EMJ-->", emoji);
  console.log("UID-->", userId);

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isSender = message.sender.toString() === userId.toString();

    // Choose appropriate reaction array
    const reactionsArray = isSender ? message.senderReactions : message.receiverReactions;

    // Check if user already reacted
    const existingReactionIndex = reactionsArray.findIndex(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingReactionIndex > -1) {
      const existingEmoji = reactionsArray[existingReactionIndex].emoji;

      if (existingEmoji === emoji) {
        // Toggle off
        reactionsArray.splice(existingReactionIndex, 1);
      } else {
        // Update emoji
        reactionsArray[existingReactionIndex].emoji = emoji;
        reactionsArray[existingReactionIndex].reactedAt = new Date();
      }
    } else {
      // Add new reaction
      reactionsArray.push({
        user: userId,
        emoji: emoji,
        reactedAt: new Date()
      });
    }

    await message.save();

    // Repopulate like allMessages
    const updatedMessage = await Message.findById(messageId)
      .populate("sender", "name username avatar")
      .populate("chat")
      .populate("senderReactions.user", "username avatar")
      .populate("receiverReactions.user", "username avatar")
      .populate({
        path: "replyOf",
        select: "-senderReactions -receiverReactions",
        populate: {
          path: "sender",
          select: "name username"
        }
      });

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Reaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// forward message
export const forwardMessage = asyncHandler(async (req, res) => {
  const { messageId, targetChatId } = req.body;

  if (!messageId || !targetChatId) {
    return res.status(400).json({ message: "Missing messageId or targetChatId" });
  }

  // Fetch the original message
  const originalMessage = await Message.findById(messageId);
  if (!originalMessage) {
    return res.status(404).json({ message: "Original message not found" });
  }

  // Create a new message using original's content
  const newMessage = {
    sender: req.user._id, // person forwarding it
    content: originalMessage.content,
    type: originalMessage.type,
    attachment: originalMessage.attachment || null,
    chat: targetChatId,
    replyOf: null // forwarded messages aren't replies by default
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
      select: "name pic email"
    });

    await Chat.findByIdAndUpdate(targetChatId, { latestMessage: message });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to forward message", error: error.message });
  }
});


// Fetch all messages
export const allMessages = asyncHandler(async (req, res) => {
  const chatId = req.params?.chatId;
  const userId = req.user?._id;

  try {
    let messages = await Message.find({ chat: chatId })
      .populate("sender", "name")
      .populate("chat")
      .populate({
        path: "replyOf",
        select: "-reactions",
        populate: {
          path: "sender",
          select: "name username"
        }
      });

    // Update seenBy field for unseen messages
    const updatePromises = messages.map(msg => {
      if (!msg.seenBy?.includes(userId) && msg?.sender?._id !== userId) {
        return Message.findByIdAndUpdate(
          msg._id,
          { $addToSet: { seenBy: userId } },
          { new: true }
        );
      }
      return msg;
    });

    // Wait for all updates to finish
    const updatedMessages = await Promise.all(updatePromises);

    res.json(updatedMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// delete message
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