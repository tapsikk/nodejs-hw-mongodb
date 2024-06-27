import * as contactsService from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const contacts = await contactsService.getContactsByUserId(userId);
    res.json({
      status: 200,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await contactsService.getContactById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user._id;

    const newContact = await contactsService.createContact({ name, email, phone, userId });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    const updatedContact = await contactsService.updateContact(contactId, userId, updates);

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const deletedContact = await contactsService.deleteContact(contactId, userId);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: 'Successfully deleted the contact!',
      data: deletedContact,
    });
  } catch (error) {
    next(error);
  }
};
