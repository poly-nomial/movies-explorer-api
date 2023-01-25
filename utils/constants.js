const DUBLICATE_ERROR = 11000;
const ID_REGEX = /^[0-9a-f]{24}/;
const SERVER_ERROR = 500;
const INPUT_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const AUTHORIZATION_ERROR = 401;
const CONFLICT_ERROR = 409;
const FORBIDDEN_ERROR = 403;
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  DUBLICATE_ERROR,
  SERVER_ERROR,
  INPUT_ERROR,
  NOT_FOUND_ERROR,
  AUTHORIZATION_ERROR,
  CONFLICT_ERROR,
  FORBIDDEN_ERROR,
  ID_REGEX,
  DEFAULT_ALLOWED_METHODS,
};
