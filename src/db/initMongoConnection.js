import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const MONGODB_USER = env('MONGODB_USER');
    const MONGODB_PASSWORD = env('MONGODB_PASSWORD');
    const MONGODB_URL = env('MONGODB_URL');
    const MONGODB_DB = env('MONGODB_DB');

    console.log('MONGODB_USER:', MONGODB_USER);
    console.log('MONGODB_PASSWORD:', MONGODB_PASSWORD);
    console.log('MONGODB_URL:', MONGODB_URL);
    console.log('MONGODB_DB:', MONGODB_DB);

    const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    console.log('MongoDB URI:', mongoUri);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
