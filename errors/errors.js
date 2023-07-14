const BadRequest = require('./BadRequest');
const ServerError = require('./ServerError');
const ConflictError = require('./ConflictError');
const NotFound = require('./NotFound');
const Unauthorized = require('./Unauthorized');

module.exports = {
  BadRequest,
  ServerError,
  ConflictError,
  NotFound,
  Unauthorized,
};
