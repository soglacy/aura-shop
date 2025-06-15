// aura-server/server.js (ДЕБАГ-ВЕРСИЯ)

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { protect, admin } = require('./middleware/authMiddleware');

// --- ИЗМЕНЕНИЕ 1: Импортируем роуты, но пока не используем ---
// const productRoutes = require('./routes/productRoutes');
// const userRoutes = require('./routes/userRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const contentRoutes = require('./routes/contentRoutes');
// const messageRoutes = require('./routes/messageRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');

const startServer = async () => {
  dotenv.config();

  try {
    await connectDB();
    console.log('>>> [DEBUG] База данных успешно подключена.');

    const app = express();
    console.log('>>> [DEBUG] Express приложение создано.');

    app.use(cors());
    app.use(express.json());

    // --- ИЗМЕНЕНИЕ 2: Подключаем роуты по одному с логами ---
    console.log('>>> [DEBUG] Попытка подключения роутов...');

    try {
        const productRoutes = require('./routes/productRoutes');
        app.use('/api/products', productRoutes);
        console.log('>>> [DEBUG] Роут /api/products УСПЕШНО подключен.');
    } catch (e) { console.error('!!! ОШИБКА в productRoutes.js !!!', e); throw e; }

    try {
        const userRoutes = require('./routes/userRoutes');
        app.use('/api/users', userRoutes);
        console.log('>>> [DEBUG] Роут /api/users УСПЕШНО подключен.');
    } catch (e) { console.error('!!! ОШИБКА в userRoutes.js !!!', e); throw e; }

    try {
        const orderRoutes = require('./routes/orderRoutes');
        app.use('/api/orders', orderRoutes);
        console.log('>>> [DEBUG] Роут /api/orders УСПЕШНО подключен.');
    } catch (e) { console.error('!!! ОШИБКА в orderRoutes.js !!!', e); throw e; }
    
    try {
        const contentRoutes = require('./routes/contentRoutes');
        app.use('/api/content', contentRoutes);
        console.log('>>> [DEBUG] Роут /api/content УСПЕШНО подключен.');
    } catch (e) { console.error('!!! ОШИБКА в contentRoutes.js !!!', e); throw e; }

    try {
        const messageRoutes = require('./routes/messageRoutes');
        app.use('/api/messages', messageRoutes);
        console.log('>>> [DEBUG] Роут /api/messages УСПЕШНО подключен.');
    } catch (e) { console.error('!!! ОШИБКА в messageRoutes.js !!!', e); throw e; }

    try {
        const notificationRoutes = require('./routes/notificationRoutes');
        app.use('/api/notifications', notificationRoutes);
        console.log('>>> [DEBUG] Роут /api/notifications УСПЕШНО подключен.');
    } catch (e) { console.error('!!! ОШИБКА в notificationRoutes.js !!!', e); throw e; }
    
    try {
        const uploadRoutes = require('./routes/uploadRoutes');
        app.use('/api/upload', protect, admin, uploadRoutes);
        console.log('>>> [DEBUG] Роут /api/upload УСПЕШНО подключен.');
    } catch (e) { console.error('!!! ОШИБКА в uploadRoutes.js !!!', e); throw e; }

    console.log('>>> [DEBUG] Все роуты успешно подключены. Начинаем настройку статики...');

if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'my-project', 'build');
  app.use(express.static(frontendBuildPath));
  
  // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
  // Вместо app.get('*', ...) используем app.use со специальным обработчиком
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
    } else {
      next();
    }
  });

} else {
      app.get('/', (req, res) => { res.send('Aura API запущен...'); });
    }

    app.use(notFound);
    app.use(errorHandler);

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`>>> [SUCCESS] Сервер УСПЕШНО запущен и слушает порт ${PORT}`);
    });

  } catch (error) {
    console.error("!!! КРИТИЧЕСКАЯ ОШИБКА ЗАПУСКА СЕРВЕРА !!!", error);
    process.exit(1);
  }
};

startServer();