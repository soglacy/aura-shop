// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignOutAlt, FaSpinner, FaUserShield, FaCalendarAlt, FaInbox, FaBox, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

// --- ФИНАЛЬНАЯ ВЕРСИЯ КОМПОНЕНТА OrderCard ---
const OrderCard = ({ order }) => {
    // Функция для определения статуса заказа
    const getOrderStatus = () => {
        if (order.isDelivered) {
            return { text: 'Доставлен', icon: <FaCheckCircle />, color: 'bg-green-500/20 text-green-400' };
        }
        if (order.isPaid) {
            return { text: 'Готовится к отправке', icon: <FaBox />, color: 'bg-yellow-500/20 text-yellow-400' };
        }
        return { text: 'Ожидает оплаты', icon: <FaCreditCard />, color: 'bg-gray-600/50 text-gray-400' };
    };

    const status = getOrderStatus();

    return (
        <div className="bg-brand-bg-black rounded-lg p-4 sm:p-5 flex flex-col space-y-4">
            {/* Шапка карточки заказа */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <p className="font-semibold text-white text-base">Заказ #{order._id.substring(18).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">от {new Date(order.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
                <div className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                    {status.icon}
                    <span>{status.text}</span>
                </div>
            </div>

            {/* Список товаров */}
            <div className="space-y-3 pt-4 border-t border-brand-border-gray/30">
                {order.orderItems.map(item => (
                    <Link 
                        to={`/product/${item.customId}`} 
                        key={item._id || item.customId}
                        className="flex items-center gap-4 group"
                    >
                        <img 
                            src={item.imageUrl || '/images/placeholder.png'} 
                            alt={Array.isArray(item.name) ? item.name.join(' ') : item.name} 
                            className="w-12 h-12 object-contain rounded-md bg-gray-900/50 shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                            <p className="text-sm text-white font-medium group-hover:text-brand-blue transition-colors truncate">{Array.isArray(item.name) ? item.name.join(' ') : item.name}</p>
                            <p className="text-xs text-gray-400">{item.quantity} шт. × {item.price.toLocaleString('ru-RU')} ₽</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Футер карточки заказа */}
            <div className="flex justify-between items-center pt-4 border-t border-brand-border-gray/30">
                <div>
                    <span className="text-sm text-gray-400">Итого: </span>
                    <span className="font-bold text-white text-lg">{order.totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <button className="text-xs text-brand-blue font-semibold hover:underline">
                    Детали заказа
                </button>
            </div>
        </div>
    );
};


// --- Основной компонент страницы ---
const UserProfilePage = () => {
    const { userInfo, logout, loadingAuth } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (loadingAuth) return;

        if (userInfo) {
            const fetchMyOrders = async () => {
                setLoadingOrders(true);
                setError('');
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    const { data } = await axios.get('/api/orders/myorders', config);
                    setOrders(data);
                } catch (err) {
                    setError(err.response?.data?.message || 'Не удалось загрузить заказы');
                } finally {
                    setLoadingOrders(false);
                }
            };
            fetchMyOrders();
        } else {
           setLoadingOrders(false);
           navigate('/login');
        }
    }, [userInfo, loadingAuth, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };
  
    if (loadingAuth) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-brand-bg-dark">
                <FaSpinner className="animate-spin text-brand-blue text-5xl"/>
            </div>
        );
    }

    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader 
                title={userInfo ? `Профиль: ${userInfo.name}` : "Мой Профиль"}
                breadcrumbs={[{label: "Главная", path: "/"}, {label: "Профиль"}]}
                className="py-6 md:py-8"
            />
            <div className="container mx-auto px-4 py-8 md:py-12">
                {userInfo && (
                    <div className="bg-brand-bg-black p-6 md:p-8 rounded-xl shadow-2xl mb-10">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-24 h-24 bg-brand-blue rounded-full flex items-center justify-center text-4xl font-bold text-white shrink-0">{userInfo.name.charAt(0).toUpperCase()}</div>
                            <div className="flex-grow text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-white">{userInfo.name}</h2>
                                <p className="text-brand-gray-light text-sm">{userInfo.email}</p>
                                <p className={`text-xs mt-2 px-2 py-0.5 inline-block rounded-full ${userInfo.isAdmin ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>{userInfo.isAdmin ? 'Администратор' : 'Пользователь'}</p>
                                {userInfo.createdAt && (<p className="text-xs mt-2 text-gray-500 flex items-center justify-center sm:justify-start"><FaCalendarAlt className="mr-1.5" /><span>Зарегистрирован: {new Date(userInfo.createdAt).toLocaleDateString('ru-RU')}</span></p>)}
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0 sm:ml-auto">
                                <Link to="/profile/messages" className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-colors"><FaInbox className="mr-2"/>Мои обращения</Link>
                                {userInfo.isAdmin && (<Link to="/admin/dashboard" className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-brand-blue-dark hover:bg-brand-blue transition-colors"><FaUserShield className="mr-2"/>Админ-панель</Link>)}
                                <button onClick={handleLogout} className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"><FaSignOutAlt className="mr-2"/>Выйти</button>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="bg-transparent">
                    <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Мои покупки</h2>
                    {error && <div className="bg-red-900/50 p-4 rounded-lg text-sm mb-6">{error}</div>}
                    
                    {loadingOrders ? (
                        <div className="text-center py-10"><FaSpinner className="animate-spin text-brand-blue text-3xl mx-auto" /></div>
                    ) : orders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {orders.map(order => (
                                <OrderCard key={order._id} order={order} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-brand-bg-black rounded-xl">
                            <p className="text-brand-gray-light">У вас еще нет заказов.</p>
                            <Link to="/catalog" className="text-brand-blue hover:underline mt-2 inline-block font-semibold">Начать покупки</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;