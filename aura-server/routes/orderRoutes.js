// aura-server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  addOrderItems, getOrderById, getMyOrders, getOrders,
  updateOrderToDelivered, deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Сначала самые конкретные роуты
router.route('/myorders').get(protect, getMyOrders);

// Общий роут без параметров
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);

// Роут с параметром - в самом конце
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id').get(protect, getOrderById).delete(protect, admin, deleteOrder);

module.exports = router;