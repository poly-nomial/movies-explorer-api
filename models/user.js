const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const InputError = require('../errors/InputError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
        return Promise.reject(new NotFoundError('Пользователь не найден'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new InputError('Неправильные почта или пароль'),
          );
        }
        return user;
      });
    });
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
