// src/components/products/CompactProductCard.jsx
import React from 'react';
import { FiArrowUpRight, FiTag } from 'react-icons/fi';

const CompactProductCard = ({ product }) => {
  if (!product) return null;

  // Логика получения данных остается прежней
  const { imageUrl, name, productLink, shortDescription, priceValue, salePriceValue, onSale, ram, storage, color } = product; 
  
  const fullProductName = [
    name?.[0] || 'Название товара',
    ram && storage ? `(${ram}/${storage}ГБ)` : '',
    color || ''
  ].filter(Boolean).join(' ').trim();
  
  const displayPrice = onSale && salePriceValue > 0 ? salePriceValue : priceValue;
  const oldPrice = onSale && salePriceValue > 0 && priceValue > salePriceValue ? priceValue : null;

  return (
    <div
      className="group bg-brand-bg-black rounded-xl shadow-lg hover:shadow-2xl 
                 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 relative isolate h-full flex flex-col"
    >
      <div 
        className="absolute inset-0 z-[-1] rounded-xl
                   bg-gradient-to-tl from-brand-blue/10 via-transparent to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out"
      ></div>

      <a href={productLink || '#'} className="block aspect-square overflow-hidden relative">
        <img 
          src={imageUrl || '/images/placeholder.png'} 
          alt={fullProductName} 
          className="w-full h-full object-contain p-3 md:p-4 transition-transform duration-500 group-hover:scale-105"
        />
        {onSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow flex items-center gap-1">
            <FiTag size={12} /> Акция
          </span>
        )}
      </a>
      
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-brand-blue transition-colors duration-300 mb-1 h-10 sm:h-12 flex items-center" title={fullProductName}>
          <a href={productLink || '#'} className="line-clamp-2 hover:underline">
            {fullProductName}
          </a>
        </h3>
        

        <div className="mt-auto flex items-baseline gap-2">
            <p className={`font-bold ${oldPrice ? 'text-red-500' : 'text-brand-blue'} text-sm md:text-base`}>
                {(displayPrice || 0).toLocaleString('ru-RU')} ₽
            </p>
            {oldPrice && (
                <p className="text-xs text-gray-500 line-through">
                    {oldPrice.toLocaleString('ru-RU')} ₽
                </p>
            )}
        </div>
      </div>

      <a href={productLink || '#'} className="absolute bottom-3 right-3 w-10 h-10 md:w-12 md:h-12 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-md hover:bg-brand-blue hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 focus:outline-none" title="Подробнее">
        <FiArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
      </a>
    </div>
  );
};

export default CompactProductCard;