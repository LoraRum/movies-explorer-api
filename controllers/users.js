const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = require('../constsns/secret-key');
const BadRequest = require('../errors/BadRequest');
const ConflictError = require('../errors/ConflictError');
const NotFound = require('../errors/NotFound');

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const user = newUser.toObject({ useProjection: true });

    res.status(201).json({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequest('Incorrect data passed during user creation'));
    } else if (error.name === 'MongoServerError') {
      next(
        new ConflictError(
          'When registering, an email is specified that already exists on the server',
        ),
      );
    } else {
      next(error);
    }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, secretKey, {
      expiresIn: '7d',
    });

    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findOne({ _id });
    user.password = undefined;

    if (!user) {
      next(new NotFound('User not found'));
    }

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name, email } },
      { new: true, runValidators: true },
    );

    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      next(new NotFound('User not found'));
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequest('Incorrect data passed during profile update'));
    } else {
      next(err);
    }
  }
};
