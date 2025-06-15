// aura-server/server.js

// --- 1. ИМПОРТЫ ---
const path = require('path'); // path теперь еще важнее
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { protect, admin } = require('./middleware/authMiddleware');

// Роуты
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contentRoutes = require('./routes/contentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); 

// --- 2. НАЧАЛЬНАЯ КОНФИГУРАЦИЯ ---
dotenv.config();
connectDB();

const app = express();

// --- 3. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 4. ПОДКЛЮЧЕНИЕ API РОУТОВ ---
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', protect, admin, uploadRoutes);

// --- 5. СТАТИЧЕСКИЕ ФАЙЛЫ ---
// <<< ИЗМЕНЕНИЕ ЗДЕСЬ (ДЛЯ UPLOADS) >>>
// Путь к папке uploads будет внутри папки сервера
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 6. ЛОГИКА ДЛЯ ПРОДАКШЕНА ---
// <<< ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ >>>
if (process.env.NODE_ENV === 'production') {
  // Строим путь к папке сборки фронтенда.
  // __dirname - это текущая папка (aura-server)
  // '..' - выйти на один уровень вверх (в ReactTailwind)
  // 'my-project', 'build' - зайти в папку сборки фронтенда
  const frontendBuildPath = path.join(__dirname, '..', 'my-project', 'build');
  
  // 1. Делаем папку со сборкой фронтенда статической
  app.use(express.static(frontendBuildPath));

  // 2. Для всех остальных запросов (которые не являются API) отдаем index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'))
  );
} else {
  // Это останется для локальной разработки
  app.get('/', (req, res) => {
    res.send('Aura API запущен в режиме разработки...');
  });
}

// --- 7. MIDDLEWARE ДЛЯ ОБРАБОТКИ ОШИБОК ---
app.use(notFound);
app.use(errorHandler);

// --- 8. ЗАПУСК СЕРВЕРА ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Сервер запущен в режиме ${process.env.NODE_ENV || 'development'} на порту ${PORT}`);
});
