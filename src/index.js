import { initMongoConnection } from './db/initMongoConnection.js';
import express from 'express';

const startServer = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

const setupServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
