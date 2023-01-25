const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { DUBLICATE_ERROR, AUTHORIZATION_ERROR } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const InputError = require('../errors/InputError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'NotFountError') {
        next(err);
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'NotFountError') {
        next(err);
      } else {
        next(new ServerError('На сервере произошла ошибка'));
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
            next(new InputError('Переданы некорректные данные'));
          } else if (err.code === DUBLICATE_ERROR) {
            next(
              new ConflictError('Пользователь с таким адресом уже существует'),
            );
          }
        });
    })
    .catch(() => {
      next(new ServerError('На сервере произошла ошибка'));
    });
};

module.exports.login = (req, res) => {
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
      res.status(AUTHORIZATION_ERROR).send({ message: err.message });
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true }).send({ message: 'Выход успешен' });
};
