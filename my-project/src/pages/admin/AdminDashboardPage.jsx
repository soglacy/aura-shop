// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { FaSpinner, FaPlus, FaSave, FaUpload, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import ProductSelectionModal from './ProductSelectionModal';

// --- Вспомогательный компонент для карточки товара в дашборде ---
const DashboardProductCard = ({ product, onClick, onRemove }) => {
    const { name = [], ram, storage, color } = product;
    const displayName = [name[0], ram && storage ? `(${ram}/${storage}ГБ)` : '', color].filter(Boolean).join(' ').trim();

    return (
        <div className="bg-gray-800/50 rounded-lg p-3 text-center group relative h-full flex flex-col justify-between">
            <div className="cursor-pointer" onClick={onClick}>
                <img src={product.imageUrl || '/images/placeholder.png'} alt={displayName} className="w-24 h-24 mx-auto object-contain mb-2"/>
                <p className="text-xs text-white h-8 flex items-center justify-center">{displayName}</p>
                <p className="text-xs text-gray-400 mt-1">{product.price}</p>
            </div>
            <button onClick={onRemove} title="Убрать" className="absolute top-1 right-1 text-gray-500 hover:text-red-500 transition-colors p-1">
                <FaTrash size={12}/>
            </button>
        </div>
    );
};

// --- Вспомогательный компонент для плейсхолдера ---
const DashboardItemPlaceholder = ({ onClick, text = "Выбрать товар" }) => (
    <div onClick={onClick} className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-center text-center cursor-pointer hover:ring-2 hover:ring-brand-blue transition-all aspect-square border-2 border-dashed border-gray-600">
        <div className="text-gray-500">
            <FaPlus className="mx-auto mb-2 text-2xl"/>
            <p className="text-xs">{text}</p>
        </div>
    </div>
);

// --- Вспомогательный компонент для карточки блога в дашборде ---
const DashboardBlogCard = ({ post, onEdit, onImageUpload, onRemove }) => (
    <div className="bg-gray-800/50 rounded-lg p-4 text-center relative group flex flex-col gap-2">
        <div className="relative">
             <label htmlFor={`upload-${post._id}`} className="cursor-pointer">
                <img src={post.imageUrl || '/images/placeholder.png'} alt={post.title} className="w-full h-24 mx-auto object-cover mb-2 rounded-sm group-hover:opacity-70 transition-opacity"/>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <FaUpload className="text-white text-2xl"/>
                </div>
            </label>
        </div>
        <input type="file" id={`upload-${post._id}`} className="hidden" onChange={(e) => onImageUpload(e)} />
        <input type="text" placeholder="Заголовок" value={post.title} onChange={(e) => onEdit('title', e.target.value)}
               className="text-sm font-semibold text-white bg-transparent w-full text-center outline-none focus:ring-1 focus:ring-brand-blue rounded-sm p-1"/>
        <input type="text" value={post.slug} readOnly className="hidden"/>
        <textarea placeholder="Краткое описание" value={post.excerpt} onChange={(e) => onEdit('excerpt', e.target.value)}
               className="text-xs text-gray-400 bg-transparent w-full text-center outline-none focus:ring-1 focus:ring-brand-blue rounded-sm resize-none h-12"/>
        <textarea placeholder="Полный текст статьи..." value={post.fullText} onChange={(e) => onEdit('fullText', e.target.value)}
               className="text-xs text-gray-400 bg-transparent w-full text-center outline-none focus:ring-1 focus:ring-brand-blue rounded-sm flex-grow resize-none h-24"/>
        <button onClick={onRemove} title="Удалить пост" className="absolute top-1 right-1 text-gray-500 hover:text-red-500 transition-colors p-1">
            <FaTrash size={12}/>
        </button>
    </div>
);

// --- Вспомогательный компонент для карточки слайдера в дашборде ---
const DashboardSliderCard = ({ slide, onEdit, onImageUpload, onRemove }) => (
    <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col gap-3 group relative">
        <div className="relative">
             <label htmlFor={`upload-slider-${slide._id}`} className="cursor-pointer">
                <img src={slide.imageUrl || '/images/placeholder.png'} alt={slide.titleLine1} className="w-full h-24 object-cover rounded-md group-hover:opacity-70 transition-opacity"/>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <FaUpload className="text-white text-2xl"/>
                </div>
            </label>
        </div>
        <input type="file" id={`upload-slider-${slide._id}`} className="hidden" onChange={(e) => onImageUpload(e)} />
        <input type="text" placeholder="Подзаголовок" value={slide.subTitle} onChange={(e) => onEdit('subTitle', e.target.value)}
               className="text-xs text-brand-blue bg-transparent w-full outline-none focus:ring-1 focus:ring-brand-blue rounded-sm p-1"/>
        <input type="text" placeholder="Заголовок (строка 1)" value={slide.titleLine1} onChange={(e) => onEdit('titleLine1', e.target.value)}
               className="text-sm font-semibold text-white bg-transparent w-full outline-none focus:ring-1 focus:ring-brand-blue rounded-sm p-1"/>
        <input type="text" placeholder="Заголовок (строка 2)" value={slide.titleLine2} onChange={(e) => onEdit('titleLine2', e.target.value)}
               className="text-sm font-semibold text-white bg-transparent w-full outline-none focus:ring-1 focus:ring-brand-blue rounded-sm p-1"/>
        <input type="text" placeholder="Текст кнопки" value={slide.buttonText} onChange={(e) => onEdit('buttonText', e.target.value)}
               className="text-xs bg-transparent w-full outline-none focus:ring-1 focus:ring-brand-blue rounded-sm p-1"/>
        <input type="text" placeholder="Ссылка для кнопки" value={slide.buttonLink} onChange={(e) => onEdit('buttonLink', e.target.value)}
               className="text-xs bg-transparent w-full outline-none focus:ring-1 focus:ring-brand-blue rounded-sm p-1"/>
        <button onClick={onRemove} title="Удалить слайд" className="absolute top-1 right-1 text-gray-500 hover:text-red-500 transition-colors p-1">
            <FaTrash size={12}/>
        </button>
    </div>
);

