const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Поле "Name" должно быть запольнено'],
  },
  email: {
    type: String,
    required: [true, 'Поле "Email" должно быть запольнено'],
    unique: true,
    validate: [validator.isEmail, 'Неправильно заполнено поле'],
  },
  password: {
    type: String,
    select: false, // не возвращаем пароль
    required: [true, 'Поле "Password" должно быть запольнено'],
  },
});

// добавим метод findUserByCredentials схеме пользователя
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email })
    .select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильно введен логин или пароль'),
        );
      }

      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        } // отклоняем промис

        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model('user', userSchema);
