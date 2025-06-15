// src/components/products/CatalogItemCard.jsx
import React from 'react';
import { useCart } from '../../contexts/CartContext'; // Убедитесь, что путь к CartContext правильный
import { FaShoppingCart, FaTrashAlt } from 'react-icons/fa';

// Props: product (объект товара), productLink
const CatalogItemCard = ({ product, productLink = "#" }) => {
  const { addToCart, removeFromCart, cartItems } = useCart(); 

  const isInCart = cartItems.find(item => item.id === product.id);

  const handleButtonClick = (e) => {
    e.preventDefault(); 
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  const nameParts = Array.isArray(product.productName) ? product.productName : [product.productName];

  return (
    <div className="w-full wow fadeInUp mb-8 group"> {/* Если используете WOW, класс fadeInUp нужен */}
      <div className="inner-box relative overflow-hidden shadow-lg rounded-md 
                      transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                      bg-brand-bg-black flex flex-col h-full">
        
        <a href={productLink} className="block">
          <div className="image relative block overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={nameParts.join(' ')} 
              className="w-full h-auto aspect-[3/4] object-cover block transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </div>
        </a>

        <div className="lower-content p-4 md:p-5 text-left flex flex-col flex-grow">
          <h5 className="card-title product-name text-base md:text-lg font-semibold text-white leading-tight mb-2 flex-grow">
            <a href={productLink} className="text-white hover:text-brand-blue transition-colors duration-300">
              {nameParts.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < nameParts.length - 1 && <br />}
                </React.Fragment>
              ))}
            </a>
          </h5>
          <p className="card-text text-brand-blue text-xl font-bold mb-3 product-price">
            {product.price}
          </p>
          <button 
            className={`but mt-auto w-full text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-300 text-sm flex items-center justify-center
                        ${isInCart 
                          ? 'bg-red-600 hover:bg-red-500'
                          : 'bg-gray-700 hover:bg-brand-blue' // Изначальный стиль кнопки "Добавить"
                        }`}
            type="button" 
            onClick={handleButtonClick}
          >
            {isInCart ? (
              <>
                <FaTrashAlt className="mr-2" /> Убрать из корзины
              </>
            ) : (
              <>
                <FaShoppingCart className="mr-2" /> Добавить в корзину
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogItemCard;