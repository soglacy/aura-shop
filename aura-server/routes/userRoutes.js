// aura-server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, loginUser, getUserProfile, getUsers,
  deleteUser, // <-- Импорт
  updateUser, // <-- Импорт
  getUserById,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(protect, getUserProfile);

router.route('/').get(protect, admin, getUsers);

router.route('/:id')
    .get(protect, admin, getUserById)
    .delete(protect, admin, deleteUser) // <-- Новый роут
    .put(protect, admin, updateUser);   // <-- Новый роут

module.exports = router;