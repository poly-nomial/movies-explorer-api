const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const NotFoundError = require("../errors/NotFoundError");
const InputError = require("../errors/InputError");
const {
  NOT_FOUND_ERROR_MESSAGE,
  INPUT_ERROR_MESSAGE,
} = require("../utils/constants");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} не является ссылкой!`,
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
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new InputError(INPUT_ERROR_MESSAGE));
        }
        return user;
      });
    });
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
