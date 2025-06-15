const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Загрузка моделей
const Product = require('./models/ProductModel');
// const User = require('./models/UserModel'); // Если будете сидить пользователей

// Загрузка данных
const products = require('./data/products');
// const users = require('./data/users');

dotenv.config(); // Чтобы получить доступ к MONGODB_URI

connectDB(); // Подключаемся к БД

const importData = async () => {
  try {
    // Очищаем предыдущие данные (ОСТОРОЖНО! Это удалит все из коллекций)
    await Product.deleteMany();
    // await User.deleteMany();

    // Вставляем новые данные
    // Убедимся, что данные соответствуют схеме, особенно customId
    const sampleProducts = products.map(product => {
      return { ...product }; // Здесь можно добавить трансформацию данных, если нужно
    });

    await Product.insertMany(sampleProducts);
    // await User.insertMany(users); // Если сидим пользователей

    console.log('Данные успешно импортированы!');
    process.exit();
  } catch (error) {
    console.error(`Ошибка при импорте данных: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    // await User.deleteMany();

    console.log('Данные успешно удалены!');
    process.exit();
  } catch (error) {
    console.error(`Ошибка при удалении данных: ${error.message}`);
    process.exit(1);
  }
};

// Логика для запуска из командной строки
// node seeder.js -d  (для удаления данных)
// node seeder.js     (для импорта данных)
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}