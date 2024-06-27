import createHttpError from 'http-errors';
import Session from '../db/models/session.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createHttpError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const session = await Session.findOne({ accessToken: token });

    if (!session || session.accessTokenValidUntil < Date.now()) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = { _id: session.userId };
    next();
  } catch (error) {
    next(createHttpError(401, 'Authentication failed'));
  }
};

export default authenticate;
