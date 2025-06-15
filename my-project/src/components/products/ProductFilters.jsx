// src/components/products/ProductFilters.jsx
import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaStar, FaTimesCircle } from 'react-icons/fa';

// Вспомогательный компонент для секции фильтров
const FilterSection = ({ title, children }) => (
    <div className="mb-6 pb-6 border-b border-brand-border-gray/30 last:border-b-0 last:pb-0 last:mb-0">
      <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">{title}</h4>
      {children}
    </div>
);

// Вспомогательный компонент для кнопок-таблеток
const FilterPill = ({ text, isSelected, onClick }) => (
    <button onClick={onClick}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border
                        ${isSelected 
                            ? 'bg-brand-blue/20 border-brand-blue text-white' 
                            : 'bg-brand-item-bg border-brand-border-gray text-gray-300 hover:border-gray-500'
                        }`}>
        {text}
    </button>
);

const ProductFilters = ({ products, onFilterChange, currentFilters, priceBounds, onReset }) => {
    
    // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
    const manufacturersList = React.useMemo(() => 
        // 1. Создаем Set для уникальности
        // 2. Отфильтровываем пустые значения И значение "Не указан"
        // 3. Сортируем
        [...new Set(products.map(p => p.manufacturer))]
            .filter(m => m && m !== 'Не указан') 
            .sort()
    , [products]);
    // --- КОНЕЦ ИЗМЕНЕНИЯ ---

    const ramOptions = React.useMemo(() => [...new Set(products.map(p => p.ram).filter(Boolean))].sort((a,b) => a-b), [products]);
    const storageOptions = React.useMemo(() => [...new Set(products.map(p => p.storage).filter(Boolean))].sort((a,b) => a-b), [products]);

    const handleMultiSelectChange = (filterName, value) => {
        const currentValues = currentFilters[filterName] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        onFilterChange(filterName, newValues);
    };

    return (
        <aside className="bg-brand-bg-black p-5 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border-gray/30">
                <h3 className="text-lg font-bold text-white">Фильтры</h3>
                <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-brand-gray-light hover:text-red-400 transition-colors">
                    <FaTimesCircle />
                    <span>Сбросить</span>
                </button>
            </div>
            
            <FilterSection title="Цена, ₽">
                <div className="px-2">
                    <Slider
                        range min={priceBounds.min} max={priceBounds.max} step={1000}
                        value={[currentFilters.priceRange?.min ?? priceBounds.min, currentFilters.priceRange?.max ?? priceBounds.max]}
                        onChange={(value) => onFilterChange('priceRange', { min: value[0], max: value[1] })}
                        trackStyle={[{ backgroundColor: '#3b82f6' }]}
                        handleStyle={[{ backgroundColor: '#3b82f6', border: '2px solid white' }, { backgroundColor: '#3b82f6', border: '2px solid white' }]}
                        railStyle={{ backgroundColor: '#4b5563' }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                    <span>{(currentFilters.priceRange?.min ?? 0).toLocaleString()} ₽</span>
                    <span>{(currentFilters.priceRange?.max ?? 0).toLocaleString()} ₽</span>
                </div>
            </FilterSection>

            <FilterSection title="Рейтинг (не ниже)">
                <div className="flex flex-wrap gap-2">
                    {[5, 4, 3, 2].map(star => (
                        <FilterPill
                            key={star}
                            onClick={() => onFilterChange('rating', currentFilters.rating === star ? 0 : star)}
                            isSelected={currentFilters.rating === star}
                            text={
                                <span className="flex items-center gap-1">
                                    {star} <FaStar className="text-yellow-400" />
                                </span>
                            }
                        />
                    ))}
                </div>
            </FilterSection>

            {manufacturersList.length > 0 && (
                <FilterSection title="Производитель">
                    <div className="flex flex-wrap gap-2">
                        {manufacturersList.map(m => (
                            <FilterPill key={m} text={m} isSelected={currentFilters.manufacturers?.includes(m)}
                                        onClick={() => handleMultiSelectChange('manufacturers', m)} />
                        ))}
                    </div>
                </FilterSection>
            )}
            
            {storageOptions.length > 0 && (
                <FilterSection title="Встроенная память">
                    <div className="flex flex-wrap gap-2">
                        {storageOptions.map(storage => (
                            <FilterPill key={storage} text={`${storage} ГБ`} isSelected={currentFilters.storage?.includes(storage)}
                                        onClick={() => handleMultiSelectChange('storage', storage)} />
                        ))}
                    </div>
                </FilterSection>
            )}

            {ramOptions.length > 0 && (
                <FilterSection title="Оперативная память">
                     <div className="flex flex-wrap gap-2">
                        {ramOptions.map(ram => (
                            <FilterPill key={ram} text={`${ram} ГБ`} isSelected={currentFilters.ram?.includes(ram)}
                                        onClick={() => handleMultiSelectChange('ram', ram)} />
                        ))}
                    </div>
                </FilterSection>
            )}
        </aside>
    );
};

export default ProductFilters;