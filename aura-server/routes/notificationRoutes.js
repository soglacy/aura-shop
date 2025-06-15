// aura-server/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { getNotifications, markAllAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Сначала самые конкретные роуты
router.route('/read-all').put(protect, markAllAsRead);

// Общий роут без параметров
router.route('/').get(protect, getNotifications);

// Роут с параметром - в самом конце
router.route('/:id').delete(protect, deleteNotification);

module.exports = router;