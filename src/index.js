import 'dotenv/config';
import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

async function start() {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

start();
