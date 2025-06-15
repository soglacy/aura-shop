// src/components/products/ProductCard.jsx
import React from 'react';
// import { Link } from 'react-router-dom';

const ProductCard = ({ imageUrl, productName, productLink = "#" }) => {
  const nameParts = Array.isArray(productName) ? productName : [productName];

  return (
    <div className="w-full group mb-8">
      <div className="inner-box relative overflow-hidden shadow-lg rounded-lg 
                      bg-brand-bg-black transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <a href={productLink} className="block">
          <figure className="image-box relative aspect-[1/1] md:aspect-[4/3]"> {/* Аспект для контроля высоты */}
            <img 
              src={imageUrl} 
              alt={nameParts.join(' ')} 
              className="w-full h-full object-contain md:object-cover block transition-transform duration-500 group-hover:scale-105 p-2 md:p-0" // object-contain для мобильных
            />
          </figure>
          {/* Оверлей */}
          <div className="overlay-box absolute inset-0 bg-black bg-opacity-0 
                          group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center p-4">
            <div className="content text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
                <span className="text-white hover:text-brand-blue transition-colors">
                  {nameParts.map((part, index) => (
                    <React.Fragment key={index}>
                      {part}
                      {index < nameParts.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </h3>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;