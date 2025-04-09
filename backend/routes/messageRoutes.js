import express from 'express';
import protect from '../middleware/authMiddleware.js'
import { sendMessage , allMessages ,deleteMessage} from '../controller/messageController.js';
import upload from "../middleware/multerAny.js"


const router = express.Router();

// router.route('/').post(protect, sendMessage)
router.post('/', upload.single('file'), protect, sendMessage);

router.route('/:chatId').get(protect, allMessages)

router.delete('/deleteMessage/:messageId',protect,deleteMessage);

export default router