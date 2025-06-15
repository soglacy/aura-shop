// src/components/common/NotificationsDropdown.jsx
import React from 'react';
import { FaBell, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotificationsDropdown = ({ notifications = [], onReadAll, onDelete, unreadCount }) => {
  return (
    <div 
      className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-brand-bg-black border border-brand-border-gray/50 rounded-lg shadow-2xl z-50 animate-fade-in-down overflow-hidden"
      onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие по клику внутри
    >
      <div className="p-3 flex justify-between items-center border-b border-brand-border-gray/50 bg-gray-900/50">
        <h4 className="font-semibold text-white">Уведомления</h4>
        {unreadCount > 0 && (
          <button onClick={onReadAll} className="text-xs text-brand-blue hover:underline">
            Отметить все как прочитанные
          </button>
        )}
      </div>
      {/* Кастомный скроллбар будет применен через CSS */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div key={notif._id} className={`group relative p-3 border-b border-brand-border-gray/30 ${!notif.isRead ? 'bg-blue-900/20' : ''}`}>
              <Link to={notif.link || '#'} className="flex items-start gap-3">
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
          <div className="p-10 text-center text-sm text-gray-500">
            У вас пока нет уведомлений.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsDropdown;