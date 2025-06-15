// src/components/common/SectionTitle.jsx
import React from 'react';

const SectionTitle = ({ subTitle, mainTitle, centered = false, className = '', animate = true }) => {
  const alignmentClass = centered ? 'text-center items-center' : 'text-left items-start';
  
  // Убедимся, что классы анимации применяются правильно
  // opacity-0 должен быть, чтобы анимация начиналась с невидимого состояния
  const baseAnimationClasses = animate ? 'opacity-0' : ''; // Применяем opacity-0 только если animate=true
  const subTitleAnim = animate ? `${baseAnimationClasses} animate-fade-in-up` : '';
  const mainTitleAnim = animate ? `${baseAnimationClasses} animate-fade-in-up animation-delay-200` : '';
  const decoratorAnim = animate ? `${baseAnimationClasses} animate-fade-in-up animation-delay-400` : '';

  return (
    <div 
      className={`sec-title mb-10 md:mb-16 flex flex-col ${alignmentClass} ${className}`}
    >
      {subTitle && (
        <div 
          className={`text-brand-blue text-sm md:text-base font-semibold uppercase tracking-wider mb-2 md:mb-3 ${subTitleAnim}`}
        >
          {subTitle}
        </div>
      )}
      {mainTitle && (
        <h2 
          className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase leading-tight relative pb-2 ${mainTitleAnim}`}
        >
          {mainTitle}
          {!centered && (
            <span className={`absolute bottom-0 left-0 h-1 w-16 bg-brand-blue rounded-full ${decoratorAnim}`}></span>
          )}
        </h2>
      )}
      {centered && mainTitle && (
        <div className={`flex justify-center mt-3 ${decoratorAnim}`}>
            <span className="h-1 w-20 bg-brand-blue rounded-full"></span>
        </div>
      )}
    </div>
  );
};

export default SectionTitle;