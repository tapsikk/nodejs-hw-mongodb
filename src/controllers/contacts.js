import { getAllContacts, getContactById, createNewContact, updateExistingContact, removeContact } from '../services/contacts.js';

export async function getContacts(req, res) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
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
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' },
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

export async function createContact(req, res) {
  try {
    const newContact = await createNewContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

export async function updateContact(req, res) {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateExistingContact(contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' },
      });
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

export async function deleteContact(req, res) {
  try {
    const { contactId } = req.params;
    const deletedContact = await removeContact(contactId);
    if (!deletedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: { message: 'Contact not found' },
      });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}
