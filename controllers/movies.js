const Movie = require("../models/movie");
const NotFoundError = require("../errors/NotFoundError");
const InputError = require("../errors/InputError");
const ForbiddenError = require("../errors/ForbiddenError");
const {
  NOT_FOUND_ERROR_MESSAGE,
  INPUT_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
} = require("../utils/constants");

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError(NOT_FOUND_ERROR_MESSAGE);
      } else {
        res.status(200).send({ data: movies });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new InputError(INPUT_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(NOT_FOUND_ERROR_MESSAGE);
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(FORBIDDEN_ERROR_MESSAGE);
      } else {
        movie
          .remove()
          .then(() => res.status(200).send({ message: "Фильм удален" }))
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new InputError(INPUT_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};
