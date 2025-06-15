import React from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Подтвердите действие",
  message = "Вы уверены, что хотите продолжить?",
  confirmText = "Подтвердить",
  cancelText = "Отмена"
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div 
        className="bg-brand-bg-black rounded-lg shadow-xl w-full max-w-sm m-4 p-6 border border-brand-border-gray"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <p className="text-sm text-brand-gray-light mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-500 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;