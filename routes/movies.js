const express = require('express');
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const BadRequestError = require('../errors/BadRequestError');// 400

// Проверка ссылок на валидность
const urlValid = (url) => {
  const validate = validator.isURL(url);
  if (validate) {
    return url;
  }
  throw new BadRequestError('переданы неверные данные');
};

const movieRouter = express.Router();

const { getMovie, createMovie, delMovie } = require('../controllers/movies');

// возвращает все сохранённые текущим  пользователем фильмы
movieRouter.get('/', getMovie);

// создаёт фильм
movieRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(urlValid),
      trailerLink: Joi.string().required().custom(urlValid),
      thumbnail: Joi.string().required().custom(urlValid),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

// удаляет сохранённый фильм по id
movieRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  delMovie,
);

module.exports = {
  movieRouter,
};
