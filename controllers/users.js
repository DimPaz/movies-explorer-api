const bcrypt = require('bcryptjs'); // импортируем модуль bcryptjs
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/BadRequestError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const PageNotFoundError = require('../errors/PageNotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

const duplicateKey = 11000;

// создать пользователя
const createUser = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('controller createUser');
  const { name, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, email, password: hash })
        .then(() => {
          res.send({
            name,
            email,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(
              new BadRequestError(
                'Переданы некорректные данные при создании профиля',
              ),
            );
          }
          if (err.code === duplicateKey) {
            return next(new ConflictError('Такой email уже существует'));
          }
          return next(err);
        });
    })
    .catch(next);
};

// залогинить пользователя
const login = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('controller loginUser');
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      next(new UnauthorizedError('Неправильно введен логин или пароль'));
    });
};

// возвращает информацию о пользователе (email и имя)
const getUserMe = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('controller getUsers');
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

// обновляет информацию о пользователе (email и имя)
const updateProfileUser = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('controller patchUsers');

  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((data) => {
      if (!data) {
        return next(
          new PageNotFoundError('Пользователь с указанным _id не найден'),
        );
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      }
      if (err.code === duplicateKey) {
        return next(new ConflictError('Такой email уже существует'));
      }
      return next(err);
    });
};

module.exports = {
  getUserMe,
  updateProfileUser,
  createUser,
  login,
};
