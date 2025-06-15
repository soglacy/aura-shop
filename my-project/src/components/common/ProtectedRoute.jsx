// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userInfo, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    // Можно показать здесь спиннер или просто ничего не рендерить, пока идет проверка auth статуса
    return <div className="flex justify-center items-center h-screen"><p className="text-white">Загрузка аутентификации...</p></div>; 
  }

  if (!userInfo) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    // Сохраняем текущий путь в state, чтобы после входа можно было вернуться
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если пользователь авторизован, рендерим дочерний компонент
  return children;
};

export default ProtectedRoute;