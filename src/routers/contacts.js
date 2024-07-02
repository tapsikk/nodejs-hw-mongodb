import express from 'express';
import { getContacts, getContact, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';
import { validateBody, contactSchema } from '../middlewares/validateBody.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, ctrlWrapper(getContacts));
router.get('/:contactId', auth, ctrlWrapper(getContact));
router.post('/', auth, validateBody(contactSchema), ctrlWrapper(createContact));
router.put('/:contactId', auth, validateBody(contactSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', auth, ctrlWrapper(deleteContact));

export default router;
