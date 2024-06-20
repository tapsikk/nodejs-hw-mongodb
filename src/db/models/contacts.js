import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const contactsSchema = new Schema(
  {
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
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: false,
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contactsSchema.plugin(mongoosePaginate);

export const ContactsCollection = model('contacts', contactsSchema);
