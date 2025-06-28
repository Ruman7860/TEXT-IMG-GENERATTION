import express from 'express';
import { generateImage } from '../controllers/image.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/generate-image',verifyUser,generateImage);

export default router;