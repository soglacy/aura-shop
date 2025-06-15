// aura-server/controllers/orderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const Notification = require('../models/NotificationModel');
const mongoose = require('mongoose'); // mongoose все еще нужен для ObjectId.isValid

// @desc    Создать новый заказ
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  // Получаем все необходимые данные из тела запроса
  const { orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Нет товаров в заказе');
  }

  // --- БЛОК БЕЗОПАСНОСТИ: ПЕРЕСЧЕТ ЦЕН НА СЕРВЕРЕ ---
  // Этот блок ОБЯЗАТЕЛЕН, чтобы клиент не мог подделать цены.

  // 1. Получаем ID всех товаров из корзины
  const productIds = orderItems.map(item => item.product);

  // 2. Находим эти товары в БД, чтобы получить АКТУАЛЬНЫЕ цены и остатки
  const productsFromDB = await Product.find({ '_id': { $in: productIds } });

  // 3. Создаем карту "ID товара -> Товар" для удобного доступа
  const productMap = productsFromDB.reduce((acc, product) => {
    acc[product._id] = product;
    return acc;
  }, {});
  
  // 4. Пересчитываем состав заказа на сервере с актуальными данными из БД
  let finalOrderItems = [];
  for (const itemFromClient of orderItems) {
    const productFromDB = productMap[itemFromClient.product];

    if (!productFromDB) {
      res.status(404);
      throw new Error(`Товар с ID "${itemFromClient.product}" был удален из базы.`);
    }

    if (productFromDB.countInStock < itemFromClient.quantity) {
      res.status(400);
      throw new Error(`Недостаточно товара "${productFromDB.name[0]}" на складе.`);
    }

    const actualPrice = productFromDB.onSale && productFromDB.salePriceValue > 0
                        ? productFromDB.salePriceValue
                        : productFromDB.priceValue;

    finalOrderItems.push({
      ...itemFromClient,
      price: actualPrice, // Используем АКТУАЛЬНУЮ цену с сервера
    });
  }
  
  // 5. Рассчитываем итоговую сумму по товарам на сервере
  const serverCalculatedItemsPrice = finalOrderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  // --- КОНЕЦ БЛОКА БЕЗОПАСНОСТИ ---

  // 6. Создаем заказ с проверенными данными
  const order = new Order({
    orderItems: finalOrderItems, // Используем пересчитанный на сервере состав
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice: serverCalculatedItemsPrice, // Используем пересчитанную на сервере сумму
    shippingPrice, // Стоимость доставки берем с клиента
    totalPrice,    // Общую сумму тоже, т.к. она зависит от доставки
    isPaid: paymentMethod.includes('Картой онлайн'),
    paidAt: paymentMethod.includes('Картой онлайн') ? Date.now() : null,
  });

  // 7. Сохраняем заказ
  const createdOrder = await order.save();

  // 8. Обновляем остатки на складе
  for (const item of createdOrder.orderItems) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { countInStock: -item.quantity } }
    );
  }
  
  res.status(201).json(createdOrder);
});

// --- Остальные функции контроллера остаются без изменений ---

// @desc    Получить заказы текущего пользователя
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401); throw new Error('Не авторизован для просмотра заказов');
  }
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Получить заказ по ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401); throw new Error('Не авторизован');
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400); throw new Error('Некорректный ID заказа');
  }
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    if (order.user._id.equals(req.user._id) || req.user.isAdmin) {
      res.json(order);
    } else {
      res.status(403); throw new Error('Нет прав для просмотра этого заказа');
    }
  } else {
    res.status(404); throw new Error('Заказ не найден');
  }
});

// @desc    Получить все заказы (для админки)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Обновить статус доставки заказа
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = req.body.isDelivered;
    order.deliveredAt = req.body.isDelivered ? Date.now() : null;
    
    const updatedOrder = await order.save();
    
    if (req.body.isDelivered) {
        await Notification.create({
            user: order.user,
            title: 'Заказ доставлен!',
            message: `Ваш заказ №${order._id.toString().slice(-6)} был успешно доставлен. Спасибо за покупку!`,
            link: `/profile/orders/${order._id}`
        });
    } else {
        await Notification.create({
            user: order.user,
            title: 'Обновление по заказу',
            message: `Статус доставки для заказа №${order._id.toString().slice(-6)} был обновлен.`,
            link: `/profile/orders/${order._id}`
        });
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Заказ не найден');
  }
});

// @desc    Удалить заказ
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        await order.deleteOne();
        res.json({ message: 'Заказ удален' });
    } else {
        res.status(404);
        throw new Error('Заказ не найден');
    }
});

module.exports = { 
  addOrderItems, 
  getMyOrders, 
  getOrderById, 
  getOrders,
  updateOrderToDelivered,
  deleteOrder,
};