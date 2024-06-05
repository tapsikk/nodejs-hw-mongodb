const setupServer = require('./server');
const initMongoConnection = require('./db/initMongoConnection');

async function start() {
  await initMongoConnection();
  setupServer();
}

start();
