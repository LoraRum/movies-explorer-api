const jwt = require('jsonwebtoken');
const secretKey = require('../constsns/secret-key');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Unauthorized('Missing authorization token');
    return next(error);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
    req.user = payload;
    return next();
  } catch (err) {
    const error = new Unauthorized('Invalid authorization token');
    return next(error);
  }
};
