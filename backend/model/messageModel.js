import mongoose from "mongoose";

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
    enum: ['text', 'image', 'video', 'file', 'audio'],
    default: 'text'
  },
  replyOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message" 
  },
  attachment: {
    fileHash: String,
    originalFilename: String,
    secure_url: String,
    public_id: String,
    resource_type: String,
    folder: String,
    uploaded_at: Date
  },

  reactions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      emoji: {
        type: String,
        required: true
      },
      reactedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

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
