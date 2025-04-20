import express from 'express';
import { accessChat, fetchChats, createGroupChat, renameGroup,removeFromGroup,addToGroup, deleteChat } from '../controller/chatController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/").post( protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/grouprename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/deletechat/:chatId").delete(protect,deleteChat)

export default router;