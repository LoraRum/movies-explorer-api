class Unauthorized extends Error {
  constructor(err = 'Not Authorized') {
    super(err);
    this.statusCode = 401;
  }
}

module.exports = Unauthorized;
