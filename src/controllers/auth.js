import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import Session from '../models/session.js';

export const refreshSession = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (e) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  await Session.deleteMany({ userId: payload.userId });

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload.userId);

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

  res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

  res.status(200).json({
    status: 'success',
    message: 'Successfully refreshed a session!',
    data: {
      accessToken,
    },
  });
};
