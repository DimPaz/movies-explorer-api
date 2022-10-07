const express = require("express");

const dataRouter = express.Router();

const { createUser, login } = require("../controllers/users");
const { userRouter } = require("../routes/users");
const { movieRouter } = require("../routes/movies");
const auth = require('../middlewares/auth');// мидлвара авторизации

const PageNotFoundError = require('../errors/PageNotFoundError'); // 404

// создаёт пользователя
dataRouter.post("/signup", express.json(), createUser);
// авторизует пользователя
dataRouter.post("/signin", express.json(), login);

// авторизация
dataRouter.use(auth);
// роуты users и movies
dataRouter.use("/users", userRouter);
dataRouter.use("/movies", movieRouter);
dataRouter.use('/', (req, res, next) => {
  next(new PageNotFoundError('Неверно написанный URL'));
});

module.exports = {
  dataRouter,
};
