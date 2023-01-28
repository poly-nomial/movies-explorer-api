const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  DUBLICATE_ERROR,
  AUTHORIZATION_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  INPUT_ERROR_MESSAGE,
  CONFLICT_ERROR_MESSAGE,
} = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const InputError = require('../errors/InputError');
const ConflictError = require('../errors/ConflictError');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_ERROR_MESSAGE);
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_ERROR_MESSAGE);
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.code === DUBLICATE_ERROR) {
        next(new ConflictError(CONFLICT_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
      })
        .then((user) => {
          res.status(200).send({
            data: {
              email: user.email,
              name: user.name,
            },
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new InputError(INPUT_ERROR_MESSAGE));
          } else if (err.code === DUBLICATE_ERROR) {
            next(new ConflictError(CONFLICT_ERROR_MESSAGE));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        {
          expiresIn: '7d',
        },
      );
      res
        .cookie('jwt', token, { maxAge: 3600000, httpOnly: true })
        .send({ message: 'Авторизация успешна' });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError' || err.name === 'InputError') {
        next(err);
      } else {
        next(new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE));
      }
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true }).send({ message: 'Выход успешен' });
};
