// src/pages/PromotionsPage.jsx
import React from 'react';
import PageHeader from '../components/common/PageHeader';
// import OfferCard from '../components/products/OfferCard'; // Предполагаем, что вы будете использовать карточку для акций

// Пример данных для акционных товаров.
const promotionItemsData = [
  {
    id: 'promo-vivo-x100', imageUrl: '/images/gallery/4.png', discountText: 'Скидка 15%', productName: ['Vivo X100 Ultra'],
    productLink: '/product/vivo-x100-ultra', description: 'Камерофон для тех, кто ценит каждый момент.', oldPrice: '105 000 ₽', newPrice: '88 990 ₽',
  },
  {
    id: 'promo-honor-200', imageUrl: '/images/gallery/5.png', discountText: 'Выгода 10 000 ₽', productName: ['Honor 200 Pro'],
    productLink: '/product/honor-200-pro', description: 'Невероятная гибкость при съемке.', oldPrice: '65 990 ₽', newPrice: '55 990 ₽',
  },
  {
    id: 'promo-poco-x6', imageUrl: '/images/gallery/6.png', discountText: 'Скидка 12%', productName: ['Poco X6 Pro'],
    productLink: '/product/poco-x6-pro', description: 'Система из трёх камер для превосходных фото.', oldPrice: '45 500 ₽', newPrice: '39 990 ₽',
  },
];

const PromotionsPage = () => {
  return (
    <div className="bg-brand-bg-dark text-white min-h-screen">
      <PageHeader 
        title="Акции"
        subText="Специальные предложения и скидки на лучшие гаджеты"
        breadcrumbs={[
          { label: 'Главная', path: '/' },
          { label: 'Акции' }
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {promotionItemsData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {promotionItemsData.map((item) => (
              // Здесь должна быть ваша кастомная карточка для акционного товара
              // Например, вы можете создать PromotionCard.jsx или доработать OfferCard.jsx
              <div key={item.id} className="group bg-brand-bg-black rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <a href={item.productLink} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={item.imageUrl} alt={item.productName.join(' ')} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                    {item.discountText && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                        {item.discountText}
                      </span>
                    )}
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="text-md md:text-lg font-semibold text-white mb-2 truncate group-hover:text-brand-blue transition-colors" title={item.productName.join(' ')}>
                      {item.productName.join(' ')}
                    </h3>
                    {item.description && <p className="text-xs text-brand-gray-light mb-3 line-clamp-2 h-8">{item.description}</p>}
                    <div className="flex items-baseline gap-2">
                        {item.oldPrice && <p className="text-sm text-gray-500 line-through">{item.oldPrice}</p>}
                        <p className="text-lg md:text-xl font-bold text-brand-blue">{item.newPrice || item.price}</p>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-white mb-4">Актуальных акций пока нет</h2>
            <p className="text-brand-gray-light">Загляните позже или посмотрите наши <a href="/blog.html" className="text-brand-blue hover:underline">основные предложения</a>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;