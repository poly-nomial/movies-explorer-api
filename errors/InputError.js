const { INPUT_ERROR } = require('../utils/constants');

class InputError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INPUT_ERROR;
    this.name = 'InputError';
  }
}

module.exports = InputError;
