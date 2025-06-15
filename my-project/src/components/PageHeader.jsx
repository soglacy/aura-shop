// src/components/common/PageHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, breadcrumbs, subText, className = '' }) => {
  
  // Если нет ни заголовка, ни "хлебных крошек", не рендерим вообще ничего.
  if (!title && (!breadcrumbs || breadcrumbs.length === 0)) {
    return null;
  }

  return (
    // --- ИЗМЕНЕНИЕ 1: Минимальные отступы и убран градиент ---
    // Убираем градиент и оставляем только цвет фона основной части страницы
    <div 
      className={`py-4 bg-brand-bg-dark ${className}`}
    >
      <div className="container mx-auto px-4">
        {/* --- ИЗМЕНЕНИЕ 2: Объединяем "хлебные крошки" и заголовок в одну строку --- */}
        <div className="flex items-baseline gap-x-4">
            {breadcrumbs && breadcrumbs.length > 0 && (
                // "Хлебные крошки" теперь не имеют нижнего отступа
                <nav aria-label="breadcrumb" className="text-xs text-brand-gray-light whitespace-nowrap">
                    <ol className="list-none p-0 inline-flex">
                    {breadcrumbs.map((crumb, index) => (
                        <li key={index} className="inline-flex items-center">
                        {crumb.path ? (
                            <Link to={crumb.path} className="hover:text-brand-blue transition-colors">
                            {crumb.label}
                            </Link>
                        ) : (
                            // Последний элемент "хлебных крошек" больше не нужен, т.к. есть заголовок
                            index < breadcrumbs.length - 1 && <span>{crumb.label}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <svg className="fill-current w-3 h-3 mx-1.5 text-brand-gray-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
                        )}
                        </li>
                    ))}
                    </ol>
                </nav>
            )}

            {/* --- ИЗМЕНЕНИЕ 3: Минималистичный заголовок без декора --- */}
            <h1 className="text-xl font-semibold text-white uppercase tracking-wide">
                {title}
            </h1>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;