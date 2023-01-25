const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const InputError = require('../errors/InputError');
const ServerError = require('../errors/ServerError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Не найдено');
      } else {
        res.status(200).send({ data: movies });
      }
    })
    .catch(() => {
      next(new ServerError('На сервере произошла ошибка'));
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
      if (err.name === 'ValidationError') {
        next(new InputError('Переданы некорректные данные'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление фильма');
      } else {
        movie.remove();
        return res.status(200).send({ message: 'Фильм удален' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InputError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
