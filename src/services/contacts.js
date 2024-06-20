import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async (filter, options) => {
  return await ContactsCollection.paginate(filter, options);
};

export const getContactById = async (id) => {
  return await ContactsCollection.findById(id);
};

export const createNewContact = async (contactData) => {
  return await ContactsCollection.create(contactData);
};

export const updateExistingContact = async (id, contactData) => {
  return await ContactsCollection.findByIdAndUpdate(id, contactData, { new: true });
};

export const removeContact = async (id) => {
  return await ContactsCollection.findByIdAndDelete(id);
};
