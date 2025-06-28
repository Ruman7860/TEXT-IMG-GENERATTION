import express from 'express';
import { login, logout, signup, stripePayInstance, userCredits } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',verifyUser,logout);
router.post('/user-credits',verifyUser,userCredits);
router.post('/create-payment-intent',verifyUser,stripePayInstance);

export default router;