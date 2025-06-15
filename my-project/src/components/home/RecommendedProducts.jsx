// src/components/home/RecommendedProducts.jsx
import React from 'react';
import CompactProductCard from '../products/CompactProductCard';
import SectionTitle from '../common/SectionTitle';

const RecommendedProducts = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return null; 
  }

  return (
    <section className="py-12 md:py-16"> 
      <div className="container mx-auto px-4">
        <SectionTitle 
          mainTitle="Aura Рекомендует" 
          centered={true} 
          className="mb-8 md:mb-10"
        />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {products.map((item) => (
            <CompactProductCard 
              key={item.customId || item._id}
              product={item} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;