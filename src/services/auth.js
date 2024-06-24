import jwt from 'jsonwebtoken';
import Session from '../models/session.js';
import createHttpError from 'http-errors';

export const refreshUserSession = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (e) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  await Session.deleteMany({ userId: payload.userId });

  const accessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const session = new Session({
    userId: payload.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  await session.save();

  return { accessToken, refreshToken: newRefreshToken };
};
