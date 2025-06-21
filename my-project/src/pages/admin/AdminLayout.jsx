// src/pages/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaUsers, FaSignOutAlt, FaInbox } from 'react-icons/fa';

const AdminLayout = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Используем useCallback, чтобы функция не пересоздавалась при каждом рендере
  const fetchUnreadCount = React.useCallback(async () => {
    if (userInfo && userInfo.isAdmin) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/messages', config); 
        setUnreadMessages(data.filter(msg => !msg.isRead).length);
      } catch (error) {
        console.error("Не удалось загрузить количество сообщений:", error);
      }
    }
  }, [userInfo]);

  useEffect(() => {
    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 30000); // Проверять каждые 30 секунд

    return () => clearInterval(intervalId);
  }, [fetchUnreadCount]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) => 
    `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'bg-brand-blue text-white shadow-md' 
        : 'text-gray-300 hover:bg-brand-blue/20 hover:text-white'
    }`;

  return (
    <div className="flex h-screen bg-brand-bg-dark text-white">
      <aside className="w-64 bg-brand-bg-black p-5 space-y-6 shadow-lg flex flex-col">
        <div>
          <Link to="/admin/dashboard" title="Перейти на дашборд" className="block text-center mb-10">
            <span className="text-3xl font-bold tracking-wider uppercase text-white">
                Aura <span className="text-brand-blue font-light">Shop</span>
            </span>
            <div className="mt-1">
                <span className="text-sm font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">
                    Admin Panel
                </span>
            </div>
          </Link>
          
          <nav className="space-y-2">
            <NavLink to="/admin/dashboard" className={navLinkClasses} end> 
              <FaTachometerAlt className="mr-3" /> Дашборд
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClasses}>
              <FaBoxOpen className="mr-3" /> Товары
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClasses}>
              <FaShoppingCart className="mr-3" /> Заказы
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClasses}>
              <FaUsers className="mr-3" /> Пользователи
            </NavLink>
            
            <NavLink to="/admin/messages" className={navLinkClasses}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <FaInbox className="mr-3" /> Сообщения
                </div>
                {unreadMessages > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadMessages}
                    </span>
                )}
              </div>
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto">
            {userInfo && (
                <div className="text-xs text-gray-400 mb-2 px-2">
                    Вошли как: <span className="font-medium text-gray-200">{userInfo.name}</span>
                </div>
            )}
            <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2.5 rounded-lg text-gray-300 hover:bg-red-600/80 hover:text-white transition-colors duration-200 bg-red-600/50"
            >
                <FaSignOutAlt className="mr-3" /> Выйти
            </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet context={{ refreshMessageCount: fetchUnreadCount }} />
      </main>
    </div>
  );
};

export default AdminLayout;