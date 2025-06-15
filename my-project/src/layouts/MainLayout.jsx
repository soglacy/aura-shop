// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ScrollToTopButton from '../components/common/ScrollToTopButton';

const MainLayout = () => {
  return (
    // ИЗМЕНЕНИЕ: Убираем класс .page-wrapper, который мешал sticky-позиционированию
    // Он не нужен, так как стили фона и т.д. заданы на body
    <>
      <Header />
      <main className="min-h-screen"> 
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default MainLayout;