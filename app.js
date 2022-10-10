require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, NODE_ENV, URL_BD_SECRET } = process.env;
const app = express();

const helmet = require('helmet');
const { errors } = require('celebrate');
const { dataRouter } = require('./routes/index');
const errorHandler = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const limiter = require('./middlewares/riteLimiter');

app.use(requestLogger); // подключаем логгер запросов (самый первый обработчик должен быть)
app.use(cors);
app.use(helmet()); // шлем
app.use(limiter); // подключили ограничитель

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', dataRouter);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // мидлвера обработчика ошибок

async function main() {
  try {
    await mongoose.connect(NODE_ENV === 'production' ? URL_BD_SECRET : 'mongodb://localhost:27017/moviesdb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  await app.listen(PORT);
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на ${PORT} порту`);
}

main();
