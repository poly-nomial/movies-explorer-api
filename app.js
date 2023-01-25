const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { createUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { SERVER_ERROR, DEFAULT_ALLOWED_METHODS } = require('./utils/constants');

const PORT = 3000; // импортировать в .env

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'polybitfilms.nomoredomains.rocks');
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
});

app.use(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

app.use(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(auth);

app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use('/signout', logout);

app.use(errorLogger);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    res.status(SERVER_ERROR).send({ error: 'На сервере произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ error: err.message });
  }
});

mongoose.connect(
  'mongodb://localhost:27017/bitfilmsdb',
  {
    useNewUrlParser: true,
  },
  () => {
    console.log('Connected to database');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  },
);
