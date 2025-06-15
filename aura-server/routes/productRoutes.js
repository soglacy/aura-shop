// aura-server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, getProductByCustomId, createProduct, updateProduct, deleteProduct, createProductReview, getProductByIdForAdmin } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/admin/:customId').get(protect, admin, getProductByIdForAdmin);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:customId').get(getProductByCustomId).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;