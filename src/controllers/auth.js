import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const accessToken = uuidv4();
    const refreshToken = uuidv4();

    await Session.deleteMany({ userId: user._id });

    const newSession = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await newSession.save();

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error); 
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    await Session.deleteOne({ refreshToken });

    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || {};

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }

    await Session.deleteMany({ userId: session.userId });

    const accessToken = uuidv4(); 
    const newRefreshToken = uuidv4(); 

    const newSession = new Session({
      userId: session.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await newSession.save();

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error); 
  }
};
