import express from 'express';
import { accessChat, fetchChats, createGroupChat, renameGroup,removeFromGroup,addToGroup, deleteChatForMe, deleteGroup } from '../controller/chatController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/").post( protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/renameGroup").put(protect, renameGroup);
router.route("/removeUserFromGroup").put(protect, removeFromGroup);
router.route("/addUserToGroup").put(protect, addToGroup);
router.route("/deleteChatForMe/:chatId").delete(protect,deleteChatForMe);
router.route("/deleteGroup/:chatId").delete(protect,deleteGroup);

export default router;