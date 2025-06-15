// aura-server/models/NotificationModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { // Какому пользователю адресовано
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: { // Заголовок (напр. "Статус заказа изменен")
    type: String,
    required: true
  },
  message: { // Текст уведомления
    type: String,
    required: true
  },
  link: { // Ссылка, куда ведет клик по уведомлению (напр. /profile/orders/...)
    type: String 
  },
  isRead: { // Прочитано ли
    type: Boolean,
    default: false,
    required: true
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;