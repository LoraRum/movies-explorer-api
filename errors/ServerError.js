class ServerError extends Error {
  constructor(err = 'Server error') {
    super(err);
    this.statusCode = 500;
  }
}

module.exports = ServerError;
