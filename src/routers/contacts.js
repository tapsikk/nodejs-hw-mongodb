import express from 'express';
import { getContacts, getContact, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';
import { validateBody, contactSchema } from '../middlewares/validateBody.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContact));
router.post('/contacts', validateBody(contactSchema), ctrlWrapper(createContact));
router.patch('/contacts/:contactId', validateBody(contactSchema), ctrlWrapper(updateContact));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContact));

export default router;
