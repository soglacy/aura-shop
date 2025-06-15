// src/pages/admin/AdminUserDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaSpinner, FaUser, FaEnvelope, FaCalendarAlt, FaBoxOpen } from 'react-icons/fa';

const AdminUserDetailPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo && userInfo.isAdmin) {
        setLoading(true);
        setError('');
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          // Запрос данных пользователя
          const { data: userData } = await axios.get(`/api/users/${userId}`, config);
          setUser(userData);
          // Запрос ВСЕХ заказов, чтобы потом отфильтровать по этому пользователю
          const { data: allOrders } = await axios.get('/api/orders', config);
          const userOrders = allOrders.filter(order => order.user?._id === userId);
          setOrders(userOrders);
        } catch (err) {
          setError(err.response?.data?.message || 'Ошибка загрузки данных');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [userId, userInfo]);

  if (loading) return <div className="p-8 text-center"><FaSpinner className="animate-spin text-4xl text-brand-blue" /></div>;
  if (error) return <div className="bg-red-900/50 p-4 rounded-lg">{error}</div>;
  if (!user) return <div className="p-8 text-center">Пользователь не найден.</div>;

  return (
    <div>
      <Link to="/admin/users" className="text-sm text-brand-blue hover:underline mb-6 inline-block">← К списку пользователей</Link>
      <h1 className="text-2xl font-semibold text-white mb-6">Информация о пользователе</h1>
      
      <div className="bg-brand-bg-black p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Личные данные</h2>
        <div className="space-y-3 text-sm">
          <p className="flex items-center"><FaUser className="mr-3 text-gray-400"/> <strong>Имя:</strong> <span className="ml-2 text-gray-200">{user.name}</span></p>
          <p className="flex items-center"><FaEnvelope className="mr-3 text-gray-400"/> <strong>Email:</strong> <span className="ml-2 text-gray-200">{user.email}</span></p>
          <p className="flex items-center"><FaCalendarAlt className="mr-3 text-gray-400"/> <strong>Дата регистрации:</strong> <span className="ml-2 text-gray-200">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span></p>
        </div>
      </div>

      <div className="bg-brand-bg-black p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FaBoxOpen className="mr-3 text-gray-400"/>
            Заказы пользователя ({orders.length})
        </h2>
        {orders.length > 0 ? (
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order._id} className="border border-brand-border-gray/50 p-3 rounded-md">
                       <div className="flex justify-between items-center">
                         <p className="font-semibold text-brand-blue">Заказ #{order._id.substring(0,8)}... от {new Date(order.createdAt).toLocaleDateString()}</p>
                         <p className="font-bold text-white">{order.totalPrice.toLocaleString('ru-RU')} ₽</p>
                       </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-400 text-sm">У этого пользователя еще нет заказов.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetailPage;