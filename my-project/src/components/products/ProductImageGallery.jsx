// src/components/products/ProductImageGallery.jsx
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

// Иконки для навигации основного слайдера
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductImageGallery = ({ images = [], productName = "Изображение товара" }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Формируем слайды для лайтбокса
  const lightboxSlides = images.map(img => ({ src: img }));

  if (!images || images.length === 0) {
    return <img src="/images/placeholder.png" alt="Нет изображения" className="w-full rounded-lg shadow-lg object-cover aspect-square" />;
  }

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  
  return (
    <div className="w-full product-gallery">
      {/* Основной слайдер изображений */}
      <Swiper
        modules={[Navigation, Thumbs, FreeMode]}
        spaceBetween={10}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        loop={images.length > 1}
        grabCursor={true}
        className="main-image-swiper rounded-lg shadow-lg mb-4"
        onSlideChange={(swiper) => setLightboxIndex(swiper.realIndex)} // Синхронизируем индекс для лайтбокса
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} onClick={() => openLightbox(index)} className="cursor-zoom-in">
            <img src={img} alt={`${productName} - ${index + 1}`} className="w-full h-auto object-cover aspect-square" />
          </SwiperSlide>
        ))}
        {/* Кастомные кнопки навигации, если изображений больше одного */}
        {images.length > 1 && (
          <>
            <div className="swiper-button-prev-custom absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full cursor-pointer transition-colors">
              <FaChevronLeft size={20} />
            </div>
            <div className="swiper-button-next-custom absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/70 text-white rounded-full cursor-pointer transition-colors">
              <FaChevronRight size={20} />
            </div>
          </>
        )}
      </Swiper>

      {/* Слайдер миниатюр (если изображений больше 1) */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={false} // Для миниатюр loop обычно не нужен или настраивается сложнее
          spaceBetween={10}
          slidesPerView={4} // Показываем 4 миниатюры
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs-swiper"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index} className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity rounded-md overflow-hidden border-2 border-transparent data-[swiper-slide-thumb-active=true]:opacity-100 data-[swiper-slide-thumb-thumb-active=true]:border-brand-blue">
               {/* 
                Tailwind не поддерживает data-атрибуты для стилизации напрямую.
                Для data-[swiper-slide-thumb-active=true]:border-brand-blue можно использовать CSS или плагин Tailwind для data-атрибутов.
                Пока что активная миниатюра будет выделяться только через JS Swiper.
                Чтобы работало выделение активной миниатюры рамкой, добавим немного CSS.
              */}
              <img src={img} alt={`Миниатюра ${index + 1}`} className="w-full h-full object-cover aspect-square" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
        plugins={[Thumbnails, Zoom]}
        thumbnails={{ showToggle: true }}
        zoom={{
            maxZoomPixelRatio: 3,
            doubleTapDelay: 300,
            doubleClickDelay: 500,
            doubleClickMaxStops: 2,
            keyboardMoveDistance: 50,
            wheelZoomDistanceFactor: 100,
            pinchZoomDistanceFactor: 100,
            scrollToZoom: false,
        }}
      />
      <style jsx global>{`
        .product-gallery .thumbs-swiper .swiper-slide-thumb-active {
          border-color: ${'#3786ff'}; /* brand-blue */
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ProductImageGallery;