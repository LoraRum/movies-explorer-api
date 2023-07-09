class BadRequest extends Error {
  constructor(err = 'Bed request') {
    super(err);
    this.statusCode = 400;
  }
}

module.exports = BadRequest;
