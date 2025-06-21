// src/components/home/BrandsCarousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // <-- 1. Импортируем Link

import 'swiper/css';
import 'swiper/css/navigation';

const brandsData = [
  { id: 1, name: 'Apple', logoUrl: '/images/brands/apple-logo.png', filterValue: 'Apple' },
  { id: 2, name: 'Samsung', logoUrl: '/images/brands/samsung-logo.png', filterValue: 'Samsung' },
  { id: 3, name: 'Honor', logoUrl: '/images/brands/honor-logo.png', filterValue: 'Honor' },
  { id: 4, name: 'Asus', logoUrl: '/images/brands/asus-logo.png', filterValue: 'Asus' },
  { id: 5, name: 'Realme', logoUrl: '/images/brands/realme-logo.png', filterValue: 'Realme' },
  { id: 6, name: 'Sony', logoUrl: '/images/brands/sony-logo.png', filterValue: 'Sony' },
  { id: 7, name: 'Infinix', logoUrl: '/images/brands/infinix-logo.png', filterValue: 'Infinix' },
];

const BrandsCarousel = () => {
  return (
    <section className="py-10 md:py-12 pb-6 md:pb-8 relative group">
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={4}
          navigation={{
            nextEl: '.brands-swiper-button-next',
            prevEl: '.brands-swiper-button-prev',
          }}
          loop={true}
          grabCursor={true}
          breakpoints={{
            640: { slidesPerView: 5, spaceBetween: 20 },
            768: { slidesPerView: 7, spaceBetween: 24 },
            1024: { slidesPerView: 8, spaceBetween: 28 },
          }}
          className="brands-swiper"
        >
          {brandsData.map(brand => (
            <SwiperSlide key={brand.id} className="flex items-center justify-center">
              {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
              {/* 2. Оборачиваем карточку в Link */}
              <Link 
                 // 3. Формируем правильный URL с query-параметром
                 to={`/catalog?manufacturers=${encodeURIComponent(brand.filterValue)}`}
                 className="group/slide block relative p-4 rounded-2xl w-full aspect-[2/1]
                            bg-brand-bg-black border border-brand-border-gray/20
                            transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tl from-brand-blue/15 to-transparent opacity-0 group-hover/slide:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={brand.logoUrl} 
                      alt={`${brand.name} logo`} 
                      className="h-6 md:h-7 w-auto object-contain mx-auto filter invert opacity-60 group-hover/slide:opacity-100 transition-all duration-300"
                    />
                </div>
              </Link>
              {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="brands-swiper-button-prev absolute top-1/2 left-0 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 p-2">
            <FaChevronLeft size={24} />
        </button>
        <button className="brands-swiper-button-next absolute top-1/2 right-0 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 p-2">
            <FaChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default BrandsCarousel;