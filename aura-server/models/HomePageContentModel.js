// aura-server/models/HomePageContentModel.js
const mongoose = require('mongoose');

// Схема для одного баннера в слайдере
const bannerSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    titleLine1: { type: String },
    titleLine2: { type: String },
    subTitle: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
}, {_id: false});

// Схема для поста в блоге
const blogPostSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    category: { type: String },
    date: { type: String },
    title: { type: String, required: true },
    excerpt: { type: String },
    fullText: { type: String },
    slug: { type: String, required: true },
}, { 
    _id: false 
});

const homePageContentSchema = new mongoose.Schema({
    identifier: { type: String, default: 'main', unique: true },
    sliderBanners: [bannerSchema],
    featuredProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    trendingProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    blogPosts: [blogPostSchema]
}, {
    timestamps: true,
});

const HomePageContent = mongoose.model('HomePageContent', homePageContentSchema);

module.exports = HomePageContent;