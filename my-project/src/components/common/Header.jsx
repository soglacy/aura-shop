// src/components/common/Header.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react'; // <<< ИСПРАВЛЕНИЕ ЗДЕСЬ
import { FiMenu, FiX, FiBell, FiHome, FiGrid, FiInfo, FiMessageSquare, FiUser, FiShoppingCart, FiInbox, FiLogOut, FiLogIn } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import NotificationsDropdown from './NotificationsDropdown';
import NotificationsModal from './NotificationsModal';

// Компонент NavLink
const NavLink = ({ to, children, exact = false, ...props }) => {
    const location = useLocation();
    let isActive = exact ? location.pathname === to : (to !== "/" && location.pathname.startsWith(to));
    if (to === "/") isActive = location.pathname === "/";
    const activeClasses = isActive ? "text-white before:w-full" : "text-brand-gray-light hover:text-white hover:before:w-full";
    return (<Link to={to} {...props} className={`text-sm font-bold uppercase transition-colors duration-300 relative before:content-[''] before:absolute before:left-0 before:bottom-[-2px] before:h-[3px] before:w-0 before:bg-brand-blue before:transition-all before:duration-300 ${activeClasses}`}>{children}</Link>);
};

// Компонент Logo
const Logo = ({ className = '' }) => ( <Link to="/" className={`text-2xl font-bold tracking-wider uppercase text-white ${className}`}>Aura <span className="text-brand-blue font-light">Shop</span></Link>);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { cartItemCount } = useCart();
  const { userInfo, logout } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notificationRef = useRef(null);
  
  useEffect(() => { const handleScroll = () => setIsSticky(window.scrollY > 1); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  
  const fetchNotifications = useCallback(async () => { 
      if (userInfo) { 
          try { 
              const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }; 
              const { data } = await axios.get('/api/notifications', config); 
              setNotifications(data); setUnreadCount(data.filter(n => !n.isRead).length); 
            } catch (error) { console.error("Ошибка загрузки уведомлений:", error); } 
        } 
    }, [userInfo]);

  useEffect(() => { if (userInfo) { fetchNotifications(); const interval = setInterval(fetchNotifications, 60000); return () => clearInterval(interval); } else { setNotifications([]); setUnreadCount(0); } }, [fetchNotifications, userInfo]);
  
  const handleMarkAllRead = async () => { try { const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }; await axios.put('/api/notifications/read-all', {}, config); setNotifications(notifications.map(n => ({ ...n, isRead: true }))); setUnreadCount(0); setIsDropdownOpen(false); setIsModalOpen(false); } catch (error) { console.error("Ошибка отметки уведомлений:", error); } };
  
  const handleDeleteNotification = async (id) => { const newNotifications = notifications.filter(n => n._id !== id); setNotifications(newNotifications); setUnreadCount(newNotifications.filter(n => !n.isRead).length); try { const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }; await axios.delete(`/api/notifications/${id}`, config); } catch (error) { console.error("Ошибка удаления уведомления:", error); fetchNotifications(); } };
  
  useEffect(() => { const handleClickOutside = (event) => { if (notificationRef.current && !notificationRef.current.contains(event.target)) { setIsDropdownOpen(false); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, []);
  
  const navItemsLeft = [ { id: 'home', to: "/", label: "Главная", icon: <FiHome/>, exact: true }, { id: 'catalog', to: "/catalog", label: "Каталог", icon: <FiGrid/> }, { id: 'about', to: "/about-us", label: "О нас", icon: <FiInfo/> }, ];
  const navItemsRight = [ { id: 'contact', to: "/contact", label: "Контакты", icon: <FiMessageSquare/> }, ];
  const mobileNavItems = [ ...navItemsLeft, ...navItemsRight ];
  const renderNavLinks = (items) => ( <ul className="navigation flex items-center space-x-6 lg:space-x-10"> {items.map((item) => <li key={item.id}><NavLink to={item.to} exact={item.exact}>{item.label}</NavLink></li>)} </ul> );
  const handleLogout = () => { logout(); setIsMobileMenuOpen(false); }

  return (
    <>
      {isSticky && <div className="h-[80px]"></div>}
      <header className={`main-header bg-brand-bg-black transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-[100] shadow-2xl' : 'relative'}`}>
        <div className="header-upper relative"><div className="container mx-auto px-4 flex items-center justify-between h-[80px]"><nav className="main-menu hidden md:flex flex-1 justify-start">{renderNavLinks(navItemsLeft)}</nav><div className="logo-outer md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20"><Logo /></div><div ref={notificationRef} className="flex items-center justify-end flex-1"><nav className="main-menu hidden md:flex">{renderNavLinks(navItemsRight)}</nav>{userInfo ? (<div className="hidden md:flex items-center h-full ml-4 lg:ml-6 relative"><NavLink to="/profile">Профиль</NavLink><button onClick={() => setIsDropdownOpen(prev => !prev)} className="p-2 -mr-2 text-gray-400 hover:text-white relative" aria-label="Уведомления"><FiBell />{unreadCount > 0 && (<span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-brand-bg-black"></span>)}</button>{isDropdownOpen && <NotificationsDropdown notifications={notifications} onReadAll={handleMarkAllRead} onDelete={handleDeleteNotification} unreadCount={unreadCount}/>}</div>) : (<div className="hidden md:block ml-4 lg:ml-6"><NavLink to="/login">Вход</NavLink></div>)}<div className="hidden md:block ml-4 lg:ml-6"><Link to="/cart" className="flex items-center group/cart"><NavLink to="/cart" className="group-hover/cart:text-white">Корзина</NavLink>{cartItemCount > 0 && (<span className="ml-2 flex items-center justify-center h-5 w-5 rounded-full bg-brand-blue text-white text-xs font-bold leading-none">{cartItemCount}</span>)}</Link></div></div><div className="mobile-nav-toggler md:hidden relative"><button onClick={() => setIsMobileMenuOpen(true)} aria-label="Открыть меню" className="p-2"><FiMenu className="text-brand-blue text-2xl" /></button>{unreadCount > 0 && (<span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-brand-bg-black"></span>)}</div></div></div>
      </header>
      
      <div className={`mobile-menu fixed top-0 right-0 h-full w-[300px] max-w-[90%] bg-brand-bg-dark z-[10001] shadow-2xl transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="menu-box p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 pb-4"> <Logo className="text-2xl"/> <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Закрыть меню" className="text-gray-400 hover:text-white p-1"><FiX className="text-xl" /></button></div>
            {userInfo && (<div className="mb-6 p-4 bg-brand-bg-black/50 rounded-lg flex items-center gap-4"><div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0">{userInfo.name.charAt(0).toUpperCase()}</div><div><p className="font-semibold text-white truncate">{userInfo.name}</p><p className="text-xs text-brand-gray-light truncate">{userInfo.email}</p></div></div>)}
            <nav className="menu-outer flex-grow">
                <ul className="space-y-2 list-none">
                  {mobileNavItems.map((item) => (<li key={item.id}><Link to={item.to} onClick={() => setIsMobileMenuOpen(false)} className={`w-full text-left flex items-center gap-3 py-3 text-base transition-colors rounded-lg px-4 ${location.pathname === item.to ? 'bg-brand-blue text-white font-semibold' : 'text-gray-200 hover:bg-brand-bg-black/50'}`}>{item.icon} {item.label}</Link></li>))}
                  {userInfo && (<>
                        <div className="h-px bg-brand-border-gray/20 my-3"></div>
                        <li><Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`w-full text-left flex items-center gap-3 py-3 text-base transition-colors rounded-lg px-4 ${location.pathname.startsWith('/profile') && !location.pathname.includes('messages') ? 'bg-brand-blue text-white font-semibold' : 'text-gray-200 hover:bg-brand-bg-black/50'}`}><FiUser/> Профиль</Link></li>
                        <li><Link to="/profile/messages" onClick={() => { setIsMobileMenuOpen(false); }} className={`w-full text-left flex items-center gap-3 py-3 text-base transition-colors rounded-lg px-4 ${location.pathname.startsWith('/profile/messages') ? 'bg-brand-blue text-white font-semibold' : 'text-gray-200 hover:bg-brand-bg-black/50'}`}><FiInbox/> Мои обращения</Link></li>
                        <li><button onClick={() => setIsModalOpen(true)} className={`w-full text-left flex items-center gap-3 py-3 text-base transition-colors rounded-lg px-4 relative text-gray-200 hover:bg-brand-bg-black/50`}><FiBell/> Уведомления {unreadCount > 0 && <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">{unreadCount}</span>}</button></li>
                      </>
                  )}
                </ul>
            </nav>
            <div className="mt-auto pt-4 flex flex-col gap-3">
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center py-3 px-4 bg-brand-blue/20 text-brand-blue rounded-lg font-semibold hover:bg-brand-blue hover:text-white transition-all"><FiShoppingCart className="mr-2"/> Корзина {cartItemCount > 0 && <span className="ml-2 flex items-center justify-center h-5 w-5 rounded-full bg-brand-blue text-white text-xs font-bold">{cartItemCount}</span>}</Link>
                {userInfo ? (<button onClick={handleLogout} className="w-full flex items-center justify-center py-2.5 px-4 bg-red-600/20 text-red-400 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all"><FiLogOut className="mr-2"/> Выйти</button>) : (<Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center py-2.5 px-4 bg-green-600/20 text-green-400 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-all"><FiLogIn className="mr-2"/> Войти</Link>)}
            </div>
        </div>
      </div>
      
      <NotificationsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} notifications={notifications} onReadAll={handleMarkAllRead} onDelete={handleDeleteNotification} unreadCount={unreadCount}/>
      {isMobileMenuOpen && ( <div className="menu-backdrop fixed inset-0 bg-black/75 z-[10000] md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div> )}
    </>
  );
};

export default Header;