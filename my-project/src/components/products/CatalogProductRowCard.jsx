// src/components/products/CatalogProductRowCard.jsx
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrashAlt, FaChevronRight, FaStar, FaAward, FaFire } from 'react-icons/fa';

const CatalogProductRowCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems = [] } = useCart(); 

  if (!product || typeof product !== 'object') return null; 

  const isInCart = cartItems.some(item => item.customId === product.customId);
  const { onSale, salePriceValue, priceValue } = product;
  const displayPrice = onSale && salePriceValue > 0 ? salePriceValue : priceValue;
  const oldPrice = onSale && salePriceValue > 0 && priceValue > salePriceValue ? priceValue : null;

  const handleCartAction = (e) => {
    e.preventDefault();
    const fullProductName = `${product.name?.[0] || 'Название товара'} ${product.ram ? `(${product.ram}/${product.storage}ГБ)` : ''} ${product.color || ''}`.trim();

    const productDataForCart = {
      _id: product._id,
      customId: product.customId,
      // Используем полное имя
      name: fullProductName,
      imageUrl: product.imageUrl,
      priceValue: displayPrice,
      // Добавляем originalPriceValue для расчета скидки
      originalPriceValue: product.priceValue,
      productLink: product.productLink,
      quantity: 1,
      cartItemId: product.customId,
    };

    if (isInCart) {
      removeFromCart(product.customId);
    } else {
      addToCart(productDataForCart);
    }
  };
  
  const productNameForDisplay = product.name?.[0] || 'Название товара';
  const altTitleName = Array.isArray(product.name) ? product.name.join(' ') : String(product.name || '');
  const productDetailLink = product.productLink || `/product/${product.customId}`;
  
  const variantName = `${product.ram ? `(${product.ram}/` : ''}${product.storage ? `${product.storage}ГБ)` : ''} ${product.color || ''}`.trim();

  return (
    <div className="group flex flex-col md:flex-row bg-brand-bg-black rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl mb-6 relative isolate">
        <div className="absolute inset-0 z-[-1] rounded-xl bg-gradient-to-tl from-brand-blue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out"></div>
      <Link to={productDetailLink} className="block md:w-1/4 lg:w-1/5 flex-shrink-0 relative aspect-square md:aspect-auto flex items-center justify-center">
        <img src={product.imageUrl || '/images/placeholder.png'} alt={altTitleName} className="w-full h-full object-contain p-4 transition-transform duration-500" />
      </Link>
      
      <div className="p-4 md:p-5 flex-grow flex flex-col justify-between">
        <div>
            <div className="flex items-start justify-between mb-1">
                <div>
                    <h3 className="text-sm md:text-base font-bold text-white transition-colors" title={altTitleName}>
                        <Link to={productDetailLink} className="hover:text-brand-blue">
                                    {productNameForDisplay} {variantName}
                                </Link>
                    </h3>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                    {product.isFeatured && (<span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full flex items-center gap-1"><FaAward />Рекомендуем</span>)}
                    {product.isTrending && (<span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1"><FaFire />В тренде</span>)}
                </div>
            </div>

          <div className="flex items-center text-yellow-400 mb-2 text-xs">
            {[...Array(Math.floor(product.rating || 0))].map((_, i) => <FaStar key={`star-${i}`} />)}
            {[...Array(5 - Math.floor(product.rating || 0))].map((_, i) => <FaStar key={`graystar-${i}`} className="text-gray-600" />)}
            <span className="ml-2 text-brand-gray-light">({product.numReviews || 0} отзывов)</span>
          </div>
          
          {Array.isArray(product.keySpecs) && product.keySpecs.length > 0 && (
            <ul className="text-xs text-brand-gray-light space-y-0.5 mb-3 hidden sm:block max-h-16 overflow-hidden">
              {product.keySpecs.slice(0, 3).map((spec, index) => (
                (spec && typeof spec.label === 'string' && typeof spec.value === 'string') ? (<li key={index} className="truncate"><span className="font-semibold text-gray-400">{spec.label}:</span> {spec.value}</li>) : null
              ))}
            </ul>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-3 mb-3">
            <p className={`text-lg md:text-xl font-bold ${oldPrice ? 'text-red-500' : 'text-brand-blue'}`}>{(displayPrice || 0).toLocaleString('ru-RU')} ₽</p>
            {oldPrice && (<p className="text-sm text-gray-500 line-through">{oldPrice.toLocaleString('ru-RU')} ₽</p>)}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
            {product.countInStock > 0 ? (
                <button onClick={handleCartAction} className={`w-full sm:w-auto flex items-center justify-center text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-300 text-xs shadow-md min-w-[130px] ${isInCart ? 'bg-red-600 hover:bg-red-500' : 'bg-brand-blue hover:bg-blue-700'}`}>
                  {isInCart ? <FaTrashAlt className="mr-1.5" /> : <FaShoppingCart className="mr-1.5" />}
                  {isInCart ? 'Убрать' : 'В корзину'}
                </button>
              ) : (<button disabled className="w-full sm:w-auto flex items-center justify-center text-gray-400 bg-gray-800 font-semibold py-2.5 px-4 rounded-md text-xs shadow-md min-w-[130px] cursor-not-allowed">Нет в наличии</button>)}
            <Link to={productDetailLink} className="w-full sm:w-auto flex items-center justify-center text-brand-blue border border-brand-blue hover:bg-brand-blue hover:text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-300 text-xs shadow-md min-w-[130px]">
              Подробнее <FaChevronRight className="ml-1.5 text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogProductRowCard;