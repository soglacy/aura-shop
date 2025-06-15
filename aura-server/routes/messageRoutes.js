// aura-server/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { createMessage, getMessages, markMessageAsRead, deleteMessage, addReply, getMyMessages } = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createMessage)
    .get(protect, admin, getMessages);

router.route('/mymessages').get(protect, getMyMessages);

router.route('/:id')
    .delete(protect, admin, deleteMessage);

router.route('/:id/read')
    .put(protect, admin, markMessageAsRead);


router.route('/:id/reply') 
    .post(protect, admin, addReply);

router.route('/mymessages').get(protect, getMyMessages);

module.exports = router;