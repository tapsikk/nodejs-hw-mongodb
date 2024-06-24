import express from 'express';
import { getContacts, getContact, createContact, updateContact, deleteContact } from '../controllers/contacts.js';
import ctrlWrapper from '../middlewares/ctrlWrapper.js';
import { validateBody, contactSchema } from '../middlewares/validateBody.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContact));
router.post('/', validateBody(contactSchema), ctrlWrapper(createContact));
router.patch('/:contactId', validateBody(contactSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', ctrlWrapper(deleteContact));

export default router;
