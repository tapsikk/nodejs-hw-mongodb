import {
  getAllContacts,
  getContactById,
  createNewContact,
  updateExistingContact,
  removeContact,
} from '../services/contacts.js';
import createError from 'http-errors';

export async function getContacts(req, res, next) {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
    };

    const filter = {};
    if (type) filter.contactType = type;
    if (isFavourite) filter.isFavourite = isFavourite === 'true';

    const contacts = await getAllContacts(filter, options);
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts.docs,
        page: contacts.page,
        perPage: contacts.limit,
        totalItems: contacts.totalDocs,
        totalPages: contacts.totalPages,
        hasPreviousPage: contacts.hasPrevPage,
        hasNextPage: contacts.hasNextPage,
      },
    });
  } catch (error) {
    next(createError(500, error.message));
  }
}

export async function getContact(req, res, next) {
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
    next(createError(500, error.message));
  }
}

export async function createContact(req, res, next) {
  try {
    const newContact = await createNewContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
}

export async function updateContact(req, res, next) {
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
    next(createError(500, error.message));
  }
}

export async function deleteContact(req, res, next) {
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
    next(createError(500, error.message));
  }
}
