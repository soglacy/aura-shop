// src/pages/admin/AdminOrderListPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaSpinner, FaCheck, FaTimes, FaTruck, FaTrash, FaUndo } from 'react-icons/fa';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminOrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // Запрашиваем ВСЕ заказы для админа
            const { data } = await axios.get('/api/orders', config);
            setOrders(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка загрузки заказов');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchOrders();
        }
    }, [userInfo]);

    const openConfirmationModal = (action, content) => {
        setModalAction(() => action);
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleDeliverToggle = (order) => {
        const actionText = order.isDelivered ? 'отменить статус "Доставлено"' : 'отметить заказ как "Доставлено"';
        openConfirmationModal(
            async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    await axios.put(`/api/orders/${order._id}/deliver`, { isDelivered: !order.isDelivered }, config);
                    fetchOrders();
                } catch (err) {
                    alert(`Ошибка: ${err.response?.data?.message}`);
                }
                setIsModalOpen(false);
            },
            { title: 'Подтвердить действие', message: `Вы уверены, что хотите ${actionText}?` }
        );
    };
    
    const handleDeleteRequest = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`/api/orders/${id}`, config);
            fetchOrders();
        } catch (err) {
            alert(`Ошибка удаления: ${err.response?.data?.message}`);
        }
        setIsModalOpen(false);
    };

    const deleteHandler = (id) => {
        openConfirmationModal(
            () => handleDeleteRequest(id), 
            { title: 'Удалить заказ?', message: 'Это действие нельзя будет отменить.' }
        );
    };

    if (loading) return <div className="text-center p-8"><FaSpinner className="animate-spin text-brand-blue text-4xl mx-auto" /></div>;
    if (error) return <div className="bg-red-900/50 p-4 rounded-lg">{error}</div>;

    return (
        <>
            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={modalAction} {...modalContent} />
            <div>
                <h1 className="text-2xl font-semibold text-white mb-6">Все заказы ({orders.length})</h1>
                <div className="bg-brand-bg-black shadow-xl rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-brand-border-gray">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Пользователь</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Дата</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Сумма</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase" title="Статус оплаты">Оплачен</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase" title="Статус доставки">Доставлен</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="bg-brand-bg-black divide-y divide-brand-border-gray">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-800/30">
                                    <td className="px-4 py-4 text-xs text-gray-400">{order._id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 text-sm text-white">{order.user?.name || 'Пользователь удален'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-brand-blue font-semibold">{order.totalPrice.toLocaleString('ru-RU')} ₽</td>
                                    <td className="px-6 py-4 text-center">{order.isPaid ? <FaCheck className="text-green-500 mx-auto" /> : <FaTimes className="text-red-500 mx-auto" />}</td>
                                    <td className="px-6 py-4 text-center">{order.isDelivered ? <FaCheck className="text-green-500 mx-auto" /> : <FaTimes className="text-red-500 mx-auto" />}</td>
                                    <td className="px-4 py-4 text-right text-sm space-x-2">
                                        <button onClick={() => handleDeliverToggle(order)} title={order.isDelivered ? "Отменить доставку" : "Отметить как доставленный"}
                                                className={`p-1.5 rounded-md inline-flex transition-colors ${order.isDelivered ? 'text-yellow-400 bg-yellow-600/20 hover:bg-yellow-600/30' : 'text-green-400 bg-green-600/20 hover:bg-green-600/30'}`}>
                                            {order.isDelivered ? <FaUndo /> : <FaTruck />}
                                        </button>
                                        <button onClick={() => deleteHandler(order._id)} title="Удалить заказ" className="text-red-400 hover:text-red-300 p-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-md inline-flex">
                                            <FaTrash />
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

export default AdminOrderListPage;