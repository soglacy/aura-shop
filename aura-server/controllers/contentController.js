// aura-server/controllers/contentController.js
const asyncHandler = require('express-async-handler');
const HomePageContent = require('../models/HomePageContentModel');

// @desc    Получить контент главной страницы
// @route   GET /api/content/homepage
// @access  Public
const getHomePageContent = asyncHandler(async (req, res) => {
    const content = await HomePageContent.findOne({ identifier: 'main' })
        .populate('featuredProducts')
        .populate('trendingProducts');
    
    if (content) {
        res.json(content);
    } else {
        // Если контент не найден (первый запуск), возвращаем пустую, но валидную структуру
        res.json({
            identifier: 'main',
            sliderBanners: [],
            featuredProducts: [],
            trendingProducts: [],
            blogPosts: [],
        });
    }
});

// @desc    Обновить контент главной страницы
// @route   PUT /api/content/homepage
// @access  Private/Admin
const updateHomePageContent = asyncHandler(async (req, res) => {
    const { sliderBanners, featuredProducts, trendingProducts, blogPosts } = req.body;

    // --- ПРОВЕРКА НА УНИКАЛЬНОСТЬ И НАЛИЧИЕ СЛАГОВ ---
    if (blogPosts && blogPosts.length > 0) {
        const slugs = blogPosts.map(p => p.slug);
        
        // Проверяем, что все слаги заполнены
        if(slugs.some(slug => !slug || slug.trim() === '')) {
            res.status(400);
            throw new Error('URL-слаг не может быть пустым для поста в блоге.');
        }
        
        // Проверяем, есть ли дубликаты внутри одного запроса
        const hasDuplicates = slugs.some((slug, index) => slugs.indexOf(slug) !== index);
        if (hasDuplicates) {
            res.status(400);
            throw new Error('Найдены дублирующиеся URL-слаги в постах блога. Каждый слаг должен быть уникальным.');
        }
    }
    // --- КОНЕЦ ПРОВЕРКИ ---

    const updatedContent = await HomePageContent.findOneAndUpdate(
        { identifier: 'main' },
        { 
            $set: {
                sliderBanners: sliderBanners || [],
                featuredProducts: featuredProducts || [],
                trendingProducts: trendingProducts || [],
                blogPosts: blogPosts || [],
            }
        },
        { new: true, upsert: true, runValidators: true }
    ).populate('featuredProducts').populate('trendingProducts');

    res.json(updatedContent);
});

module.exports = { getHomePageContent, updateHomePageContent };