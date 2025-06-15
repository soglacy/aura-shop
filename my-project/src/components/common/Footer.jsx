// src/components/common/Footer.jsx
import React from 'react';
import { FaVk, FaTelegramPlane, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Logo = ({ className = '' }) => (
    <Link to="/" className={`text-2xl font-bold tracking-wider uppercase text-white ${className}`}>
        Aura <span className="text-brand-blue font-light">Shop</span>
    </Link>
);

const Footer = () => {
  const usefulLinks1 = [
    { to: "/catalog", label: "Каталог товаров" },
    { to: "/promotions", label: "Акции и скидки" },
    { to: "/delivery-info", label: "Доставка и оплата" },
    { to: "/about-us", label: "О нас" },
  ];
  const usefulLinks2 = [
    { to: "/contact", label: "Служба поддержки" },
    { to: "/faq", label: "Частые вопросы (FAQ)" },
    { to: "/privacy-policy", label: "Политика конфиденциальности" },
    { to: "/terms-of-service", label: "Условия использования" },
  ];

  return (
    <footer className="bg-brand-bg-black text-brand-gray-light pt-16 pb-8 relative z-[70]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo />
              <p className="text-sm leading-relaxed mt-4 max-w-md">
                Aura Shop – ваш надежный проводник в мире современных технологий и гаджетов. Откройте для себя лучшие устройства, которые дополнят ваш стиль.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-5 uppercase tracking-wider">Магазин</h3>
            <ul className="space-y-3">
              {usefulLinks1.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-brand-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-5 uppercase tracking-wider">Поддержка</h3>
            <ul className="space-y-3">
              {usefulLinks2.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-brand-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border-gray pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Aura Shop. Все права защищены. <br className="md:hidden" />
            ИП Тараканов Максим Викторович.
          </p>
          <div className="flex space-x-5">
            <a href="https://vk.com/AuraStore" title="ВКонтакте" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-brand-blue transition-colors"><FaVk /></a>
            <a href="https://t.me/AuraStore" title="Telegram" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-brand-blue transition-colors"><FaTelegramPlane /></a>
            <a href="https://www.youtube.com/AuraStore" title="Youtube" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-brand-blue transition-colors"><FaYoutube /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;