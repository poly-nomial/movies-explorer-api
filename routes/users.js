const { celebrate, Joi } = require("celebrate");
const userRouter = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

userRouter.get("/me", getCurrentUser);

userRouter.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateProfile
);

module.exports = userRouter;
