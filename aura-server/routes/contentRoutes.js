// aura-server/routes/contentRoutes.js
const express = require('express');
const router = express.Router();
const { getHomePageContent, updateHomePageContent } = require('../controllers/contentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/homepage')
    .get(getHomePageContent)
    .put(protect, admin, updateHomePageContent);

module.exports = router;