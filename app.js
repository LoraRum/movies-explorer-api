require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');

const {
  PORT = 3000,
  DB_HOST = '127.0.0.1',
  DB_PORT = '27017',
  DB_NAME = 'bitfilmsdb',
} = process.env;
const db = mongoose.connection;

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', console.info.bind(console, 'Connected to MongoDB'));

db.once('open', () => {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(cors());
  app.use(requestLogger);

  app.use(router);

  app.use(errorLogger);
  app.use(errors());

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      next(err);
    } else {
      res
        .status(err.statusCode || 500)
        .json({ message: err.message || 'Server Exception' });
    }
  });

  app.listen(PORT, (error) => {
    if (error) {
      console.error('Server failed to start:', error);
    } else {
      console.info('Server is running');
    }
  });
});
