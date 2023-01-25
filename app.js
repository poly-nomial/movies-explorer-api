const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi, errors } = require("celebrate");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { createUser, login, logout } = require("./controllers/users");
const auth = require("./middlewares/auth");
const userRouter = require("./routes/users");
const movieRouter = require("./routes/movies");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { SERVER_ERROR } = require("./utils/constants");

const PORT = 3000; // импортировать в .env

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser
);

app.use(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.use(auth);

app.use("/users", userRouter);
app.use("/movies", movieRouter);

app.use("/signout", logout);

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    res.status(SERVER_ERROR).send({ error: "На сервере произошла ошибка" });
  } else {
    res.status(err.statusCode).send({ error: err.message });
  }
});

mongoose.connect(
  "mongodb://localhost:27017/bitfilmsdb",
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("Connected to database");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  }
);
