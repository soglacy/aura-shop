// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Опции для Mongoose 6+ больше не нужны так явно (useNewUrlParser, useUnifiedTopology и т.д.)
      // Mongoose 6+ имеет их по умолчанию.
      // Если у вас старая версия Mongoose, возможно, их придется вернуть:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // для Mongoose < 6
      // useFindAndModify: false // для Mongoose < 6
    });
    console.log(`MongoDB подключена: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Ошибка подключения к MongoDB: ${error.message}`);
    process.exit(1); // Выход из процесса с ошибкой
  }
};

module.exports = connectDB;