const express = require("express");

const userRouter = express.Router();

const { getUserMe, updateProfileUser } = require("../controllers/users");

// возвращает информацию о пользователе (email и имя)
userRouter.get("/me", express.json(), getUserMe);

// обновляет информацию о пользователе (email и имя)
userRouter.patch("/me", express.json(), updateProfileUser);

module.exports = {
  userRouter,
};
