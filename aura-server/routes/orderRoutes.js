// aura-server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  addOrderItems, 
  getOrderById, 
  getMyOrders, 
  getOrders,
  updateOrderToDelivered, 
  deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// ОБЩИЕ РОУТЫ И КОНКРЕТНЫЕ РОУТЫ БЕЗ ПАРАМЕТРОВ
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

router.route('/myorders')
    .get(protect, getMyOrders);

// РОУТЫ С ПАРАМЕТРОМ ID (ИДУТ В КОНЦЕ)
// Сначала более конкретный путь с /deliver
router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);

// Затем более общий путь с :id
router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, admin, deleteOrder);

module.exports = router;