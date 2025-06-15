// src/components/cart/CartItem.jsx
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
    const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

    const productDetailLink = item.productLink || `/product/${item.customId}`;
  
    const finalPricePerItem = item.priceValue || 0;
    const originalPricePerItem = item.originalPriceValue || finalPricePerItem;
    const hasDiscount = originalPricePerItem > finalPricePerItem;

    const finalTotalPrice = (finalPricePerItem * item.quantity).toLocaleString('ru-RU');
    const originalTotalPrice = (originalPricePerItem * item.quantity).toLocaleString('ru-RU');
  
    const cartActionIdentifier = item.cartItemId || item.customId || item._id;
  
    if (!item || !cartActionIdentifier) {
      console.error("CartItem: item or item identifier is missing", item);
      return null;
    }

  return (
    <div className="cart-item group relative isolate flex flex-col sm:flex-row items-center justify-between p-4 bg-brand-bg-black rounded-lg shadow-md transition-all duration-300">
        <div className="absolute inset-0 z-[-1] rounded-lg bg-gradient-to-tl from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="flex items-center w-full sm:w-7/12 mb-4 sm:mb-0">
            <Link to={productDetailLink} className="flex-shrink-0">
                <img 
                    src={item.imageUrl || '/images/placeholder.png'} 
                    alt={item.name} 
                    // --- ИЗМЕНЕНИЯ ЗДЕСЬ ---
                    // 1. Убран фон (bg-gray-900/50)
                    // 2. Увеличен размер (w-24 h-24)
                    // 3. Удалена анимация (group-hover:scale-105)
                    className="w-24 h-24 object-contain p-1 rounded-md mr-6"
                />
            </Link>
            <div className="flex-grow">
                <Link to={productDetailLink} className="hover:text-brand-blue transition-colors">
                    <h3 className="text-sm md:text-base font-semibold text-white leading-tight">{item.name}</h3>
                </Link>
            </div>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-5/12 justify-between sm:justify-end">
            <div className="quantity-controls flex items-center border border-gray-600 rounded-md">
                <button 
                    onClick={() => decreaseQuantity(cartActionIdentifier)}
                    className="px-2.5 py-1.5 text-white hover:bg-gray-700 transition-colors rounded-l-md disabled:opacity-50"
                    aria-label="Уменьшить количество"
                    disabled={item.quantity <= 1}
                >
                    <FaMinus size={12} />
                </button>
                <span className="px-3 py-1.5 text-white text-sm border-l border-r border-gray-600 min-w-[35px] text-center">
                    {item.quantity}
                </span>
                <button 
                    onClick={() => increaseQuantity(cartActionIdentifier)}
                    className="px-2.5 py-1.5 text-white hover:bg-gray-700 transition-colors rounded-r-md"
                    aria-label="Увеличить количество"
                >
                    <FaPlus size={12} />
                </button>
            </div>

            <div className="text-sm md:text-base font-semibold min-w-[100px] text-right">
                {hasDiscount ? (
                    <div>
                        <span className="text-red-500 block">{finalTotalPrice} ₽</span>
                        <span className="font-normal text-xs text-gray-500 line-through block">{originalTotalPrice} ₽</span>
                    </div>
                ) : (
                    <span className="text-brand-blue">{finalTotalPrice} ₽</span>
                )}
            </div>

            <button 
                onClick={() => removeFromCart(cartActionIdentifier)}
                className="text-red-500 hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-500/10"
                aria-label="Удалить товар"
            >
                <FaTrash size={16} />
            </button>
        </div>
    </div>
  );
};

export default CartItem;