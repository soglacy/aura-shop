// src/components/common/AdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa'; // Импортируем спиннер

const AdminRoute = ({ children }) => {
  const { userInfo, loadingAuth } = useAuth();
  const location = useLocation();

  // <<< НАЧАЛО ГЛАВНОГО ИСПРАВЛЕНИЯ >>>

  // 1. Пока идет проверка авторизации, показываем спиннер на всю страницу.
  // Это гарантирует, что ни один дочерний компонент не начнет рендериться
  // с неполными данными.
  if (loadingAuth) {
    return (
        <div className="flex justify-center items-center h-screen bg-brand-bg-dark">
            <FaSpinner className="animate-spin text-brand-blue text-4xl" />
        </div>
    );
  }

  // 2. Когда проверка завершена, проверяем результат.
  // Если пользователя нет или он не админ, перенаправляем.
  if (!userInfo || !userInfo.isAdmin) {
    // Если пытался зайти не-админ, лучше перенаправить его на главную,
    // а не на страницу логина, где он уже может быть залогинен.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. Только если проверка завершена И пользователь является админом,
  // рендерим дочерний компонент (в нашем случае - AdminLayout и его Outlet).
  return children;

  // <<< КОНЕЦ ГЛАВНОГО ИСПРАВЛЕНИЯ >>>
};

export default AdminRoute;