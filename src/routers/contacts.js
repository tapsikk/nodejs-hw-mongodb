import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
  contactSchema,
  partialContactSchema,
} from '../validation/contactValidation.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContact));
router.post('/', validateBody(contactSchema), ctrlWrapper(createContact));
router.patch(
  '/:contactId',
  validateBody(partialContactSchema),
  ctrlWrapper(updateContact)
);
router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
