import express from 'express';
import { registerUser, loginUser, refreshSession, logoutUser } from '../controllers/auth.js';
import { validateBody, userRegisterSchema, userLoginSchema } from '../middlewares/validateBody.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import { sendResetEmail } from '../services/email.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/register', validateBody(userRegisterSchema), ctrlWrapper(registerUser));
router.post('/login', validateBody(userLoginSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshSession));
router.post('/logout', ctrlWrapper(logoutUser));

router.post('/send-reset-email', async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

    await sendResetEmail(email, token);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(createHttpError(500, 'Failed to send the email, please try again later.'));
  }
});

router.post('/reset-pwd', async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(createHttpError(500, 'Failed to reset password, please try again later.'));
  }
});

export default router;
