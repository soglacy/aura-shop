// aura-server/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const generateToken = require('../config/generateToken'); // Проверьте путь, если utils/
const Notification = require('../models/NotificationModel'); 

// @desc    Зарегистрировать нового пользователя
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Пожалуйста, заполните все поля');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Пользователь с таким email уже существует');
  }

  const user = await User.create({
    name,
    email,
    password, // Пароль будет хеширован pre-save хуком в модели
  });

  if (user) {
      // --- НАЧАЛО БЛОКА УВЕДОМЛЕНИЙ ---
    await Notification.create({
        user: user._id,
        title: 'Добро пожаловать в Aura Shop!',
        message: `Спасибо за регистрацию, ${user.name}! Надеемся, вам у нас понравится.`,
        link: '/profile'
    });
     // --- КОНЕЦ БЛОКА УВЕДОМЛЕНИЙ ---
     
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      createdAt: user.createdAt,
    });
  } else {
    res.status(400);
    throw new Error('Неверные данные пользователя');
  }
});

// @desc    Авторизовать пользователя и получить токен
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Пожалуйста, введите email и пароль');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      createdAt: user.createdAt,
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Неверный email или пароль');
  }
});

// @desc    Получить профиль пользователя
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Пользователь не найден');
  }
});

// @desc    Получить всех пользователей (для админки)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password'); // Находим всех, убираем пароли из ответа
  res.json(users);
});

// @desc    Удалить пользователя
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Нельзя удалить администратора');
    }
    await user.deleteOne();
    res.json({ message: 'Пользователь удален' });
  } else {
    res.status(404);
    throw new Error('Пользователь не найден');
  }
});

// @desc    Обновить пользователя (например, сделать админом)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;
        
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });

    } else {
        res.status(404);
        throw new Error('Пользователь не найден');
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('Пользователь не найден');
    }
});

module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUsers, // <-- Экспортируем новую функцию
  deleteUser, // <-- Новая функция
  updateUser,
  getUserById, // <-- Новая функция
};