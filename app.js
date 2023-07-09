require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const { login, createUser } = require('./controllers/users');
const {
  signInValidation,
  signUpValidation,
} = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const movies = require('./routes/movies');
const { NotFound } = require('./errors/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const db = mongoose.connection;

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
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

  app.get('/crash-test', () => {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  });

  app.post('/signin', signInValidation, login);
  app.post('/signup', signUpValidation, createUser);

  app.use(auth);
  app.use('/users', users);
  app.use('/movies', movies);

  app.use((req, res, next) => {
    next(new NotFound('Route not found'));
  });

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
