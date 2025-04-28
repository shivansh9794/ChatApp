import mongoose from "mongoose";

// Crating reaction schema
const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  emoji: {
    type: String,
    required: true
  },
  reactedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false })

const messageModel = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  content: {
    type: String,
    trim: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat"
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'audio','location',],
    default: 'text'
  },
  replyOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message" 
  },
  isForwarded: {
    type: String,
    default : false 
  },
  attachment: {
    fileHash: String,
    originalFilename: String,
    secure_url: String,
    public_id: String,
    resource_type: String,
    folder: String,
    uploaded_at: Date,
    coordinates:String
  },

  senderReactions: [reactionSchema],
  
  receiverReactions: [reactionSchema],

  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  },
  
  createdTime: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }
  
}, { timestamps: true });

const Message = mongoose.model("Message", messageModel);

export default Message;
