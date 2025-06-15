// src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import PageHeader from '../components/common/PageHeader';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

const CartPage = () => {
  const { cartItems, clearCart, cartItemCount } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItemCount === 0) {
        alert('Ваша корзина пуста.');
        return;
    }
    if (userInfo) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout'); 
    }
  };
  
  // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
  // Рассчитываем полные суммы и экономию.
  let originalTotal = 0;
  let cartTotalWithDiscount = 0;

  cartItems.forEach(item => {
    const finalPrice = item.priceValue || 0;
    const originalPrice = item.originalPriceValue || finalPrice;
    
    originalTotal += originalPrice * item.quantity;
    cartTotalWithDiscount += finalPrice * item.quantity;
  });

  const savings = originalTotal - cartTotalWithDiscount;

  return (
    <div className="bg-brand-bg-dark text-white min-h-screen">
      <PageHeader 
        title="Ваша Корзина"
        breadcrumbs={[
          { label: 'Главная', path: '/' },
          { label: 'Каталог', path: '/catalog' },
          { label: 'Корзина' }
        ]}
        className="py-6 md:py-8"
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-brand-bg-black p-8 rounded-xl shadow-lg">
            <svg className="mx-auto h-20 w-20 text-gray-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <h2 className="text-2xl font-semibold text-white mb-4">Ваша корзина пуста</h2>
            <p className="text-brand-gray-light mb-8">Самое время это исправить и добавить что-нибудь классное!</p>
            <Link to="/catalog" className="inline-flex items-center bg-brand-blue hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-300 shadow hover:shadow-lg"><FaShoppingCart className="mr-2" />Перейти в каталог</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-xl font-semibold text-white mb-4">Товары в корзине ({cartItemCount})</h2>
              <div className="space-y-4">
                {cartItems.map(item => (<CartItem key={item.cartItemId} item={item} />))}
              </div>
            </div>

            <div className="lg:w-1/3 mt-8 lg:mt-0 lg:sticky lg:top-24 self-start">
              <div className="bg-brand-bg-black p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 pb-3 border-b border-brand-border-gray">Сумма заказа</h2>
                
                <div className="flex justify-between items-center mb-3 text-sm text-brand-gray-light">
                  <span>Товары ({cartItemCount} шт.):</span>
                  <span>{originalTotal.toLocaleString('ru-RU')} ₽</span>
                </div>
                
                {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
                {/* Отображаем выгоду, если она есть */}
                {savings > 0 && (
                    <div className="flex justify-between items-center mb-3 text-sm text-green-400">
                        <span>Ваша выгода:</span>
                        <span>- {savings.toLocaleString('ru-RU')} ₽</span>
                    </div>
                )}
                
                <div className="flex justify-between items-center mb-6 text-sm text-brand-gray-light">
                  <span>Доставка:</span>
                  <span>Бесплатно</span>
                </div>

                <div className="flex justify-between items-center mb-6 pt-3 border-t border-brand-border-gray">
                  <p className="text-lg font-bold text-white">Итого:</p>
                  <p className="text-2xl font-bold text-brand-blue">{cartTotalWithDiscount.toLocaleString('ru-RU')} ₽</p>
                </div>
                
                <button onClick={handleCheckout} className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 mb-3 shadow hover:shadow-md">Оформить заказ</button>
                <button onClick={clearCart} className="w-full border border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-medium py-2.5 px-6 rounded-md transition-colors duration-300 text-sm flex items-center justify-center"><FaTrash className="mr-2 text-xs"/>Очистить корзину</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;