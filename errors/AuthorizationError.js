const { AUTHORIZATION_ERROR } = require("../utils/constants");

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTHORIZATION_ERROR;
    this.name = "AuthorizationError";
  }
}

module.exports = AuthorizationError;
