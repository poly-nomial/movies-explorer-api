const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { AUTHORIZATION_ERROR_MESSAGE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE));
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
    );
  } catch (err) {
    next(new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE));
  }

  req.user = payload;

  next();
};
