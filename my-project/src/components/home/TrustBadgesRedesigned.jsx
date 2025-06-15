// src/components/home/TrustBadgesRedesigned.jsx
import React from 'react';
import SectionTitle from '../common/SectionTitle';
import { FaShippingFast, FaShieldAlt, FaCheckCircle, FaHeadset } from 'react-icons/fa';

const badges = [
  { id: 1, icon: <FaShippingFast />, title: 'Быстрая доставка', description: 'По всей стране в кратчайшие сроки' },
  { id: 2, icon: <FaShieldAlt />, title: 'Гарантия качества', description: 'Только оригинальная продукция' },
  { id: 3, icon: <FaCheckCircle />, title: 'Проверенные бренды', description: 'Мировые лидеры индустрии' },
  { id: 4, icon: <FaHeadset />, title: 'Поддержка клиентов', description: 'Мы всегда готовы помочь' },
];

const TrustBadgesRedesigned = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionTitle 
          subTitle="Почему выбирают нас"
          mainTitle="Наши Преимущества"
          centered={true} 
          className="mb-10 md:mb-12"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {badges.map(badge => (
            <div 
              key={badge.id} 
              className="bg-brand-bg-black p-6 rounded-xl shadow-lg text-center
                         transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-brand-blue text-4xl md:text-5xl mb-5 inline-block p-3 bg-gray-800 rounded-full">
                {badge.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{badge.title}</h3>
              <p className="text-sm text-brand-gray-light leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesRedesigned;