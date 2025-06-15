// src/components/home/BannerSlider.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Данные по умолчанию, если с сервера ничего не придет
const defaultSlidesData = [
  { _id: 'default-1', imageUrl: '/images/main-slider/1.png', subTitle: 'Добро пожаловать', titleLine1: 'Aura Shop', titleLine2: 'Ваш гид в мире технологий', description: 'Лучшие гаджеты и аксессуары в одном месте.', buttonText: 'В каталог', buttonLink: '/blog.html' },
];

const BannerSlider = ({ banners = [] }) => {
  const slidesToRender = banners.length > 0 ? banners : defaultSlidesData;

  return (
    <section className="banner-section relative w-full h-full">
        <Swiper
            modules={[Navigation, Autoplay, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            loop={slidesToRender.length > 1}
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            className="banner-carousel h-full w-full"
        >
            {slidesToRender.map((slide, index) => (
                <SwiperSlide key={slide._id || index} className="slide-item relative h-full">
                    {/* Этот div отвечает за эффект скругления снизу */}
                    <div className="absolute inset-0" >
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.imageUrl})` }} />
                        <div className="absolute inset-0 bg-black/50 z-[1]" />
                    </div>

                    <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center relative z-[5] pt-12 pb-20">
                        <div className="content-box max-w-lg lg:max-w-2xl">
                            {slide.subTitle && (
                                <p className="text-brand-blue font-semibold text-sm md:text-base uppercase tracking-wider mb-3 md:mb-4 opacity-0 animate-slide-in-bottom animation-delay-300">
                                    {slide.subTitle}
                                </p>
                            )}
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase leading-tight mb-4 md:mb-6 opacity-0 animate-slide-in-bottom animation-delay-500">
                                {slide.titleLine1} <br/> {slide.titleLine2}
                            </h2>
                            {slide.description && (
                                <p className="text-base text-gray-300 mb-6 md:mb-10 max-w-md mx-auto opacity-0 animate-slide-in-bottom animation-delay-700">
                                    {slide.description}
                                </p>
                            )}
                            {slide.buttonText && slide.buttonLink && (
                                <div className="btn-box opacity-0 animate-slide-in-bottom animation-delay-900">
                                    <Link to={slide.buttonLink}
                                       className="inline-flex items-center text-base font-semibold text-white uppercase tracking-wider py-3 px-8 bg-brand-blue transition-all duration-300 rounded-md hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 group">
                                        {slide.buttonText}
                                        <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        <style jsx global>{`
            .banner-section .swiper-button-next,
            .banner-section .swiper-button-prev {
                color: #fff;
                background-color: rgba(0, 0, 0, 0.3);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            .banner-section .swiper-button-next:hover,
            .banner-section .swiper-button-prev:hover {
                background-color: var(--color-brand-blue, #3786ff);
            }
            .banner-section .swiper-button-next::after,
            .banner-section .swiper-button-prev::after {
                font-size: 16px;
                font-weight: 800;
            }
            
            @keyframes slideInBottom {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-slide-in-bottom { animation: slideInBottom 0.7s ease-out forwards; }
            .animation-delay-300 { animation-delay: 0.3s; }
            .animation-delay-500 { animation-delay: 0.5s; }
            .animation-delay-700 { animation-delay: 0.7s; }
            .animation-delay-900 { animation-delay: 0.9s; }
        `}</style>
    </section>
  );
};

export default BannerSlider;