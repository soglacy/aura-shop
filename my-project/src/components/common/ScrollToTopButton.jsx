// src/components/common/ScrollToTopButton.jsx
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Иконка стрелки вверх

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Показать кнопку, когда страница прокручена вниз на определенное расстояние
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) { // Порог в 300px, можно изменить
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Прокрутить страницу наверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Плавная прокрутка
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    // Очистка слушателя при размонтировании компонента
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
              <button
        onClick={scrollToTop}
        className="btn-up fixed bottom-5 right-5 
                  bg-brand-blue hover:bg-blue-400 text-white 
                  w-12 h-12 rounded-full shadow-lg 
                  flex items-center justify-center 
                  transition-opacity duration-300 z-[60]" // <--- Увеличиваем z-index, например до 60
        title="Наверх"
        aria-label="Наверх"
      >
        <FaArrowUp size={20} />
      </button>
      )}
    </>
  );
};

export default ScrollToTopButton;