// aura-server/server.js

// --- 1. ИМПОРТЫ (без изменений) ---
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { protect, admin } = require('./middleware/authMiddleware');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contentRoutes = require('./routes/contentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// --- ИЗМЕНЕНИЕ: Мы обернем запуск в асинхронную функцию ---

const startServer = async () => {
  dotenv.config();

  try {
    // Сначала ждем успешного подключения к БД
    await connectDB();

    const app = express();

    // --- MIDDLEWARE (без изменений) ---
    app.use(cors());
    app.use(express.json());

    // --- ПОДКЛЮЧЕНИЕ API РОУТОВ (без изменений) ---
    app.use('/api/products', productRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/content', contentRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/upload', protect, admin, uploadRoutes);

    // --- СТАТИЧЕСКИЕ ФАЙЛЫ (без изменений) ---
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // --- ЛОГИКА ДЛЯ ПРОДАКШЕНА (без изменений) ---
    if (process.env.NODE_ENV === 'production') {
      const frontendBuildPath = path.join(__dirname, '..', 'my-project', 'build');
      app.use(express.static(frontendBuildPath));
      app.get('*', (req, res) =>
        res.sendFile(path.resolve(frontendBuildPath, 'index.html'))
      );
    } else {
      app.get('/', (req, res) => {
        res.send('Aura API запущен в режиме разработки...');
      });
    }

    // --- MIDDLEWARE ДЛЯ ОБРАБОТКИ ОШИБОК (без изменений) ---
    app.use(notFound);
    app.use(errorHandler);

    // --- ЗАПУСК СЕРВЕРА (без изменений) ---
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Сервер УСПЕШНО запущен в режиме ${process.env.NODE_ENV} на порту ${PORT}`);
    });

  } catch (error) {
    console.error("!!! ОШИБКА ЗАПУСКА СЕРВЕРА !!!", error);
    process.exit(1);
  }
};

// Запускаем нашу асинхронную функцию
startServer();