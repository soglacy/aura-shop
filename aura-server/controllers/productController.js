// aura-server/controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/ProductModel');

// @desc    Получить товары
const getProducts = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.query.from !== 'admin') { filter.isPublished = true; }
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Получить ОПУБЛИКОВАННЫЙ товар и все его варианты
const getProductByCustomId = asyncHandler(async (req, res) => {
    // Находим основной товар по customId
    const product = await Product.findOne({ customId: req.params.customId, isPublished: true })
                                 .populate('reviews.user', 'name');

    if (product) {
        let allVariants = [];
        // Если у товара есть groupId, ищем все товары в этой группе
        if (product.groupId) {
            allVariants = await Product.find({ 
                groupId: product.groupId, 
                isPublished: true 
            }).select('name customId color colorHex ram storage productLink');
        } else {
            // Если groupId нет, то вариант только один - он сам
            allVariants = [product];
        }

        // Отправляем на фронтенд основной товар и ПОЛНЫЙ список вариантов
        res.json({ product, allVariants });
    } else {
        res.status(404);
        throw new Error('Товар не найден');
    }
});

// @desc    Получить ЛЮБОЙ товар по ID для админки
const getProductByIdForAdmin = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ customId: req.params.customId });
    if (product) { res.json(product); } else { res.status(404); throw new Error('Товар не найден'); }
});

// @desc    Создать новый товар (черновик)
// @desc    Создать новый товар (черновик)
const createProduct = asyncHandler(async (req, res) => {
  const timestamp = Date.now();
  const isCopy = Object.keys(req.body).length > 1;
  let productData;
  const newCustomId = `product-${timestamp}`; // <-- Генерируем ID один раз

  if (isCopy) {
      const { _id, createdAt, updatedAt, ...copyData } = req.body;
      productData = { 
          ...copyData, 
          customId: newCustomId, // <-- Используем новый ID
          productLink: `/product/${newCustomId}`, // <-- АВТОМАТИЧЕСКИ ГЕНЕРИРУЕМ ССЫЛКУ
          isPublished: false, 
          user: req.user._id 
      };
  } else {
      productData = {
          name: [`Новый товар ${timestamp}`],
          customId: newCustomId, // <-- Используем новый ID
          groupId: `group-${timestamp}`,
          productLink: `/product/${newCustomId}`, // <-- АВТОМАТИЧЕСКИ ГЕНЕРИРУЕМ ССЫЛКУ
          user: req.user._id,
          isPublished: false,
          imageUrl: '/images/placeholder.png', 
          price: '0 ₽', 
          priceValue: 0,
          manufacturer: 'Не указан', 
          countInStock: 0,
          rating: 0, 
          numReviews: 0,
      };
  }
  const product = new Product(productData);
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Обновить товар
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ customId: req.params.customId });
  if (product) {
      const updateData = { ...req.body };
      // Принудительно обновляем productLink на основе customId из данных
      if (updateData.customId) {
          updateData.productLink = `/product/${updateData.customId}`;
      }
      
      const updatedProduct = await Product.findByIdAndUpdate(
          product._id, 
          updateData, // <-- Используем измененные данные
          { new: true, runValidators: true } 
      );
      res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Товар не найден');
  }
});


// @desc    Удалить товар
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ customId: req.params.customId });
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Товар удален' });
    } else {
        res.status(404);
        throw new Error('Товар не найден');
    }
});

// @desc    Создать новый отзыв
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
        res.status(400);
        throw new Error('Оценка и комментарий обязательны');
    }
    const product = await Product.findOne({ customId: req.params.customId });
    if (product) {
        if (!product.isPublished) {
            res.status(400);
            throw new Error('Нельзя оставить отзыв на неопубликованный товар');
        }
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Вы уже оставляли отзыв на этот товар');
        }
        const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'Отзыв добавлен' });
    } else {
        res.status(404);
        throw new Error('Товар не найден');
    }
});


module.exports = {
  getProducts,
  getProductByCustomId,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductByIdForAdmin,
};