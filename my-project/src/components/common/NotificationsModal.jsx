// src/components/common/NotificationsModal.jsx
import React from 'react';
import { FaTimes, FaBell, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotificationsModal = ({ isOpen, onClose, notifications = [], onReadAll, onDelete, unreadCount }) => {
  if (!isOpen) return null;

  return (
    // Оверлей на весь экран с блюром
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex justify-center items-center p-4"
      onClick={onClose} // Закрытие по клику на фон
    >
      {/* Контейнер модального окна */}
      <div 
        className="bg-brand-bg-black w-full max-w-md rounded-xl shadow-2xl flex flex-col h-[70vh] border border-brand-border-gray/50 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие по клику внутри
      >
        {/* Шапка модального окна */}
        <div className="p-4 flex justify-between items-center border-b border-brand-border-gray/50 shrink-0">
          <h4 className="font-semibold text-white text-lg">Уведомления</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Тело модального окна с прокруткой */}
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div key={notif._id} className={`group relative p-4 border-b border-brand-border-gray/30 ${!notif.isRead ? 'bg-blue-900/20' : ''}`}>
                <Link to={notif.link || '#'} onClick={onClose} className="flex items-start gap-4">
                  <div className={`mt-1 shrink-0 ${!notif.isRead ? 'text-brand-blue' : 'text-green-500'}`}>
                      {notif.isRead ? <FaCheckCircle/> : <FaBell/>}
                  </div>
                  <div>
                      <p className="font-semibold text-sm text-white leading-tight">{notif.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(notif.createdAt).toLocaleString('ru-RU')}</p>
                  </div>
                </Link>
                <button 
                  onClick={() => onDelete(notif._id)} 
                  title="Удалить уведомление"
                  className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <FaTrash size={12}/>
                </button>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-sm text-gray-500 flex flex-col items-center justify-center h-full">
              <FaBell className="text-4xl text-gray-600 mb-4"/>
              У вас пока нет уведомлений.
            </div>
          )}
        </div>

        {/* Футер модального окна */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-brand-border-gray/50 shrink-0">
             <button 
                onClick={onReadAll} 
                disabled={unreadCount === 0}
                className="w-full text-center text-sm text-brand-blue hover:bg-brand-blue/10 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
             >
                Отметить все как прочитанные
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsModal;