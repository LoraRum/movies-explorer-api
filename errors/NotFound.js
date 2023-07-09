class NotFound extends Error {
  constructor(err = 'Not found') {
    super(err);
    this.statusCode = 404;
  }
}

module.exports = NotFound;
