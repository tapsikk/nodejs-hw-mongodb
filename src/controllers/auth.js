import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';
import createHttpError from 'http-errors';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully!',
    });
  } catch (error) {
    next(createHttpError(500, 'Error registering user'));
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    const newSession = new Session({
      userId: user._id,
      accessToken: token,
      refreshToken: '',
      accessTokenValidUntil: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
    await newSession.save();

    res.json({
      status: 'success',
      data: { token },
    });
  } catch (error) {
    next(createHttpError(500, 'Error logging in'));
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

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged out!',
    });
  } catch (error) {
    next(createHttpError(500, 'Error logging out'));
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET);
    } catch (e) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    await Session.deleteMany({ userId: payload.userId });

    const accessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: '30d' });

    const session = new Session({
      userId: payload.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    await session.save();

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(createHttpError(500, 'Error refreshing session'));
  }
};
