// src/components/home/HotOffers.jsx
import React from 'react';
import OfferCard from '../products/OfferCard';
import SectionTitle from '../common/SectionTitle'; // <-- ПРОВЕРЬТЕ ПУТЬ ИМПОРТА

const hotOfferItems = [
  {
    id: 1,
    imageUrl: '/images/resource/1.png',
    discountText: 'Скидка 5%',
    productName: ['Samsung Galaxy S24 Ultra 12/512Gb', 'Жёлтый титан (Titanium Yellow)'],
    productLink: '/blog-single.html',
  },
  {
    id: 2,
    imageUrl: '/images/resource/2.png',
    discountText: 'Скидка 5%',
    productName: ['Samsung Galaxy S24 Ultra 12/512Gb', 'Фиолетовый титан (Titanium Violet)'],
    productLink: '/blog-single.html',
  },
  {
    id: 3,
    imageUrl: '/images/resource/3.png',
    discountText: 'Скидка 5%',
    productName: ['Samsung Galaxy S24 Ultra 12/512Gb', 'Серый титан (Titanium Gray)'],
    productLink: '/blog-single.html',
  },
];

const HotOffers = () => {
  return (
    <section className="py-12 md:py-20 bg-brand-bg-dark">
      <div className="container mx-auto px-4">
        
        {/* --- НАЧАЛО ИЗМЕНЕНИЯ --- */}
        <SectionTitle 
          subTitle="Горячие предложения"
          mainTitle="Только сейчас"
          centered={true}
        />
        {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
        
        <div className="flex flex-wrap -mx-4">
          {hotOfferItems.map((item) => ( // Убрал index
            <div 
              key={item.id} // Используем item.id для ключа
              className="w-full sm:w-1/2 md:w-1/3 px-4"
            >
              <OfferCard 
                imageUrl={item.imageUrl}
                discountText={item.discountText}
                productName={item.productName}
                productLink={item.productLink}
              />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default HotOffers;