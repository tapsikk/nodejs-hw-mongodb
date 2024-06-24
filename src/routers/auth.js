import express from 'express';
import { registerUser } from '../controllers/auth.js';
import { validateBody, userRegisterSchema } from '../middlewares/validateBody.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';
import { loginUser } from '../controllers/auth.js';
import { refreshSession } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', validateBody(userLoginSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshSession));
export default router;
