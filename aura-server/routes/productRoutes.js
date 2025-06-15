// aura-server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductByCustomId, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    createProductReview, 
    getProductByIdForAdmin 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// ОБЩИЕ РОУТЫ
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

// РОУТЫ ДЛЯ АДМИНКИ С КОНКРЕТНЫМ ID
router.route('/admin/:customId')
    .get(protect, admin, getProductByIdForAdmin);

// --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
// Используем :customId вместо :id, чтобы было единообразно
router.route('/:customId/reviews')
    .post(protect, createProductReview);

// РОУТЫ ДЛЯ КЛИЕНТА С КОНКРЕТНЫМ ID
// Этот роут должен быть последним из тех, что используют параметры,
// чтобы не перехватывать другие роуты типа '/admin/...'
router.route('/:customId')
    .get(getProductByCustomId)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;