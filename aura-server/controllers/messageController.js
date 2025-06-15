// aura-server/controllers/messageController.js
const asyncHandler = require('express-async-handler');
const Message = require('../models/MessageModel');
const Notification = require('../models/NotificationModel');
const User = require('../models/UserModel');

// @desc    Создать новое сообщение
// @route   POST /api/messages
// @access  Private (теперь только для авторизованных)
const createMessage = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const { name, email, _id } = req.user; // Берем данные из req.user

  if (!subject || !message) {
    res.status(400);
    throw new Error('Пожалуйста, заполните все поля');
  }

  const newMessage = await Message.create({ 
    name, 
    email, 
    subject, 
    message,
    user: _id 
  });

  if (newMessage) {
    res.status(201).json({ message: 'Сообщение успешно отправлено!' });
  } else {
    res.status(400);
    throw new Error('Не удалось отправить сообщение');
  }
});

// @desc    Получить все сообщения (для админки)
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  res.json(messages);
});


// @desc    Получить сообщения текущего пользователя
// @route   GET /api/messages/mymessages
// @access  Private
const getMyMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(messages);
});


// @desc    Добавить ответ на сообщение
// @route   POST /api/messages/:id/reply
// @access  Private/Admin
const addReply = asyncHandler(async (req, res) => {
    const { message: replyMessage } = req.body;
    const message = await Message.findById(req.params.id);

    if (message) {
        const reply = {
            user: req.user._id,
            userName: req.user.name,
            message: replyMessage,
        };
        message.replies.push(reply);
        message.isRead = true;
        await message.save();

        await Notification.create({
            user: message.user,
            title: `Новый ответ на ваше обращение`,
            message: `Администратор ${req.user.name} ответил на ваш вопрос по теме "${message.subject}".`,
            link: `/profile/messages`
        });

        res.status(201).json(message);
    } else {
        res.status(404);
        throw new Error('Сообщение не найдено');
    }
});


// @desc    Отметить сообщение как прочитанное
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
const markMessageAsRead = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    if(message) {
        message.isRead = true;
        await message.save();
        res.json({ message: 'Сообщение отмечено как прочитанное' });
    } else {
        res.status(404);
        throw new Error('Сообщение не найдено');
    }
});

// @desc    Удалить сообщение
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    if(message) {
        await message.deleteOne();
        res.json({ message: 'Сообщение удалено' });
    } else {
        res.status(404);
        throw new Error('Сообщение не найдено');
    }
});

module.exports = { createMessage, getMessages, markMessageAsRead, deleteMessage, addReply, getMyMessages }; // <<< ДОБАВЛЕНО getMyMessages