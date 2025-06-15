// aura-server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, getProductByCustomId, createProduct, updateProduct, deleteProduct, createProductReview, getProductByIdForAdmin } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);

// Сначала самые конкретные роуты
router.route('/admin/:customId').get(protect, admin, getProductByIdForAdmin);
router.route('/:customId/reviews').post(protect, createProductReview);

// Общий роут с параметром - в самом конце
router.route('/:customId').get(getProductByCustomId).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;