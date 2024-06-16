import Contact from '../models/Contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createNewContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateExistingContact = async (id, contactData) => {
  return await Contact.findByIdAndUpdate(id, contactData, { new: true });
};

export const removeContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
