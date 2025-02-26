import express from 'express';
import { registerUser , allUsers} from '../controller/userControllers.js';


const router = express.Router();

router.route('/register').post(registerUser).get(allUsers);
router.post('/login')


export default router 