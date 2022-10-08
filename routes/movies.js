const express = require('express');
const { celebrate, Joi } = require('celebrate');

const regExp = /^(https?:\/\/)?([\w\d-]+\.)*[\w-]+[\\.\\:]\w+([\\/\\?\\=\\&\\#\\.]?[\w-]+)*\/?$/;

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
      image: Joi.string().required().pattern(regExp), //
      trailerLink: Joi.string().required().pattern(regExp), //
      thumbnail: Joi.string().required().pattern(regExp), //
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
      movieId: Joi.string().alphanum().length(24).hex(), // попробовать .required()
    }),
  }),
  delMovie,
);

module.exports = {
  movieRouter,
};
