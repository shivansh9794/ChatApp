// import mongoose from "mongoose";

// const messageModel = mongoose.Schema({
//     sender:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     },
//     content:{
//         type: String,
//         trim: true
//     },
//     chat:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Chat"
//     }
// },{timestamps:true})

// const Message = mongoose.model("Message", messageModel);

// export default Message;


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
  attachment: {
    fileHash: String,
    originalFilename: String,
    secure_url: String,
    public_id: String,
    resource_type: String,
    folder: String,
    uploaded_at: Date
  }
}, { timestamps: true });

const Message = mongoose.model("Message", messageModel);

export default Message;
