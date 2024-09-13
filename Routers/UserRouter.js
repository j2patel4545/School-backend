import express from 'express';
import { CreateUser, LoginUser, getUserProfile } from '../Controlers/User.js';

const router = express.Router();

router.post('/signup', CreateUser);
router.post('/login', LoginUser);
router.get('/profile', getUserProfile); // Add this route for fetching user profile

export default router;
