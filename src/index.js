import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const startServer = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();
