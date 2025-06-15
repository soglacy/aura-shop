// aura-server/controllers/notificationController.js
const asyncHandler = require('express-async-handler');
const Notification = require('../models/NotificationModel');

// @desc    Получить уведомления для текущего пользователя
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
});

// @desc    Отметить все уведомления как прочитанные
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
    res.json({ message: 'Все уведомления отмечены как прочитанные' });
});

// @desc    Удалить одно уведомление
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });

    if (notification) {
        await notification.deleteOne();
        res.json({ message: 'Уведомление удалено' });
    } else {
        res.status(404);
        throw new Error('Уведомление не найдено');
    }
});

module.exports = { getNotifications, markAllAsRead, deleteNotification };