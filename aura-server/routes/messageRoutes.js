// aura-server/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { createMessage, getMessages, markMessageAsRead, deleteMessage, addReply, getMyMessages } = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

// Сначала самые конкретные роуты
router.route('/mymessages').get(protect, getMyMessages);

// Общий роут без параметров
router.route('/').post(protect, createMessage).get(protect, admin, getMessages);

// Роуты с параметром - в самом конце
router.route('/:id/read').put(protect, admin, markMessageAsRead);
router.route('/:id/reply').post(protect, admin, addReply);
router.route('/:id').delete(protect, admin, deleteMessage);

module.exports = router;