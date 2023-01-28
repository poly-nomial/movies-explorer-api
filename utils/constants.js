const DUBLICATE_ERROR = 11000;
const ID_REGEX = /^[0-9a-f]{24}/;
const SERVER_ERROR = 500;
const SERVER_ERROR_MESSAGE = "На сервере произошла ошибка";
const INPUT_ERROR = 400;
const INPUT_ERROR_MESSAGE = "Введены некорректные данные";
const NOT_FOUND_ERROR = 404;
const NOT_FOUND_ERROR_MESSAGE = "Ничего не найдено";
const AUTHORIZATION_ERROR = 401;
const AUTHORIZATION_ERROR_MESSAGE = "Необходима авторизация";
const CONFLICT_ERROR = 409;
const CONFLICT_ERROR_MESSAGE = "Пользователь с таким адресом уже существует";
const FORBIDDEN_ERROR = 403;
const FORBIDDEN_ERROR_MESSAGE = "Нет прав на удаление фильма";
const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
const URL_REGEX = /^https?:\/\/(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+$/;

module.exports = {
  DUBLICATE_ERROR,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
  INPUT_ERROR,
  INPUT_ERROR_MESSAGE,
  NOT_FOUND_ERROR,
  NOT_FOUND_ERROR_MESSAGE,
  AUTHORIZATION_ERROR,
  AUTHORIZATION_ERROR_MESSAGE,
  CONFLICT_ERROR,
  CONFLICT_ERROR_MESSAGE,
  FORBIDDEN_ERROR,
  FORBIDDEN_ERROR_MESSAGE,
  ID_REGEX,
  DEFAULT_ALLOWED_METHODS,
  URL_REGEX,
};
