// aura-server/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();

const { getNotifications, markAllAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getNotifications);
router.route('/read-all').put(protect, markAllAsRead);

// Роут для удаления одного уведомления
router.route('/:id').delete(protect, deleteNotification);

module.exports = router;