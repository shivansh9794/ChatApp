import express from 'express';
import { registerUser , allUsers, authUser, deleteUser} from '../controller/userControllers.js';


const router = express.Router();

router.route('/register').post(registerUser).get(allUsers);
router.post('/login',authUser);
router.delete('/delete/:id',deleteUser);


export default router 