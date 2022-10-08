const express = require("express");
const { celebrate, Joi } = require('celebrate');

const userRouter = express.Router();

const { getUserMe, updateProfileUser } = require("../controllers/users");

// возвращает информацию о пользователе (email и имя)
userRouter.get("/me", getUserMe);

// обновляет информацию о пользователе (email и имя)
userRouter.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateProfileUser
);

module.exports = {
  userRouter,
};
