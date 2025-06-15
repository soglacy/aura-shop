// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, userInfo } = useAuth();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(from, { replace: true });
    }
  }, [navigate, userInfo, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(String(err) || 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen auth-bg p-4">
      <div className="w-full max-w-md mx-auto">
        <Link to="/" className="block mb-8 text-center animate-fade-in-up">
            <span className="text-4xl font-bold tracking-wider uppercase text-white">
                Aura <span className="text-brand-blue font-light">Shop</span>
            </span>
        </Link>
        <div className="bg-brand-bg-black/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-brand-border-gray/20 animate-fade-in-up animation-delay-200">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white">Вход в аккаунт</h2>
                <p className="text-brand-gray-light mt-1 text-sm">Добро пожаловать!</p>
            </div>
            {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-md text-sm mb-6">{error}</div>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <input id="email-address" name="email" type="email" autoComplete="email" required
                       className="w-full px-4 py-3 bg-brand-item-bg border-2 border-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                       placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <input id="password" name="password" type="password" autoComplete="current-password" required
                       className="w-full px-4 py-3 bg-brand-item-bg border-2 border-transparent rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                       placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              
              <div className="flex items-center justify-end text-sm">
                <a href="#" className="font-medium text-brand-blue hover:text-blue-400">Забыли пароль?</a>
              </div>

              <div>
                <button type="submit" disabled={loading}
                        className="w-full flex justify-center py-3 px-4 rounded-lg text-white font-semibold bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-dark focus:ring-brand-blue transition-colors disabled:opacity-50">
                  {loading ? <FaSpinner className="animate-spin" /> : 'Войти'}
                </button>
              </div>
            </form>
            
            {/* Блок с соцсетями и разделителем УДАЛЕН */}

            <div className="text-center text-sm text-brand-gray-light mt-8">
              <p>
                Нет аккаунта?{' '}
                <Link to="/register" className="font-medium text-brand-blue hover:text-blue-400">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;