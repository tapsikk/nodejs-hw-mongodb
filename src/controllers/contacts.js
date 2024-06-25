import Contact from '../db/models/contacts.js';
import createHttpError from 'http-errors';

export const getContacts = async (req, res) => {
  const userId = req.user._id;
  const contacts = await Contact.find({ userId });
  res.json({
    status: 'success',
    data: contacts,
  });
};

export const getContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await Contact.findOne({ _id: contactId, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 'success',
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const userId = req.user._id;

  const newContact = new Contact({ name, email, phone, userId });
  await newContact.save();

  res.status(201).json({
    status: 'success',
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const updates = req.body;

  const updatedContact = await Contact.findOneAndUpdate({ _id: contactId, userId }, updates, { new: true });

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 'success',
    message: 'Successfully updated the contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deletedContact = await Contact.findOneAndDelete({ _id: contactId, userId });

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 'success',
    message: 'Successfully deleted the contact!',
    data: deletedContact,
  });
};
