import express from 'express';
import protect from '../middleware/authMiddleware.js'
import { sendMessage , allMessages ,deleteMessage, reactToMessage,forwardMessage, uploadFile, message} from '../controller/messageController.js';
import upload from "../middleware/multerAny.js"

const router = express.Router();

router.post('/', upload.single('file'), protect, sendMessage);

router.post('/upload', upload.single('file'), protect, uploadFile);

router.post('/react/:messageId', protect, reactToMessage);

router.post('/forward', protect, forwardMessage);

router.route('/:chatId').get(protect, allMessages)


router.delete('/deleteMessage/:messageId',protect,deleteMessage);



router.post('/msg', upload.single('file'), protect, message);




export default router