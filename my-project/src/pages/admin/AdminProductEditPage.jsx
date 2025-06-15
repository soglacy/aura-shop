// src/pages/admin/AdminProductEditPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaSave, FaSpinner, FaArrowLeft, FaTrash, FaPlus, FaUpload, FaEye, FaArrowDown } from 'react-icons/fa';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const FormField = ({ label, children, hint }) => (
    <div>
        <label className="block text-sm font-medium text-brand-gray-light">{label}</label>
        <div className="mt-1">{children}</div>
        {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
);

const AdminProductEditPage = () => {
    const { customId: routeCustomId } = useParams();
    const navigate = useNavigate();
    const { userInfo, loadingAuth } = useAuth();
    
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    
    const [uploading, setUploading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');

    const [allManufacturers, setAllManufacturers] = useState([]);
    const [allRam, setAllRam] = useState([]);
    const [allStorage, setAllStorage] = useState([]);

    const fetchProductData = useCallback(async () => {
        if (loadingAuth || !userInfo) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data: allProds } = await axios.get('/api/products?from=admin', config);
            setAllManufacturers([...new Set(allProds.map(p => p.manufacturer).filter(Boolean))]);
            setAllRam([...new Set(allProds.map(p => p.ram).filter(Boolean))].sort((a, b) => a - b));
            setAllStorage([...new Set(allProds.map(p => p.storage).filter(Boolean))].sort((a, b) => a - b));
            
            const { data } = await axios.get(`/api/products/admin/${routeCustomId}`, config);
            setProductData(data);
        } catch (err) {
            setError('Ошибка загрузки товара: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    }, [routeCustomId, userInfo, loadingAuth]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        if (name === 'name') {
            // Всегда работаем с `name` как с массивом
            setProductData(prev => ({ ...prev, name: value.split('\n') }));
        } else {
            setProductData(prev => ({ ...prev, [name]: newValue }));
        }
    };
    
    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        const numValue = value.replace(/[^0-9]/g, '');
        const updatedData = { ...productData, [name]: Number(numValue) };
        if (name === "priceValue") {
            updatedData.price = `${Number(numValue).toLocaleString('ru-RU')} ₽`;
        }
        setProductData(updatedData);
    };
    
    const addImageToGallery = () => { if (newImageUrl.trim()) { setProductData(prev => ({ ...prev, images: [...(prev.images || []), newImageUrl.trim()] })); setNewImageUrl(''); } };
    const removeImageFromGallery = (imgUrl) => { setProductData(prev => ({ ...prev, images: prev.images.filter(img => img !== imgUrl) })); };
    const handleKeySpecChange = (index, field, value) => { const updated = [...(productData.keySpecs || [])]; updated[index][field] = value; setProductData(prev => ({ ...prev, keySpecs: updated })); };
    const addKeySpec = () => setProductData(prev => ({ ...prev, keySpecs: [...(prev.keySpecs || []), { label: '', value: '' }] }));
    const removeKeySpec = (index) => setProductData(prev => ({ ...prev, keySpecs: prev.keySpecs.filter((_, i) => i !== index) }));
    const uploadFileHandler = async (e, fieldToUpdate) => { const file = e.target.files[0]; if (!file) return; const formData = new FormData(); formData.append('image', file); setUploading(true); try { const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` }}; const { data } = await axios.post('/api/upload', formData, config); if(fieldToUpdate === 'imageUrl') { setProductData(prev => ({ ...prev, imageUrl: data.image })); } else { setNewImageUrl(data.image); } } catch (err) { setError('Ошибка загрузки: ' + (err.response?.data?.message || err.message)); } finally { setUploading(false); } };

    const submitHandler = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`/api/products/${routeCustomId}`, productData, config);
            setIsSuccessModalOpen(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка сохранения товара');
        } finally {
            setSaving(false);
        }
    };
    
    if (loading || !productData) {
        return <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-4xl text-brand-blue" /></div>;
    }

    return (
        <>
            <ConfirmationModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} onConfirm={() => navigate('/admin/products')} title="Успешно!" message="Изменения успешно сохранены." confirmText="К списку товаров" cancelText="Продолжить редактирование"/>
            <div className="pb-12 relative">
                <button type="button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="fixed bottom-5 right-5 z-50 bg-brand-blue text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                    <FaArrowDown />
                </button>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-white truncate pr-4">Редактирование: {productData.name?.[0] || '...'}</h1>
                    <div className="flex items-center gap-4">
                        <a href={`/product/${productData.customId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded-md text-sm"><FaEye className="mr-2" />Предпросмотр</a>
                        <Link to="/admin/products" className="inline-flex items-center text-brand-blue hover:text-blue-400 text-sm flex-shrink-0"><FaArrowLeft className="mr-2" />К списку товаров</Link>
                    </div>
                </div>
                {error && <div className="bg-red-900/50 p-3 rounded-md mb-4 text-sm">{error}</div>}
                
                <form onSubmit={submitHandler} className="space-y-6 bg-brand-bg-black p-6 rounded-lg shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Название (каждая строка - новый элемент)*">
                            <textarea 
                                rows="2" 
                                name="name" 
                                value={Array.isArray(productData.name) ? productData.name.join('\n') : productData.name || ''} 
                                onChange={handleChange} 
                                required 
                                className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"
                            />
                        </FormField>
                        <FormField label="ID Группы*"><input type="text" name="groupId" value={productData.groupId || ''} onChange={handleChange} required className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/></FormField>
                        <FormField label="Custom ID*"><input type="text" name="customId" value={productData.customId || ''} onChange={handleChange} required className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/></FormField>
                        <FormField label="Производитель*"><input type="text" name="manufacturer" list="manufacturers-list" value={productData.manufacturer || ''} onChange={handleChange} required className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/><datalist id="manufacturers-list">{allManufacturers.map(m => <option key={m} value={m} />)}</datalist></FormField>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Цена*"><input type="text" name="priceValue" value={(productData.priceValue || 0).toLocaleString('ru-RU')} onChange={handleNumericChange} required className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/></FormField>
                        <FormField label="На складе*"><input type="number" name="countInStock" value={productData.countInStock || 0} onChange={handleChange} required className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/></FormField>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField label="RAM (ГБ)"><input type="number" name="ram" list="ram-list" value={productData.ram || ''} onChange={handleChange} className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/><datalist id="ram-list">{allRam.map(r => <option key={r} value={r} />)}</datalist></FormField>
                        <FormField label="Storage (ГБ)"><input type="number" name="storage" list="storage-list" value={productData.storage || ''} onChange={handleChange} className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/><datalist id="storage-list">{allStorage.map(s => <option key={s} value={s} />)}</datalist></FormField>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <FormField label="Название цвета (напр. Синий титан)"><input type="text" name="color" value={productData.color || ''} onChange={handleChange} className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/></FormField>
                        <FormField label="CSS цвет"><div className="flex items-center gap-2"><input type="color" name="colorHex" value={productData.colorHex || '#ffffff'} onChange={handleChange} className="w-10 h-10 p-0 border-none rounded-md cursor-pointer bg-transparent"/><input type="text" value={productData.colorHex || ''} onChange={handleChange} name="colorHex" placeholder="#FFFFFF" className="flex-grow bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/></div></FormField>
                    </div>
                    <FormField label="Краткое описание"><textarea name="shortDescription" rows="2" value={productData.shortDescription || ''} onChange={handleChange} className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/></FormField>
                    <FormField label="Полное описание"><textarea name="fullDescription" rows="5" value={productData.fullDescription || ''} onChange={handleChange} className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/></FormField>
                    <div className="pt-6 border-t border-brand-border-gray/50"><FormField label="URL основного изображения*"><input type="text" name="imageUrl" value={productData.imageUrl} onChange={handleChange} required className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white mb-2"/><label htmlFor="image-upload" className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer text-sm font-medium transition-colors"><FaUpload className="mr-2" /> Загрузить</label><input id="image-upload" type="file" onChange={(e) => uploadFileHandler(e, 'imageUrl')} className="hidden" disabled={uploading} /></FormField><div className="mt-6"><label className="block text-sm font-medium text-brand-gray-light">Галерея дополнительных изображений</label><div className="flex items-center gap-2 mt-1"><input type="text" placeholder="URL изображения или загрузите" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="flex-grow bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white"/><label htmlFor="gallery-upload" className="inline-flex items-center p-2.5 bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer text-sm font-medium transition-colors"><FaUpload /></label><input id="gallery-upload" type="file" onChange={(e) => uploadFileHandler(e, 'gallery')} className="hidden" disabled={uploading} /><button type="button" onClick={addImageToGallery} className="p-2.5 bg-brand-blue text-white rounded-md hover:bg-blue-700 transition-colors"><FaPlus /></button></div><div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4">{(productData.images || []).map(img => (<div key={img} className="relative group"><img src={img} alt="gallery" className="w-full aspect-square object-cover rounded-md"/><button type="button" onClick={() => removeImageFromGallery(img)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><FaTrash size={10}/></button></div>))}</div></div></div>
                    <div className="pt-6 border-t border-brand-border-gray/50"><h3 className="text-md font-medium text-white mb-3">Ключевые характеристики</h3>{(productData.keySpecs || []).map((spec, index) => (<div key={index} className="flex items-center space-x-2 mb-2"><input type="text" placeholder="Название (напр. Экран)" value={spec.label || ''} onChange={(e) => handleKeySpecChange(index, 'label', e.target.value)} className="flex-1 bg-brand-item-bg border-brand-border-gray rounded-md py-1.5 px-2 text-sm text-white"/><input type="text" placeholder="Значение (напр. 6.1 OLED)" value={spec.value || ''} onChange={(e) => handleKeySpecChange(index, 'value', e.target.value)} className="flex-1 bg-brand-item-bg border-brand-border-gray rounded-md py-1.5 px-2 text-sm text-white"/><button type="button" onClick={() => removeKeySpec(index)} className="text-red-500 hover:text-red-400 p-1"><FaTrash /></button></div>))}<button type="button" onClick={addKeySpec} className="text-sm text-brand-blue hover:underline mt-1"><FaPlus size={12} className="inline mr-1"/> Добавить</button></div>
                    <div className="pt-6 border-t border-brand-border-gray/50"><h3 className="text-md font-medium text-white mb-3">Флаги для главной страницы</h3><div className="flex flex-wrap gap-x-8 gap-y-4"><label className="flex items-center cursor-pointer"><input type="checkbox" name="isFeatured" checked={!!productData.isFeatured} onChange={handleChange} className="h-4 w-4 text-brand-blue bg-gray-700 rounded border-gray-600"/><span className="ml-2 text-sm text-white">Рекомендуемый</span></label><label className="flex items-center cursor-pointer"><input type="checkbox" name="isTrending" checked={!!productData.isTrending} onChange={handleChange} className="h-4 w-4 text-brand-blue bg-gray-700 rounded border-gray-600"/><span className="ml-2 text-sm text-white">В тренде</span></label><label className="flex items-center cursor-pointer"><input type="checkbox" name="onSale" checked={!!productData.onSale} onChange={handleChange} className="h-4 w-4 text-brand-blue bg-gray-700 rounded border-gray-600"/><span className="ml-2 text-sm text-white">Распродажа</span></label></div>{productData.onSale && (<div className="mt-4"><FormField label="Цена по акции"><input type="text" name="salePriceValue" value={(productData.salePriceValue || 0).toLocaleString('ru-RU')} onChange={handleNumericChange} className="w-full md:w-1/2 bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white" placeholder="Например: 89990"/></FormField></div>)}</div>

                    <div className="pt-6 border-t border-brand-border-gray/50">
                        <div className="p-4 rounded-lg bg-blue-900/30 border border-blue-700 mb-6">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" name="isPublished" checked={!!productData.isPublished} onChange={handleChange} className="h-5 w-5 text-green-500 bg-gray-700 rounded border-gray-600 focus:ring-green-500"/>
                                <span className="ml-3 text-md font-semibold text-white">Опубликовать товар</span>
                            </label>
                            <p className="text-xs text-gray-400 mt-1 ml-8">Если галочка не стоит, товар будет виден только в админ-панели как черновик.</p>
                        </div>
                        <button type="submit" disabled={saving || uploading} className="w-full flex justify-center py-2.5 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors">
                            {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
export default AdminProductEditPage;