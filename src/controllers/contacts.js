import { getAllContacts, getContactById } from '../services/contacts.js';

export async function getContacts(req, res) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}

export async function getContact(req, res) {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        status: 'error 404',
        error: error.message,
      });
    }
    res.status(200).json({
      status: 'success',
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}
