import Contact from '../db/models/contacts.js';

export const getContacts = async (userId) => {
  return Contact.find({ userId });
};

export const getContact = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData) => {
  const newContact = new Contact(contactData);
  await newContact.save();
  return newContact;
};

export const updateContact = async (contactId, userId, updates) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, updates, { new: true });
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
