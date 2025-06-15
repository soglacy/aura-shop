// src/pages/OrderSuccessPage.jsx
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderDetails = location.state;

  if (!orderDetails || !orderDetails.orderId) {
    return <Navigate to="/" replace />;
  }

  // ИСПРАВЛЕНИЕ: Проверяем наличие totalPrice и используем его
  const totalAmount = orderDetails.totalPrice !== undefined ? orderDetails.totalPrice : 0;

  return (
    <div className="bg-brand-bg-dark text-white min-h-screen">
      <PageHeader title="Заказ успешно оформлен!" />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="bg-brand-bg-black max-w-lg mx-auto p-8 md:p-10 rounded-xl shadow-2xl text-center">
          <FaCheckCircle className="text-green-500 text-6xl md:text-7xl mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            Спасибо, {orderDetails.customerName}!
          </h2>
          <p className="text-brand-gray-light mb-4">
            Ваш заказ <span className="font-semibold text-white">#{orderDetails.orderId.substring(0,8)}...</span> на сумму 
            {/* ИСПРАВЛЕНИЕ: Используем totalAmount */}
            <span className="font-semibold text-white"> {totalAmount.toLocaleString('ru-RU')} ₽ </span>
            успешно оформлен.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Мы свяжемся с вами в ближайшее время для подтверждения деталей. Вы также можете отслеживать статус заказа в вашем профиле.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/profile"
              className="w-full sm:w-auto bg-brand-blue hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
            >
              Перейти в профиль
            </Link>
            <Link
              to="/blog.html"
              className="w-full sm:w-auto border border-brand-border-gray hover:bg-gray-700 text-brand-gray-light font-semibold py-3 px-6 rounded-md transition-colors duration-300"
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;