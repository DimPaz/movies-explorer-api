const express = require('express');

const dataRouter = express.Router();

const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const auth = require('../middlewares/auth');

const PageNotFoundError = require('../errors/PageNotFoundError'); // 404

dataRouter.use(express.json());

// создаёт пользователя
dataRouter.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
// авторизует пользователя
dataRouter.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

// авторизация
dataRouter.use(auth);
// роуты users и movies
dataRouter.use('/users', userRouter);
dataRouter.use('/movies', movieRouter);
dataRouter.use('/', (req, res, next) => {
  next(new PageNotFoundError('Неверно написанный URL'));
});

module.exports = {
  dataRouter,
};
