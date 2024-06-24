import express from 'express';
import { registerUser, loginUser, refreshSession, logoutUser } from '../controllers/auth.js';
import { validateBody, userRegisterSchema, userLoginSchema } from '../middlewares/validateBody.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';

const router = express.Router();

router.post('/register', validateBody(userRegisterSchema), ctrlWrapper(registerUser));
router.post('/login', validateBody(userLoginSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshSession));
router.post('/logout', ctrlWrapper(logoutUser));

export default router;
