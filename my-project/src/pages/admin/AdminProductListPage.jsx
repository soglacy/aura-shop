// src/pages/admin/AdminProductListPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaCopy, FaSearch } from 'react-icons/fa';
import ConfirmationModal from '../../components/common/ConfirmationModal';

// slugify здесь больше не нужен

const AdminProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [operationLoading, setOperationLoading] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { userInfo, loadingAuth } = useAuth(); 
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const fetchProducts = useCallback(async () => {
        if (loadingAuth || !userInfo) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` }, params: { from: 'admin' } };
            const { data } = await axios.get('/api/products', config);
            setProducts(data);
        } catch (err) { setError(err.response?.data?.message || 'Ошибка загрузки');
        } finally { setLoading(false); }
    }, [userInfo, loadingAuth, navigate]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const filteredProducts = useMemo(() => {
        return products
            .filter(p => {
                const nameAndId = `${p.name.join(' ')} ${p.customId}`.toLowerCase();
                return nameAndId.includes(searchTerm.toLowerCase());
            })
            .filter(p => {
                if (statusFilter === 'all') return true;
                if (statusFilter === 'published') return p.isPublished;
                if (statusFilter === 'draft') return !p.isPublished;
                return true;
            });
    }, [products, searchTerm, statusFilter]);
    
    // <<< НАЧАЛО ГЛАВНОГО ИСПРАВЛЕНИЯ >>>
    const copyProductHandler = async (productToCopy) => {
        if (!window.confirm(`Создать копию товара "${productToCopy.name[0]}"?`)) return;
        setOperationLoading(productToCopy.customId);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // Мы просто отправляем объект. Сервер сам разберется, как его копировать.
            await axios.post('/api/products', productToCopy, config);
            await fetchProducts();
        } catch (err) {
            alert(`Ошибка копирования: ${err.response?.data?.message || err.message}`);
        } finally {
            setOperationLoading(null);
        }
    };
    // <<< КОНЕЦ ГЛАВНОГО ИСПРАВЛЕНИЯ >>>

    const createProductHandler = async () => {
        setOperationLoading('create');
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data: newProduct } = await axios.post('/api/products', {}, config);
            navigate(`/admin/product/${newProduct.customId}/edit`);
        } catch (err) {
            alert(`Ошибка создания: ${err.response?.data?.message || err.message}`);
            setOperationLoading(null);
        }
    };
    
    const handleDeleteRequest = async (customId) => {
        setOperationLoading(customId);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`/api/products/${customId}`, config);
            await fetchProducts();
        } catch (err) {
            alert(`Ошибка удаления: ${err.response?.data?.message || err.message}`);
        } finally {
            setOperationLoading(null);
            setIsModalOpen(false);
        }
    };

    const deleteHandler = (customId) => { setIsModalOpen(true); setModalAction(() => () => handleDeleteRequest(customId)); setModalContent({ title: 'Подтвердить удаление', message: 'Вы уверены?' }); };

    if (loading) return <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-4xl text-brand-blue" /></div>;
    if (error) return <div className="bg-red-900/50 p-4 rounded-lg">{error}</div>;

    return (
        <>
            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={modalAction} {...modalContent} />
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-white">Список Товаров ({filteredProducts.length})</h1>
                    <button onClick={createProductHandler} disabled={!!operationLoading} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition-colors disabled:opacity-50">
                        {operationLoading === 'create' ? <FaSpinner className="animate-spin mr-2" /> : <FaPlus className="mr-2" />} Создать товар
                    </button>
                </div>
                
                <div className="mb-4 p-4 bg-brand-bg-black/50 rounded-lg flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-grow w-full md:w-auto">
                        <input type="text" placeholder="Поиск по названию или ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-brand-item-bg border-brand-border-gray rounded-md py-2 pl-10 pr-4 text-white focus:ring-brand-blue focus:border-brand-blue"/>
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full md:w-auto bg-brand-item-bg border-brand-border-gray rounded-md py-2 px-3 text-white focus:ring-brand-blue focus:border-brand-blue">
                        <option value="all">Все статусы</option>
                        <option value="published">Опубликованные</option>
                        <option value="draft">Черновики</option>
                    </select>
                </div>

                <div className="bg-brand-bg-black shadow-xl rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-brand-border-gray">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CustomID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Название</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Цена</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">В наличии</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="bg-brand-bg-black divide-y divide-brand-border-gray">
                        {filteredProducts.map((product) => (
                            <tr key={product.customId} className={`hover:bg-gray-800/30 ${product.countInStock === 0 ? 'opacity-60' : ''}`}>
                                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-400">{product.customId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    <Link to={`/admin/product/${product.customId}/edit`} className="hover:text-brand-blue font-semibold">{product.name?.[0] || 'Без названия'}</Link>
                                    <p className="text-xs text-gray-400 mt-1">{product.name?.[1] || `${product.color || ''} ${product.storage ? `${product.storage}ГБ` : ''}`.trim()}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-blue">
                                    {product.onSale && product.salePriceValue > 0 ? (
                                        <div>
                                            <span className="text-red-500 font-bold">{product.salePriceValue.toLocaleString('ru-RU')} ₽</span>
                                            <span className="text-xs text-gray-500 line-through block">{product.priceValue.toLocaleString('ru-RU')} ₽</span>
                                        </div>
                                    ) : (<span>{product.price}</span>)}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-center ${product.countInStock === 0 ? 'text-red-500 font-bold' : 'text-gray-300'}`}>{product.countInStock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{product.isPublished ? 'Опубликован' : 'Черновик'}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => copyProductHandler(product)} title="Копировать товар" disabled={!!operationLoading} className="text-blue-400 hover:text-blue-300 p-1.5 bg-blue-600/20 hover:bg-blue-600/30 rounded-md inline-flex items-center disabled:opacity-50">
                                        {operationLoading === product.customId ? <FaSpinner className="animate-spin" /> : <FaCopy />}
                                    </button>
                                    <Link to={`/admin/product/${product.customId}/edit`} className="text-yellow-400 hover:text-yellow-300 p-1.5 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-md inline-flex items-center"><FaEdit /></Link>
                                    <button onClick={() => deleteHandler(product.customId)} disabled={!!operationLoading} className="text-red-400 hover:text-red-300 p-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-md inline-flex items-center disabled:opacity-50">
                                        {operationLoading === product.customId ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};
export default AdminProductListPage;