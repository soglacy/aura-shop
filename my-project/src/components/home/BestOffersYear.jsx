// src/components/home/BestOffersYear.jsx
import React from 'react';
import YearBestOfferCard from './YearBestOfferCard';
import SectionTitle from '../common/SectionTitle'; // <-- ПРОВЕРЬТЕ ПУТЬ ИМПОРТА

const bestOfferItems = [
  {
    id: 1,
    tag: 'В тренде',
    title: 'Vivo X100 Ultra',
    description: 'Система из трех камер...',
    imageUrl: '/images/gallery/4.png',
    linkUrl: '#',
  },
  {
    id: 2,
    tag: 'В тренде',
    title: 'Honor 200 Pro',
    description: 'Тройная камера обеспечивает...',
    imageUrl: '/images/gallery/5.png',
    linkUrl: '#',
  },
  {
    id: 3,
    tag: 'В тренде',
    title: 'Poco X6 Pro',
    description: 'Модель с тремя камерами...',
    imageUrl: '/images/gallery/6.png',
    linkUrl: '#',
  },
  {
    id: 4,
    tag: 'В тренде',
    title: 'Google Pixel 9',
    description: 'Три камеры на задней панели...',
    imageUrl: '/images/gallery/1.png',
    linkUrl: '#',
  }
];

const BestOffersYear = () => {
  return (
    <section className="matches-section py-12 md:py-20 bg-brand-bg-dark">
      <div className="container mx-auto px-4">
        
        {/* --- НАЧАЛО ИЗМЕНЕНИЯ --- */}
        <SectionTitle 
          subTitle="Посмотрите нашу подборку"
          mainTitle="Лучшие предложения года"
          centered={true}
        />
        {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
        
        <div className="matches-info-tabs">
          <div className="matches-tabs tabs-box border border-brand-border-gray rounded-md">
            <div className="tabs-content">
              <div className="tab active-tab" id="prod-all">
                <div className="content">
                  {bestOfferItems.map((item) => (
                    <YearBestOfferCard
                      key={item.id} // Используем item.id для ключа
                      tag={item.tag}
                      title={item.title}
                      description={item.description}
                      imageUrl={item.imageUrl}
                      linkUrl={item.linkUrl}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestOffersYear;