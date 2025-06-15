// src/components/home/CategoriesSection.jsx
import React from 'react';
import SectionTitle from '../common/SectionTitle';

const categories = [
    { id: 1, name: 'Смартфоны', imageUrl: '/images/temp/category-smartphones.jpg', link: '/catalog/smartphones' },
    { id: 2, name: 'Ноутбуки', imageUrl: '/images/temp/category-laptops.jpg', link: '/catalog/laptops' },
    { id: 3, name: 'Аксессуары', imageUrl: '/images/temp/category-accessories.jpg', link: '/catalog/accessories' },
    { id: 4, name: 'Гаджеты', imageUrl: '/images/temp/category-gadgets.jpg', link: '/catalog/gadgets' },
];

const CategoriesSection = () => {
  return (
    <section className="py-12 md:py-20 bg-brand-bg-dark">
      <div className="container mx-auto px-4">
        <SectionTitle mainTitle="Популярные категории" centered={true} className="mb-10 md:mb-12" />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {categories.map(category => (
            <a key={category.id} href={category.link} className="group block relative rounded-lg overflow-hidden shadow-lg aspect-square md:aspect-[4/3] hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <img src={category.imageUrl} alt={category.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-colors duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-white text-base md:text-lg lg:text-xl font-semibold text-center">{category.name}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;