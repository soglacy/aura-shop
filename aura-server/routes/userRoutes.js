// aura-server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerUser, loginUser, getUserProfile, getUsers,
  deleteUser, updateUser, getUserById,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Сначала самые конкретные роуты
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Общий роут без параметров
router.route('/').get(protect, admin, getUsers);

// Роут с параметром - в самом конце
router.route('/:id')
    .get(protect, admin, getUserById)
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUser);

module.exports = router;