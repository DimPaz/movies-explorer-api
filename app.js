require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet"); // шлем
const limiter = require("./middlewares/riteLimiter");

const { PORT = 3000 } = process.env;
const app = express();

const { dataRouter } = require("./routes/index");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error");
const { requestLogger, errorLogger } = require("./middlewares/logger");

// console.log(require('crypto').randomBytes(32).toString('hex'));
// app.use((req, res, next) => {
//   req.user = {
//     _id: "633da61985c062fa8e86713b",
//   };

//   next();
// });

app.use(requestLogger); // подключаем логгер запросов (самый первый обработчик должен быть)
app.use(helmet()); // шлем
app.use(limiter); // подключили ограничитель

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.use("/", dataRouter);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // мидлвера обработчика ошибок

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/bitfilmsdb", {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
  } catch (err) {
    console.log(err);
  }

  await app.listen(PORT);
  console.log(`Сервер запущен на ${PORT} порту`);
}

main();
