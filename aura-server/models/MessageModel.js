// aura-server/models/MessageModel.js
const mongoose = require('mongoose');

// --- Схема для одного ответа ---
const replySchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // ID админа, который ответил
    userName: { type: String, required: true }, // Имя админа
    message: { type: String, required: true },
}, { timestamps: true });

const messageSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID пользователя, который отправил
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false, required: true },
    replies: [replySchema] // <<< ДОБАВЛЯЕМ МАССИВ ОТВЕТОВ
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;