const express = require('express');
const {
  signInValidation,
  signUpValidation,
} = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');
const { NotFound } = require('../errors/errors');

const router = express.Router();

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', signInValidation, login);
router.post('/signup', signUpValidation, createUser);

router.use(auth);
router.use('/users', users);
router.use('/movies', movies);

router.use((req, res, next) => {
  next(new NotFound('Route not found'));
});

module.exports = router;
