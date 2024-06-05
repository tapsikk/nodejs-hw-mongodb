const express = require('express');
const cors = require('cors');
const pino = require('pino')();
const pinoHttp = require('pino-http')({ logger: pino });

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pinoHttp);

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}

module.exports = setupServer;
