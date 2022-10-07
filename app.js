const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;

const app = express();

const { dataRouter } = require("./routes/index");
const errorHandler = require('./middlewares/error');

// app.use((req, res, next) => {
//   req.user = {
//     _id: "633da61985c062fa8e86713b",
//   };

//   next();
// });

app.use("/", dataRouter);

// обработчики ошибок
// app.use(errors()); // обработчик ошибок celebrate
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
