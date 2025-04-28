import express from 'express';
import 
{ 
accessChat, 
fetchChats, 
createGroupChat,
renameGroup,
removeUserFromGroupOrLeave,
addToGroup,
deleteChatForMe,
deleteGroup,
fetchChatInfo,
muteChat,
unMuteChat, 
} 
from '../controller/chatController.js';
import protect from '../middleware/authMiddleware.js';
import upload from "../middleware/multerAny.js"


const router = express.Router();

router.route("/").post( protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(upload.single('file'),protect, createGroupChat);
router.route("/renameGroup").put(protect, renameGroup);
router.route("/removeUserFromGroup").put(protect, removeUserFromGroupOrLeave);
router.route("/addUserToGroup").put(protect, addToGroup);
router.route("/deleteChatForMe/:chatId").delete(protect,deleteChatForMe);
router.route("/deleteGroup/:chatId").delete(protect,deleteGroup);
router.route("/chatInfo/:chatId").get(protect,fetchChatInfo);
router.route("/muteChat/:chatId").get(protect,muteChat);
router.route("/muteChat/:chatId").get(protect,unMuteChat);
export default router;