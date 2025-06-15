// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BannerSlider from '../components/home/BannerSlider';
import BrandsCarousel from '../components/home/BrandsCarousel';
import RecommendedProducts from '../components/home/RecommendedProducts';
import HotOffersRedesigned from '../components/home/HotOffersRedesigned';
import NewsBlogSection from '../components/home/NewsBlogSection';
import TrustBadgesRedesigned from '../components/home/TrustBadgesRedesigned';
import { FaSpinner } from 'react-icons/fa';

const HomePage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        const { data } = await axios.get('/api/content/homepage');
        setContent(data);
      } catch (error) {
        console.error("Ошибка загрузки контента главной страницы:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomePageContent();
  }, []);
  
  if (loading) {
      return (
          <div className="flex justify-center items-center min-h-screen bg-brand-bg-dark">
              <FaSpinner className="animate-spin text-brand-blue text-5xl"/>
          </div>
      );
  }

  return (
    <>
      <div className="h-[85vh] w-full max-h-[750px] min-h-[500px]">
        <BannerSlider banners={content?.sliderBanners} />
      </div>

      <BrandsCarousel />
      <RecommendedProducts products={content?.featuredProducts} />
      <HotOffersRedesigned products={content?.trendingProducts} />
      <NewsBlogSection posts={content?.blogPosts} />
      <TrustBadgesRedesigned />
    </>
  );
};

export default HomePage;