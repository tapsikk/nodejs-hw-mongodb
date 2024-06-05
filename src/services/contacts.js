const Contact = require('../db/contact');

async function getAllContacts() {
  try {
    return await Contact.find();
  } catch (error) {
    throw new Error('Error retrieving contacts: ' + error.message);
  }
}

async function getContactById(contactId) {
  try {
    return await Contact.findById(contactId);
  } catch (error) {
    throw new Error('Error retrieving contact: ' + error.message);
  }
}

module.exports = {
  getAllContacts,
  getContactById,
};
