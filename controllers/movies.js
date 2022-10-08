const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const PageNotFoundError = require('../errors/PageNotFoundError'); // 404

const getMovie = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('controller getMovie');
  const owner = req.user._id;
  Movie.find({ owner })
    .then((data) => {
      if (!data) {
        return next(new PageNotFoundError('Страница не найдена'));
      }
      return res.send(data);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('controller createMovie');
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
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((data) => res.send({
      _id: data._id,
      country: data.country,
      director: data.director,
      duration: data.duration,
      year: data.year,
      description: data.description,
      image: data.image,
      trailerLink: data.trailerLink,
      thumbnail: data.thumbnail,
      movieId: data.movieId,
      nameRU: data.nameRU,
      nameEN: data.nameEN,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании профиля',
          ),
        );
      }
      return next(err);
    });
};

const delMovie = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('controller delMovie');
  const owner = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((data) => {
      if (!data.owner.equals(owner)) {
        return next(new ForbiddenError('удалить чужой фильм нельзя'));
      }
      return Movie.findByIdAndRemove(movieId)
        .then(() => res.send({ data }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('переданы не верные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getMovie,
  createMovie,
  delMovie,
};
