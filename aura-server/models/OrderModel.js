// aura-server/models/OrderModel.js
const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
  name: [{ type: String, required: true }], // Название товара (может быть массивом)
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true }, // Цена за единицу на момент заказа
  product: { // Ссылка на товар в коллекции Products
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product', // Если ваша модель товара называется 'Product'
  },
  customId: { type: String, required: true }, // customId товара
  selectedColor: { type: String },
  selectedMemory: { type: String },
});

const orderSchema = mongoose.Schema(
  {
    user: { // Ссылка на пользователя, сделавшего заказ
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Если ваша модель пользователя называется 'User'
    },
    orderItems: [orderItemSchema],
    shippingAddress: { // Адрес доставки (если нужен)
      address: { type: String }, //, required: true },
      city: { type: String }, //, required: true },
      postalCode: { type: String }, //, required: true },
      country: { type: String }, //, required: true },
    },
    paymentMethod: { // Способ оплаты
      type: String,
      required: true,
    },
    paymentResult: { // Результат "оплаты" (для имитации)
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: { // Сумма по товарам
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: { // Стоимость доставки
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: { // Итоговая сумма
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;