import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Session from '../models/session.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({ accessToken: token, userId: decoded.userId });

    if (!session) {
      throw new Error();
    }

    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (e) {
    next(createHttpError(401, 'Access token expired'));
  }
};

export default authenticate;
