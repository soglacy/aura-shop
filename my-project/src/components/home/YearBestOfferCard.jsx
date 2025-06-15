// src/components/home/YearBestOfferCard.jsx
import React from 'react';
// import { Link } from 'react-router-dom';

// Props: tag, title, description, imageUrl, imageAlt, linkUrl
const YearBestOfferCard = ({ tag, title, description, imageUrl, imageAlt = "Галерея", linkUrl = "#" }) => {
  return (
    // Основано на .matches-block
    <div className="matches-block border-b border-brand-border-gray last:border-b-0">
      <div className="inner-block p-8 md:p-12 lg:p-14 hover:bg-brand-bg-black transition-colors duration-300">
        <div className="flex flex-wrap -mx-4 items-center"> {/* row clearfix, items-center для выравнивания по вертикали */}
          
          {/* Колонка с содержанием (content-column) */}
          <div className="content-column w-full lg:w-7/12 px-4 mb-6 lg:mb-0"> {/* col-lg-7 */}
            <div className="inner-column">
              {tag && (
                <ul className="tags mb-4"> {/* Отступ для тега */}
                  <li className="inline-block text-sm text-brand-gray-light uppercase border border-brand-border-gray py-2 px-6">
                    {tag}
                  </li>
                </ul>
              )}
              <h2 className="text-2xl md:text-3xl font-bold text-white uppercase mb-3 md:mb-4">
                <a href={linkUrl} className="text-white hover:text-brand-blue transition-colors">
                  {title}
                </a>
              </h2>
              {/* Убрал <br /> после h2, Tailwind управляет отступами через mb-* */}
              <h3 className="text-base md:text-lg text-brand-gray-light leading-relaxed">
                {description}
              </h3>
            </div>
          </div>
          
          {/* Колонка с изображением (default-portfolio-item) */}
          {/* Используем классы, похожие на ProductCard для изображения, но без оверлея по умолчанию */}
          <div className="w-full lg:w-5/12 px-4"> {/* col-lg-4, но 5/12 для суммы с 7/12 */}
            <div className="inner-box relative overflow-hidden rounded-md shadow-md 
                            transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <figure className="image-box relative">
                <img src={imageUrl} alt={imageAlt} className="w-full h-auto block" />
              </figure>
              {/* Если нужен будет оверлей при наведении на изображение, можно добавить сюда, как в ProductCard */}
              {/* <div className="overlay-box absolute inset-0"></div> */}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default YearBestOfferCard;