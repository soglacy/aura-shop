// src/components/common/PageHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom'; 

const PageHeader = ({ title, breadcrumbs, subText, className = '' }) => {
  return (
    <div 
      className={`py-8 md:py-12 bg-gradient-to-r from-brand-bg-dark via-brand-bg-black to-brand-bg-dark ${className}`}
    >
      <div className="container mx-auto px-4">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb" className="text-xs sm:text-sm text-brand-gray-light mb-2 md:mb-3">
            <ol className="list-none p-0 inline-flex">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="inline-flex items-center">
                  {crumb.path ? (
                    <Link to={crumb.path} className="hover:text-brand-blue transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <svg className="fill-current w-3 h-3 mx-1.5 text-brand-gray-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-wide relative inline-block pb-1">
          {title}
          {/* Декоративная линия под заголовком - видимая всегда */}
          <span 
            className="absolute -bottom-0.5 left-0 w-3/4 h-[3px] rounded-full 
                       bg-gradient-to-r from-brand-blue via-blue-500 to-brand-blue/60" 
            // w-3/4 - линия занимает 3/4 ширины текста заголовка
            // h-[3px] - толщина линии
          ></span>
        </h1>
        {subText && (
          <p className="mt-3 md:mt-4 text-sm md:text-base text-brand-gray-light max-w-2xl">
            {subText}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;