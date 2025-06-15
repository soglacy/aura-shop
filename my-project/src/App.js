// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CheckoutPage from './pages/CheckoutPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PromotionsPage from './pages/PromotionsPage';
import ContactPage from './pages/ContactPage';
import UserProfilePage from './pages/UserProfilePage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminRoute from './components/common/AdminRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductListPage from './pages/admin/AdminProductListPage'; 
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminOrderListPage from './pages/admin/AdminOrderListPage'; // <-- Импорт
import AdminUserListPage from './pages/admin/AdminUserListPage';   // <-- Импорт
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import BlogPostPage from './pages/BlogPostPage';
import DeliveryInfoPage from './pages/DeliveryInfoPage';
import AboutUsPage from './pages/AboutUsPage';
import FaqPage from './pages/FaqPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import UserMessagesPage from './pages/UserMessagesPage';
import ScrollToTop from './components/common/ScrollToTop';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* === НАЧАЛО ИЗМЕНЕНИЙ В РОУТАХ === */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          {/* Убираем .html и используем более семантичные пути */}
          <Route path="catalog" element={<CatalogPage />} /> 
          <Route path="cart" element={<CartPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
          
          <Route path="order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          
          {/* Объединяем роуты профиля */}
          <Route path="profile">
            <Route index element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="messages" element={<ProtectedRoute><UserMessagesPage /></ProtectedRoute>} />
          </Route>
          
          <Route path="blog/:postSlug" element={<BlogPostPage />} />
          <Route path="delivery-info" element={<DeliveryInfoPage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-service" element={<TermsOfServicePage />} />
        </Route>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* АДМИН-РОУТЫ */}
        <Route 
          path="/admin" 
          element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
          <Route index element={<AdminDashboardPage />} /> 
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductListPage />} />
          <Route path="product/new/edit" element={<AdminProductEditPage />} />
          <Route path="product/:customId/edit" element={<AdminProductEditPage />} />
          <Route path="orders" element={<AdminOrderListPage />} /> {/* <-- Новый роут */}
          <Route path="users" element={<AdminUserListPage />} />
          <Route path="user/:userId" element={<AdminUserDetailPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          {/* Роуты для деталей заказа и редактирования пользователя для админа (будущие) */}
          {/* <Route path="order/:id" element={<AdminOrderDetailPage />} /> */}
          {/* <Route path="user/:id/edit" element={<AdminUserEditPage />} /> */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;