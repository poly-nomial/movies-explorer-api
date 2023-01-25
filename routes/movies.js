const { celebrate, Joi } = require("celebrate");
const movieRouter = require("express").Router();
const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");
const { ID_REGEX } = require("../utils/constants");

movieRouter.get("/", getSavedMovies);

movieRouter.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().integer().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required(),
      trailerLink: Joi.string().required(),
      thumbnail: Joi.string().required(),
      movieId: Joi.string().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie
);

movieRouter.delete(
  "/:movieId",
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().pattern(ID_REGEX),
    }),
  }),
  deleteMovie
);

module.exports = movieRouter;
