// src/components/home/QuickAccessSection.jsx
import React from 'react';
import { FaMobileAlt, FaLaptop, FaPercentage, FaGift } from 'react-icons/fa'; 

const accessItems = [
  { id: 1, icon: <FaMobileAlt />, label: 'Смартфоны', href: '/blog.html?category=smartphones' }, 
  { id: 2, icon: <FaLaptop />, label: 'Ноутбуки', href: '/blog.html?category=laptops' },
  { id: 3, icon: <FaPercentage />, label: 'Акции', href: '/stocks.html' },
  { id: 4, icon: <FaGift />, label: 'Новинки', href: '/blog.html?sort=newest' },
];

const QuickAccessSection = () => {
  return (
    // УМЕНЬШЕНЫ ВЕРТИКАЛЬНЫЕ ОТСТУПЫ СЕКЦИИ
    <section className="py-8 md:py-12"> 
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5"> {/* Уменьшены gap */}
          {accessItems.map(item => (
            <a 
              key={item.id}
              href={item.href}
              className="group/access block p-4 md:p-5 bg-brand-bg-black/30 backdrop-blur-sm  
                         rounded-xl shadow-lg hover:shadow-xl {/* Уменьшено скругление до rounded-xl */}
                         transition-all duration-300 transform hover:-translate-y-1 
                         flex flex-col items-center justify-center text-center relative isolate"
                         // УМЕНЬШЕНЫ ПАДДИНГИ ВНУТРИ ПЛИТКИ (p-4 md:p-5)
            >
              {/* Градиент как у логотипов (из правого нижнего в левый верхний) */}
              <div 
                className="absolute inset-0 z-[-1] rounded-xl {/* Соответствует скруглению родителя */}
                           bg-gradient-to-tl from-brand-blue/20 via-brand-blue/5 to-transparent 
                           opacity-0 group-hover/access:opacity-100 transition-opacity duration-400 ease-in-out"
              ></div>
              
              {/* УМЕНЬШЕН РАЗМЕР ИКОНКИ И ОТСТУП */}
              <div className="text-brand-blue text-2xl sm:text-3xl md:text-4xl mb-2 transition-transform duration-300 group-hover/access:scale-110">
                {item.icon}
              </div>
              {/* УМЕНЬШЕН РАЗМЕР ТЕКСТА */}
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white transition-colors duration-300 group-hover/access:text-brand-blue">
                {item.label}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessSection;