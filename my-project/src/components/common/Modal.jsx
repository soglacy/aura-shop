// src/components/common/Modal.jsx
import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" // z-index выше чем у слайдера
      onClick={onClose} // Закрытие по клику на фон
    >
      <div 
        className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-w-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие по клику на само окно
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Закрыть модальное окно"
        >
          <FiX size={24} />
        </button>
        {children} {/* Сюда будет вставлено содержимое модального окна */}
      </div>
    </div>
  );
};

export default Modal;