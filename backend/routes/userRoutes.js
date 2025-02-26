import express from 'express';
import { registerUser, authUser } from '../controller/userControllers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);


export default router