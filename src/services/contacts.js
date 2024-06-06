import Contact from '../db/contact.js';

export async function getAllContacts() {
  try {
    return await Contact.find();
  } catch (error) {
    throw new Error('Error retrieving contacts: ' + error.message);
  }
}

export async function getContactById(contactId) {
  try {
    return await Contact.findById(contactId);
  } catch (error) {
    throw new Error('Error retrieving contact: ' + error.message);
  }
}