// --- Основной компонент ---
const AdminDashboardPage = () => {
    const { userInfo } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [homepageContent, setHomepageContent] = useState({
        sliderBanners: [],
        featuredProducts: Array(4).fill(null),
        trendingProducts: Array(4).fill(null),
        blogPosts: [],
    });
    const [allProducts, setAllProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConfig, setEditingConfig] = useState({ section: null, index: -1 });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const [contentRes, productsRes] = await Promise.all([
                    axios.get('/api/content/homepage'),
                    axios.get('/api/products?from=admin')
                ]);
                
                const normalizeProductSection = (products = [], count = 4) => {
                    const normalized = Array(count).fill(null);
                    if (Array.isArray(products)) {
                        products.slice(0, count).forEach((p, i) => {
                            if (p) normalized[i] = p;
                        });
                    }
                    return normalized;
                };

                const contentData = contentRes.data || {};
                
                setHomepageContent({ 
                    ...contentData, 
                    featuredProducts: normalizeProductSection(contentData.featuredProducts),
                    trendingProducts: normalizeProductSection(contentData.trendingProducts),
                    blogPosts: (contentData.blogPosts || []).map(post => ({ ...post, _id: post.slug || post.title })),
                    sliderBanners: (contentData.sliderBanners || []).map((slide, i) => ({ ...slide, _id: slide.buttonLink || i.toString() })),
                });
                setAllProducts(productsRes.data);
            } catch (err) {
                setError('Ошибка загрузки данных. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        if (userInfo?.isAdmin) fetchData();
    }, [userInfo]);

    const handleOpenModal = (section, index) => {
        setEditingConfig({ section, index });
        setIsModalOpen(true);
    };

    const handleProductSelect = (selectedProduct) => {
        const { section, index } = editingConfig;
        setHomepageContent(prev => {
            const newSectionData = [...prev[section]];
            newSectionData[index] = selectedProduct;
            return { ...prev, [section]: newSectionData };
        });
        setIsModalOpen(false);
    };

    const handleRemoveItem = (section, index) => {
        if (section === 'featuredProducts' || section === 'trendingProducts') {
            setHomepageContent(prev => {
                const newSectionData = [...prev[section]];
                newSectionData[index] = null;
                return { ...prev, [section]: newSectionData };
            });
        } else {
            setHomepageContent(prev => ({
                ...prev,
                [section]: prev[section].filter((_, i) => i !== index),
            }));
        }
    };
    
    const slugify = (text = '') => {
        const a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"","б":"b","ю":"yu"};
        return text.split('').map((char) => a[char] || char).join('').toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    const handleBlogEdit = (postId, field, value) => {
        setHomepageContent(prev => ({
            ...prev,
            blogPosts: prev.blogPosts.map(p => {
                if (p._id === postId) {
                    const updatedPost = { ...p, [field]: value };
                    if (field === 'title' && value) {
                        updatedPost.slug = slugify(value);
                    }
                    return updatedPost;
                }
                return p;
            })
        }));
    };

    const handleImageUpload = async (e, id, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('/api/upload', formData, config);
            
            if (type === 'blog') {
                handleBlogEdit(id, 'imageUrl', data.image);
            } else if (type === 'slider') {
                handleSliderEdit(id, 'imageUrl', data.image);
            }
        } catch (err) {
            alert('Ошибка загрузки: ' + (err.response?.data?.message || err.message));
        }
    };

    const addBlogPost = () => {
        const timestamp = new Date().getTime();
        const newPost = {
            _id: timestamp.toString(),
            title: "Новый пост",
            slug: `noviy-post-${timestamp}`,
            excerpt: "Краткое описание...",
            fullText: "Начните писать полный текст статьи здесь...",
            imageUrl: "/images/placeholder.png",
            date: new Date().toLocaleDateString('ru-RU'),
            category: "Новости",
        };
        setHomepageContent(prev => ({
            ...prev,
            blogPosts: [...(prev.blogPosts || []), newPost]
        }));
    };
    
    const handleSliderEdit = (slideId, field, value) => {
        setHomepageContent(prev => ({
            ...prev,
            sliderBanners: prev.sliderBanners.map(s => s._id === slideId ? { ...s, [field]: value } : s)
        }));
    };

    const addSlider = () => {
        const newSlide = {
            _id: new Date().getTime().toString(),
            imageUrl: '/images/placeholder.png',
            subTitle: 'Новый слайд',
            titleLine1: 'Заголовок',
            titleLine2: '',
            buttonText: 'Кнопка',
            buttonLink: '/'
        };
        setHomepageContent(prev => ({
            ...prev,
            sliderBanners: [...(prev.sliderBanners || []), newSlide]
        }));
    };

    const handleRemoveSlider = (slideId) => {
        if (window.confirm('Удалить этот слайд?')) {
            setHomepageContent(prev => ({
                ...prev,
                sliderBanners: prev.sliderBanners.filter(s => s._id !== slideId)
            }));
        }
    };
    
    const handleSaveChanges = async () => {
        setSaving(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const blogPosts = homepageContent.blogPosts || [];
            const slugs = blogPosts.map(p => p.slug);
            if (slugs.some(slug => !slug || slug.trim() === '')) {
                throw new Error("У одного из постов пустой URL-слаг. Пожалуйста, заполните его.");
            }
            if (slugs.some((slug, index) => slugs.indexOf(slug) !== index)) {
                throw new Error("Найдены одинаковые URL-слаги. Каждый слаг должен быть уникальным.");
            }
            const payload = {
                sliderBanners: homepageContent.sliderBanners.map(({_id, ...slide}) => slide),
                featuredProducts: homepageContent.featuredProducts.filter(p => p).map(p => p._id),
                trendingProducts: homepageContent.trendingProducts.filter(p => p).map(p => p._id),
                blogPosts: homepageContent.blogPosts.map(({_id, ...post}) => post),
            };
            await axios.put('/api/content/homepage', payload, config);
            alert('Изменения сохранены!');
        } catch (err) {
            setError('Ошибка сохранения: ' + (err.message || 'Проверьте консоль для деталей'));
        } finally {
            setSaving(false);
        }
    };
    
    if (loading) return <div className="p-8 text-center"><FaSpinner className="animate-spin text-4xl text-brand-blue" /></div>;

    const renderSection = (title, sectionKey, count) => {
        const items = homepageContent[sectionKey] || Array(count).fill(null);
        return (
            <div className="bg-brand-bg-black p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((product, index) => {
                        if (index >= count) return null;
                        if (product) {
                            return <DashboardProductCard key={product._id || index} product={product} onClick={() => handleOpenModal(sectionKey, index)} onRemove={() => handleRemoveItem(sectionKey, index)} />;
                        } else {
                            return <DashboardItemPlaceholder key={`ph-${sectionKey}-${index}`} onClick={() => handleOpenModal(sectionKey, index)} />;
                        }
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            <ProductSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} allProducts={allProducts} onSelect={handleProductSelect}/>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-white">Управление главной страницей</h1>
                    <div className="flex items-center gap-4">
                        <Link to="/" target="_blank" rel="noopener noreferrer" className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md flex items-center transition-colors">
                            <FaExternalLinkAlt className="mr-2" size={12}/> На сайт
                        </Link>
                        <button onClick={handleSaveChanges} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-md flex items-center transition-colors shadow-md disabled:opacity-50">
                            {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                            Сохранить все
                        </button>
                    </div>
                </div>
                {error && <div className="p-4 bg-red-900/50 rounded-lg text-red-300 text-sm">{error}</div>}
                <div className="bg-brand-bg-black p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Управление слайдером</h2>
                        <button onClick={addSlider} className="text-sm bg-brand-blue/80 hover:bg-brand-blue text-white font-semibold py-1 px-3 rounded-md flex items-center transition-colors">
                            <FaPlus className="mr-2" size={12}/>Добавить слайд
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(homepageContent.sliderBanners || []).map((slide, index) => (
                            <DashboardSliderCard 
                                key={slide._id || index} 
                                slide={slide} 
                                onEdit={(field, value) => handleSliderEdit(slide._id, field, value)} 
                                onImageUpload={(e) => handleImageUpload(e, slide._id, 'slider')} 
                                onRemove={() => handleRemoveSlider(slide._id)}
                            />
                        ))}
                    </div>
                </div>
                {renderSection('Aura Рекомендует', 'featuredProducts', 4)}
                {renderSection('Тренды этой недели', 'trendingProducts', 4)}
                <div className="bg-brand-bg-black p-6 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Наш Блог</h2>
                        <button onClick={addBlogPost} className="text-sm bg-brand-blue/80 hover:bg-brand-blue text-white font-semibold py-1 px-3 rounded-md flex items-center transition-colors">
                            <FaPlus className="mr-2" size={12}/>Добавить пост
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(homepageContent.blogPosts || []).map((post, index) => (
                            <DashboardBlogCard 
                                key={post._id || index} 
                                post={post} 
                                onEdit={(field, value) => handleBlogEdit(post._id, field, value)} 
                                onImageUpload={(e) => handleImageUpload(e, post._id, 'blog')} 
                                onRemove={() => handleRemoveItem('blogPosts', index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboardPage;