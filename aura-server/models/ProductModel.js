// aura-server/models/ProductModel.js
const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const KeySpecSchema = new mongoose.Schema({
  label: { type: String },
  value: { type: String },
}, {_id: false});

const productSchema = new mongoose.Schema(
  {
    groupId: { type: String, index: true },
    name: [{ type: String, required: true }], 
    customId: { type: String, required: true, unique: true, index: true }, 
    imageUrl: { type: String, required: true }, 
    images: [String],
    price: { type: String, required: true }, 
    priceValue: { type: Number, required: true, index: true }, 
    productLink: { type: String, required: true },
    shortDescription: { type: String },
    manufacturer: { type: String, required: true, index: true },
    ram: { type: Number, index: true }, 
    storage: { type: Number, index: true },
    color: { type: String },
    colorHex: { type: String }, 
    screenSizeValue: { type: Number }, 
    keySpecs: [KeySpecSchema], 
    specifications: { type: mongoose.Schema.Types.Mixed }, 
    fullDescription: { type: String },
    countInStock: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, default: false, index: true }, // <<< НЕ ДОЛЖНО БЫТЬ required: true
    isFeatured: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    onSale: { type: Boolean, default: false, index: true },
    salePriceValue: { type: Number, default: null },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;