// src/pages/FaqPage.jsx
import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { FaChevronDown } from 'react-icons/fa';

// Внутренний компонент для аккордеона
const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-brand-border-gray">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-1 focus:outline-none"
            >
                <h3 className="text-md md:text-lg font-semibold text-white">{title}</h3>
                <FaChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pb-4 text-sm text-brand-gray-light leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};

const faqData = [
    { q: 'Какие сроки доставки?', a: 'Стандартные сроки доставки составляют от 2 до 7 рабочих дней в зависимости от вашего региона. Для курьерской доставки по городу — 1-2 дня.' },
    { q: 'Является ли продукция оригинальной?', a: 'Да, мы продаем только 100% оригинальную продукцию от официальных поставщиков и производителей. На все товары распространяется гарантия.' },
    { q: 'Как я могу отследить свой заказ?', a: 'После отправки заказа мы пришлем вам трек-номер на указанный email. Вы сможете отследить посылку на сайте транспортной компании.' },
    { q: 'Можно ли вернуть товар?', a: 'Да, вы можете вернуть товар в течение 14 дней с момента покупки, если он не был в использовании и сохранен его товарный вид и упаковка. Пожалуйста, ознакомьтесь с полными условиями возврата в разделе "Условия использования".' },
    { q: 'Безопасно ли оплачивать картой на вашем сайте?', a: 'Абсолютно. Мы используем защищенный платежный шлюз, который соответствует международным стандартам безопасности PCI DSS. Ваши данные карты не хранятся у нас, а передаются в зашифрованном виде напрямую в банк.' },
];

const FaqPage = () => {
    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader
                title="Частые вопросы (FAQ)"
                subText="Здесь мы собрали ответы на самые популярные вопросы наших клиентов."
                breadcrumbs={[
                    { label: 'Главная', path: '/' },
                    { label: 'FAQ' }
                ]}
            />
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-3xl mx-auto bg-brand-bg-black p-6 rounded-lg shadow-xl">
                    {faqData.map((item, index) => (
                        <AccordionItem key={index} title={item.q}>
                            <p>{item.a}</p>
                        </AccordionItem>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FaqPage;