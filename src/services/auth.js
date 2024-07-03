import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import userSchema from '../db/models/user.js';
import sessionSchema from '../db/models/session.js';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await userSchema.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await userSchema.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await userSchema.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await sessionSchema.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await sessionSchema.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const logoutUser = async (sessionId) => {
  try {
    const session = await sessionSchema.findById(sessionId);
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }
    await sessionSchema.deleteOne({ _id: sessionId });
  } catch (error) {
    throw createHttpError(500, 'Error logging out');
  }
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  try {
    const session = await sessionSchema.findOne({ _id: sessionId, refreshToken });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await sessionSchema.deleteOne({ _id: sessionId, refreshToken });

    return await sessionSchema.create({
      userId: session.userId,
      ...newSession,
    });
  } catch (error) {
    throw createHttpError(500, 'Error refreshing session');
  }
};
