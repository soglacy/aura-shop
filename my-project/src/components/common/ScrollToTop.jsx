// src/components/common/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Получаем не только pathname, а весь объект location
  const location = useLocation(); 

  useEffect(() => {
    // Проверяем, есть ли в state наш флаг keepScrollPosition
    // Если флага нет (или он false), то прокручиваем страницу вверх, как и раньше.
    if (!location.state?.keepScrollPosition) {
      window.scrollTo(0, 0);
    }
    // Если флаг есть, мы просто ничего не делаем, и страница остается на месте.

  }, [location.pathname]); // Зависимость от pathname остается прежней

  return null;
};

export default ScrollToTop;