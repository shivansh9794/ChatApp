import express from 'express';
import { registerUser } from '../controller/userControllers.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', )


export default router