import Contact from '../db/models/contacts.js';

export const getContactsByUserId = async (userId) => {
  return await Contact.find({ userId });
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData) => {
  const newContact = new Contact(contactData);
  return await newContact.save();
};

export const updateContact = async (contactId, userId, updates) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, updates, { new: true });
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
