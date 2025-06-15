// src/components/products/OfferCard.jsx
import React from 'react';
// import { Link } from 'react-router-dom';

// Props: imageUrl, discountText, productName (может быть массив), productLink
const OfferCard = ({ imageUrl, discountText, productName, productLink = "#" }) => {
  const nameParts = Array.isArray(productName) ? productName : [productName];

  return (
    // Основано на .news-block и .inner-box.hvr-bob
    // hvr-bob - пока простой hover эффект, как в ProductCard
    <div className="w-full wow fadeInUp mb-8 group"> {/* fadeInUp для анимации, если будете использовать */}
      <div className="inner-box relative overflow-hidden shadow-lg rounded-md 
                      transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                      bg-brand-bg-black"> {/* Фон для карточки, если он отличается от общего фона секции */}
        <div className="image relative block overflow-hidden">
          <a href={productLink} className="block"> {/* Обертка-ссылка для изображения */}
            <img 
              src={imageUrl} 
              alt={nameParts.join(' ')} 
              className="w-full h-auto block transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-75"
            />
          </a>
        </div>
        <div className="lower-content mt-3 p-4 md:p-5 text-left"> {/* text-left если нужно, по умолчанию left */}
          {discountText && (
            <div className="post-date inline-block text-sm font-bold text-brand-blue-dark bg-white 
                            py-2 px-4 uppercase tracking-wider mb-3
                            group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
              {discountText}
            </div>
          )}
          <h3 className="text-lg md:text-xl font-bold text-white leading-snug tracking-wide uppercase">
            <a href={productLink} className="text-white hover:text-brand-blue transition-colors duration-300">
              {nameParts.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < nameParts.length - 1 && <br />}
                </React.Fragment>
              ))}
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;