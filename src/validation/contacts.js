import createHttpError from 'http-errors';
import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().min(3).max(30).required(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.valid('work', 'home', 'personal'),
  photo: Joi.string(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.valid('work', 'home', 'personal'),
  photo: Joi.string(),
});

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(createHttpError(404, 'Not found'));
    return;
  }

  next();
};
