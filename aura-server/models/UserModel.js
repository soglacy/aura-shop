// aura-server/models/UserModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Сохраняем email в нижнем регистре
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    isAdmin: { // Для будущей админ-панели
      type: Boolean,
      required: true,
      default: false,
    },
    // Можно добавить другие поля: телефон, адрес доставки по умолчанию и т.д.
  },
  {
    timestamps: true,
  }
);

// Метод для сравнения введенного пароля с хешированным в БД
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware для хеширования пароля перед сохранением нового пользователя
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { // Хешируем только если пароль был изменен (или это новый пользователь)
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;