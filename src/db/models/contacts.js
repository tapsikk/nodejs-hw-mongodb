import { Schema, model } from 'mongoose';

const contactsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'contacts' },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      required: false,
      default: false,
    },
    contactType: {
      type: String,
      required: false,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ContactsCollection = model('contacts', contactsSchema);
