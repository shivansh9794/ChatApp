import express from 'express';
import protect from '../middleware/authMiddleware.js'
import { sendMessage , allMessages ,deleteMessage, reactToMessage,forwardMessage, uploadFile} from '../controller/messageController.js';
import upload from "../middleware/multerAny.js"


const router = express.Router();

router.post('/', upload.single('file'), protect, sendMessage);

router.post('/upload', upload.single('file'), protect, uploadFile);

router.post('/react/:messageId', upload.single('file'), protect, reactToMessage);


router.post('/forward', protect, forwardMessage);


router.route('/:chatId').get(protect, allMessages)


router.delete('/deleteMessage/:messageId',protect,deleteMessage);

export default router