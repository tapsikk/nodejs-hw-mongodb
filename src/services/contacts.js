import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';
import mongoose from 'mongoose';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = ContactsCollection.find({ userId });
  const studentsCount = await ContactsCollection.find({ userId })
    .merge(studentsQuery)
    .countDocuments();
  const contacts = await ContactsCollection.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calculatePaginationData(studentsCount, perPage, page);
  return {
    contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    createHttpError(400, 'Contact not found');
    return;
  }
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId: payload.userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
export const deleteContact = async (contactId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    createHttpError(400, 'Contact not found');
    return;
  }
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};