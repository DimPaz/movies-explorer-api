const express = require("express");

const movieRouter = express.Router();

const { getMovie, createMovie, delMovie } = require("../controllers/movies");

// возвращает все сохранённые текущим  пользователем фильмы
movieRouter.get("/", express.json(), getMovie);

// создаёт фильм
movieRouter.post("/", express.json(), createMovie);

// удаляет сохранённый фильм по id
movieRouter.delete("/:movieId", express.json(), delMovie);

module.exports = {
  movieRouter,
};
