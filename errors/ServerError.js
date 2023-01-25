const { SERVER_ERROR } = require('../utils/constants');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_ERROR;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
