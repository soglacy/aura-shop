// aura-server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Получаем токен из заголовка 'Bearer token'
      token = req.headers.authorization.split(' ')[1];

      // Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Находим пользователя по ID из токена и добавляем его в req (без пароля)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Не авторизован, пользователь не найден');
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      throw new Error('Не авторизован, токен недействителен');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Не авторизован, нет токена');
  }
});

// Middleware для проверки, является ли пользователь админом (если понадобится)
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Нет доступа, требуются права администратора');
  }
};

module.exports = { protect, admin };