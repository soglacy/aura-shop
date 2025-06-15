// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({
  userInfo: null,
  loadingAuth: true,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  setUserInfo: () => {}
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    try {
      const storedUserInfo = localStorage.getItem('auraUserInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      console.error("Ошибка загрузки userInfo из localStorage:", error);
      localStorage.removeItem('auraUserInfo');
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  const register = async (name, email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/register', { name, email, password }, config);
      setUserInfo(data);
      localStorage.setItem('auraUserInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Ошибка регистрации:", error.response ? error.response.data : error.message);
      throw error.response?.data?.message || error.message || 'Ошибка регистрации';
    }
  };

  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password }, config);
      setUserInfo(data);
      localStorage.setItem('auraUserInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Ошибка входа:", error.response ? error.response.data : error.message);
      throw error.response?.data?.message || error.message || 'Ошибка входа';
    }
  };

  const logout = () => {
    localStorage.removeItem('auraUserInfo');
    setUserInfo(null);
  };

  const value = {
    userInfo,
    loadingAuth,
    register,
    login,
    logout,
    setUserInfo, 
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* Убрал !loadingAuth отсюда, пусть дочерние компоненты сами решают, что делать при загрузке */}
    </AuthContext.Provider>
  );
};