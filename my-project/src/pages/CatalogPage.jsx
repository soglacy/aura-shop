// src/pages/CatalogPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CatalogProductRowCard from '../components/products/CatalogProductRowCard';
import ProductFilters from '../components/products/ProductFilters';
import PageHeader from '../components/common/PageHeader';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa'; // Добавил FaSpinner

// Скелетон можно не менять, он хороший
const ProductSkeleton = () => (
    <div className="flex flex-col md:flex-row bg-brand-bg-black rounded-xl shadow-lg overflow-hidden mb-6 animate-pulse">
        <div className="md:w-1/3 lg:w-1/5 bg-gray-700 aspect-square md:aspect-auto"></div>
        <div className="p-4 md:p-5 flex-grow flex flex-col justify-between">
            <div>
                <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-2 hidden sm:block">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                </div>
            </div>
            <div className="flex justify-between items-end mt-4">
                <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                <div className="h-10 bg-gray-700 rounded w-1/2"></div>
            </div>
        </div>
    </div>
);


const CatalogPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);   
    const [priceBounds, setPriceBounds] = useState({ min: 0, max: 200000 });
    const [filters, setFilters] = useState(null); // Инициализируем как null, чтобы показать загрузку
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);
    
    // --- ИЗМЕНЕНИЕ 1: Разделяем логику на два useEffect ---

    // useEffect для ПЕРВОНАЧАЛЬНОЙ загрузки данных и установки фильтров из URL
    useEffect(() => {
    const fetchAndSetInitialState = async () => {
        setLoading(true);
        try {
            // === ИЗМЕНИТЬ ЗДЕСЬ ===
            // Мы должны запрашивать /api/products, который теперь будет 
            // отдавать плоский список всех вариантов из базы данных.
            const { data } = await axios.get('/api/products'); 
            
            setAllProducts(data);
                
                const maxPriceFromServer = Math.max(...data.map(p => p.priceValue), 0);
                const calculatedMax = Math.ceil(maxPriceFromServer / 10000) * 10000 || 200000;
                const calculatedBounds = { min: 0, max: calculatedMax };
                setPriceBounds(calculatedBounds);

                // Устанавливаем фильтры из URL при первой загрузке
                const params = new URLSearchParams(location.search);
                setFilters({
                    keyword: params.get('keyword') || '',
                    manufacturers: params.get('manufacturers')?.split(',').filter(Boolean) || [],
                    ram: params.get('ram')?.split(',').filter(Boolean).map(Number) || [],
                    storage: params.get('storage')?.split(',').filter(Boolean).map(Number) || [],
                    rating: Number(params.get('rating')) || 0,
                    priceRange: {
                        min: Number(params.get('minPrice')) || calculatedBounds.min,
                        max: Number(params.get('maxPrice')) || calculatedBounds.max,
                    }
                });

            } catch (e) {
                setError(e.message || "Не удалось загрузить товары.");
            } finally {
                setLoading(false);
            }
        };
        fetchAndSetInitialState();
    }, []); // <-- Пустой массив зависимостей. Запускается ОДИН раз.

    // useEffect для СИНХРОНИЗАЦИИ состояния фильтров в URL
    useEffect(() => {
        // Не обновляем URL, пока фильтры не инициализированы
        if (!filters) {
            return;
        }

        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && value.length !== 0) {
                if (key === 'priceRange') {
                    if (value.min > priceBounds.min) params.set('minPrice', value.min);
                    if (value.max < priceBounds.max) params.set('maxPrice', value.max);
                } else if (Array.isArray(value) && value.length > 0) {
                    params.set(key, value.join(','));
                } else if (!Array.isArray(value) && value) {
                    params.set(key, value);
                }
            }
        });
        // Используем replace, чтобы не засорять историю браузера
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });

    }, [filters, navigate, location.pathname, priceBounds, location.search]); // <-- Зависит только от `filters`

    // --- ИЗМЕНЕНИЕ 2: Упрощаем обработчик ---
    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };
    
    const resetAllFilters = () => {
        setFilters({
            keyword: '', manufacturers: [], ram: [], storage: [], rating: 0,
            priceRange: { min: priceBounds.min, max: priceBounds.max }
        });
    };

    const filteredProducts = useMemo(() => {
        if (loading || !filters) return [];
        return allProducts.filter(p => {
            const { keyword, manufacturers, ram, storage, rating, priceRange } = filters;
            
            if (keyword && !p.name.join(' ').toLowerCase().includes(keyword.toLowerCase())) return false;
            if (manufacturers?.length > 0 && !manufacturers.includes(p.manufacturer)) return false;
            if (ram?.length > 0 && !ram.includes(p.ram)) return false;
            if (storage?.length > 0 && !storage.includes(p.storage)) return false;
            if (rating > 0 && p.rating < rating) return false;
            if (priceRange && (p.priceValue < priceRange.min || p.priceValue > priceRange.max)) return false;
            
            return true;
        });
    }, [allProducts, filters, loading]);
    
    // --- ИЗМЕНЕНИЕ 3: Более надежная проверка на загрузку ---
    const showLoadingState = loading || !filters;

    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader title="Каталог Товаров" breadcrumbs={[{ label: 'Главная', path: '/' }, { label: 'Каталог' }]} />
            
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* --- ИЗМЕНЕНИЕ 4: Добавляем 'sticky' для фильтров --- */}
                    <aside className="lg:col-span-1 lg:sticky lg:top-24 self-start">
                        {/* Мобильная версия фильтров (сайдбар) */}
                        <div className={`fixed top-0 left-0 z-50 h-full w-full max-w-xs bg-brand-bg-black p-6 overflow-y-auto transform transition-transform lg:hidden ${showFiltersMobile ? 'translate-x-0' : '-translate-x-full'}`}>
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Фильтры</h2>
                                <button onClick={() => setShowFiltersMobile(false)}><FaTimes size={24} /></button>
                            </div>
                            {!showLoadingState && (
                                <ProductFilters 
                                    products={allProducts} 
                                    onFilterChange={handleFilterChange} 
                                    currentFilters={filters}
                                    priceBounds={priceBounds}
                                    onReset={resetAllFilters}
                                />
                            )}
                        </div>

                        {/* Десктопная версия фильтров (встраиваемая) */}
                        <div className="hidden lg:block">
                             {!showLoadingState ? (
                                <ProductFilters 
                                    products={allProducts} 
                                    onFilterChange={handleFilterChange} 
                                    currentFilters={filters}
                                    priceBounds={priceBounds}
                                    onReset={resetAllFilters}
                                />
                            ) : (
                                <div className="bg-brand-bg-black p-5 rounded-xl shadow-lg animate-pulse">
                                    <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
                                    <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                                    <div className="h-10 bg-gray-700 rounded mb-6"></div>
                                    <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
                                    <div className="h-16 bg-gray-700 rounded mb-6"></div>
                                </div>
                            )}
                        </div>
                    </aside>
                    
                    <main className="w-full lg:col-span-3">
                        <div className="bg-brand-bg-black rounded-lg shadow p-4 mb-6 md:flex md:justify-between md:items-center">
                             <div className="relative flex-grow md:max-w-xs mb-4 md:mb-0">
                                <input type="text" placeholder="Поиск по названию..."
                                       value={filters?.keyword || ''}
                                       onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                       className="w-full bg-brand-item-bg border border-brand-border-gray rounded-md py-2 pl-10 pr-4 text-white text-sm" />
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-brand-gray-light">
                                    {showLoadingState ? 'Загрузка...' : `Найдено: ${filteredProducts.length}`}
                                </p>
                                <button onClick={() => setShowFiltersMobile(true)} className="lg:hidden text-white bg-brand-blue hover:bg-blue-700 px-3 py-2 rounded-md text-sm flex items-center">
                                    <FaFilter className="mr-2"/> Фильтры
                                </button>
                            </div>
                        </div>

                        {showLoadingState ? (
                            <div className="space-y-6">
                                {[...Array(3)].map((_, i) => <ProductSkeleton key={i} />)}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="space-y-6">
                                {filteredProducts.map(product => <CatalogProductRowCard key={product.customId} product={product} />)}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-brand-bg-black rounded-lg p-8">
                                <h3 className="text-2xl font-semibold">Товары не найдены</h3>
                                <p className="text-brand-gray-light my-4">Попробуйте изменить или сбросить фильтры.</p>
                                <button onClick={resetAllFilters} className="text-brand-blue hover:underline">Сбросить все фильтры</button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            {showFiltersMobile && <div className="fixed inset-0 z-40 bg-black/75 lg:hidden" onClick={() => setShowFiltersMobile(false)}></div>}
        </div>
    );
};

export default CatalogPage;