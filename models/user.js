const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthorizationError = require('../errors/AuthorizationError');
const {
  AUTHORIZATION_ERROR_MESSAGE,
  NOT_URL_ERROR,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} ${NOT_URL_ERROR}`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new AuthorizationError(AUTHORIZATION_ERROR_MESSAGE),
          );
        }
        return user;
      });
    });
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
