// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import { FaShoppingCart, FaTrashAlt, FaSpinner, FaChevronDown } from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import ProductReviews from '../components/products/ProductReviews';
import ProductImageGallery from '../components/products/ProductImageGallery';

// --- Компоненты кнопок опций ---
// ИСПРАВЛЕНИЕ 2: Убираем `cursor-not-allowed`
const OptionButton = ({ label, isActive, isSelectable, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border-2 transition-all ${
            isActive ? 'bg-brand-blue border-brand-blue text-white shadow-md' : 'bg-brand-item-bg border-brand-border-gray text-brand-gray-light'
        } ${
            isSelectable ? 'hover:border-brand-blue cursor-pointer' : 'opacity-40' // Убрали cursor-not-allowed
        }`}
    >
        {label}
    </button>
);

const ColorButton = ({ color, colorHex, isActive, isSelectable, onClick }) => (
    <button
        onClick={onClick}
        title={color}
        className={`w-8 h-8 rounded-full border-2 transition-all flex-shrink-0 ${
            isActive ? 'ring-2 ring-offset-2 ring-brand-blue ring-offset-brand-bg-dark border-transparent' : 'border-gray-600'
        } ${
            isSelectable ? 'hover:border-brand-blue cursor-pointer' : 'opacity-40' // Убрали cursor-not-allowed
        }`}
        style={{ backgroundColor: colorHex || 'transparent' }}
    ></button>
);


// --- Основной компонент страницы ---
const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart, removeFromCart, cartItems } = useCart();
    
    const [product, setProduct] = useState(null);
    const [allVariants, setAllVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
    
    const [currentOptions, setCurrentOptions] = useState({ ram: null, storage: null, color: null });

    const fetchProductData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`/api/products/${productId}`);
            setProduct(data.product);
            setAllVariants(data.allVariants);
            setCurrentOptions({
                ram: data.product.ram,
                storage: data.product.storage,
                color: data.product.color,
            });
        } catch (e) {
            setError(e.response?.data?.message || "Не удалось загрузить товар.");
            setProduct(null);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    const handleSmartOptionSelect = (optionType, value) => {
        if (currentOptions[optionType] === value) return;

        let targetVariant = allVariants.find(v => {
            const tempOptions = { ...currentOptions, [optionType]: value };
            return v.color === tempOptions.color && v.ram === tempOptions.ram && v.storage === tempOptions.storage;
        });

        if (!targetVariant) {
            targetVariant = allVariants.find(v => v[optionType] === value);
        }
        
        if (targetVariant) {
            // ИСПРАВЛЕНИЕ 1: Добавляем опцию `preventScrollReset`, чтобы страница не "прыгала"
            navigate(`/product/${targetVariant.customId}`, { 
                replace: true, 
                preventScrollReset: true,
                state: { keepScrollPosition: true }
            });
        } else {
            console.error("Не удалось найти вариант для выбранной опции:", optionType, value);
        }
    };

    const availableOptions = useMemo(() => {
        if (!allVariants.length) return { rams: [], storages: [], colors: [] };
        const uniqueRams = [...new Set(allVariants.map(p => p.ram).filter(Boolean))].sort((a, b) => a - b);
        const uniqueStorages = [...new Set(allVariants.map(p => p.storage).filter(Boolean))].sort((a, b) => a - b);
        const uniqueColors = [...new Map(allVariants.map(v => [v.color, v])).values()].sort((a,b) => (a.color || '').localeCompare(b.color || ''));
        return {
            rams: uniqueRams.map(ram => ({
                value: ram,
                isSelectable: allVariants.some(v => v.ram === ram && v.storage === currentOptions.storage && v.color === currentOptions.color)
            })),
            storages: uniqueStorages.map(storage => ({
                value: storage,
                isSelectable: allVariants.some(v => v.storage === storage && v.ram === currentOptions.ram && v.color === currentOptions.color)
            })),
            colors: uniqueColors.map(colorInfo => ({
                ...colorInfo,
                isSelectable: allVariants.some(v => v.color === colorInfo.color && v.ram === currentOptions.ram && v.storage === currentOptions.storage)
            })),
        };
    }, [allVariants, currentOptions]);
    
    if (loading) {
      return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin text-brand-blue text-4xl" /></div>;
    }
    if (error || !product) {
      return <div className="min-h-screen flex justify-center items-center text-center"><p className="text-red-400">{error || 'Товар не найден.'}</p></div>;
    }

    const isInCart = cartItems.find(item => item.customId === product.customId);
    const handleCartAction = () => {
    if (isInCart) {
      removeFromCart(product.customId);
    } else {
      // Собираем полный объект данных для корзины
      const productDataForCart = {
        _id: product._id,
        customId: product.customId,
        // Передаем полное, уже сформированное название
        name: fullProductName, 
        imageUrl: product.imageUrl,
        // Цена, которую платит пользователь (со скидкой, если есть)
        priceValue: (product.onSale && product.salePriceValue > 0) ? product.salePriceValue : product.priceValue,
        // Оригинальная цена без скидки для расчета выгоды
        originalPriceValue: product.priceValue, 
        productLink: product.productLink,
        quantity: 1,
        // Уникальный ID для этого конкретного товара в корзине
        cartItemId: product.customId, 
      };
      addToCart(productDataForCart);
    }
  };
  
  const nameParts = product.name || [];
  // `fullProductName` теперь используется и для `h1`, и для корзины
  const fullProductName = `${nameParts[0]} ${product.ram ? `(${product.ram}/${product.storage}ГБ)` : ''} ${product.color || ''}`.trim();
  const specEntries = Object.entries(product.specifications || {});

    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader title={nameParts[0] || 'Товар'} breadcrumbs={[{ label: 'Главная', path: '/' }, { label: 'Каталог', path: '/catalog' }, { label: product.name[0] || '...' }]} />
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
                    {/* ИСПРАВЛЕНИЕ 3: Делаем sticky только на больших экранах (lg) */}
                    <div className="lg:max-w-md mx-auto w-full lg:sticky top-24 self-start">
                        <ProductImageGallery images={product.images && product.images.length > 0 ? product.images : [product.imageUrl]} productName={nameParts.join(' ')} />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{fullProductName}</h1>
                        <div className="flex items-baseline gap-3 mb-6">
                            <p className={`text-xl lg:text-2xl font-bold ${product.onSale && product.salePriceValue > 0 ? 'text-red-500' : 'text-brand-blue'}`}>{(product.onSale && product.salePriceValue > 0 ? product.salePriceValue : product.priceValue).toLocaleString('ru-RU')} ₽</p>
                            {product.onSale && product.priceValue > (product.salePriceValue || 0) && (<p className="text-lg text-gray-500 line-through">{product.priceValue.toLocaleString('ru-RU')} ₽</p>)}
                        </div>
                        
                        <div className="space-y-6">
                            {availableOptions.colors.length > 0 && (
                                <div><label className="block text-sm font-medium text-brand-gray-light mb-2">Цвет:</label><div className="flex flex-wrap gap-3 items-center">
                                    {availableOptions.colors.map(c => <ColorButton key={c.customId} color={c.color} colorHex={c.colorHex} isActive={c.color === currentOptions.color} isSelectable={c.isSelectable} onClick={() => handleSmartOptionSelect('color', c.color)} />)}
                                </div></div>
                            )}
                            {availableOptions.rams.length > 0 && (
                                <div><label className="block text-sm font-medium text-brand-gray-light mb-2">Оперативная память (ГБ):</label><div className="flex flex-wrap gap-2">
                                    {availableOptions.rams.map(r => <OptionButton key={r.value} label={r.value} isActive={r.value === currentOptions.ram} isSelectable={r.isSelectable} onClick={() => handleSmartOptionSelect('ram', r.value)} />)}
                                </div></div>
                            )}
                            {availableOptions.storages.length > 0 && (
                                <div><label className="block text-sm font-medium text-brand-gray-light mb-2">Память (ГБ):</label><div className="flex flex-wrap gap-2">
                                    {availableOptions.storages.map(s => <OptionButton key={s.value} label={s.value} isActive={s.value === currentOptions.storage} isSelectable={s.isSelectable} onClick={() => handleSmartOptionSelect('storage', s.value)} />)}
                                </div></div>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-4 my-8 py-6 border-y border-brand-border-gray/30">
                            {product.countInStock > 0 ? (<button onClick={handleCartAction} className={`flex-grow text-white font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center ${isInCart ? 'bg-red-600 hover:bg-red-500' : 'bg-brand-blue hover:bg-blue-700'}`}>{isInCart ? <FaTrashAlt className="mr-2" /> : <FaShoppingCart className="mr-2" />} {isInCart ? 'Убрать из корзины' : 'Добавить в корзину'}</button>) : (<button disabled className="flex-grow text-gray-400 bg-gray-800 font-semibold py-3 px-6 rounded-md flex items-center justify-center cursor-not-allowed">Нет в наличии</button>)}
                        </div>

                        {product.fullDescription && <div className="prose prose-invert max-w-none text-brand-gray-light leading-relaxed mb-8"><p>{product.fullDescription.replace(/\\n/g, '\n')}</p></div>}
                        
                        {product.keySpecs && product.keySpecs.length > 0 && (
                            <div className="mb-8 pt-8 border-t border-brand-border-gray/30">
                                <h3 className="text-xl font-semibold text-white mb-4">Ключевые характеристики</h3>
                                <ul className="space-y-3 text-sm">
                                    {product.keySpecs.slice(0, isSpecsExpanded ? undefined : 5).map((spec, index) => (
                                        (spec && spec.label && spec.value) && (
                                            <li key={index} className="flex justify-between border-b border-brand-border-gray/20 pb-2 text-gray-300"><span className="pr-2">{spec.label}:</span><span className="text-white text-right font-medium">{spec.value}</span></li>
                                        )
                                    ))}
                                </ul>
                                {product.keySpecs.length > 5 && (<button onClick={() => setIsSpecsExpanded(!isSpecsExpanded)} className="text-brand-blue text-sm mt-4 hover:underline flex items-center">{isSpecsExpanded ? 'Скрыть' : 'Показать все'}<FaChevronDown className={`ml-2 transform transition-transform duration-300 ${isSpecsExpanded ? 'rotate-180' : ''}`} /></button>)}
                            </div>
                        )}
                        
                        {specEntries.length > 0 && ( <div className="mb-8 pt-8 border-t border-brand-border-gray/30"><h3 className="text-xl font-semibold text-white mb-4">Все характеристики</h3><ul className="space-y-3 text-sm">{specEntries.map(([key, value]) => (<li key={key} className="flex justify-between border-b border-brand-border-gray/20 pb-2 text-gray-300"><span className="pr-2">{key}:</span><span className="text-white text-right font-medium">{String(value)}</span></li>))}</ul></div>)}
                        
                        <ProductReviews product={product} onReviewAdded={fetchProductData} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductDetailPage;