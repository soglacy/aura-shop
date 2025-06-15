// src/pages/AboutUsPage.jsx
import React from 'react';
import PageHeader from '../components/common/PageHeader';
import { FaBullseye, FaUsers, FaHeart } from 'react-icons/fa';

const ValueCard = ({ icon, title, text }) => (
    <div className="text-center p-6 bg-brand-bg-black rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div className="text-brand-blue text-4xl mb-4 inline-block">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-brand-gray-light text-sm">{text}</p>
    </div>
);

const AboutUsPage = () => {
    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader
                title="О Нас"
                breadcrumbs={[
                    { label: 'Главная', path: '/' },
                    { label: 'О Нас' }
                ]}
                className="py-6 md:py-8"
            />

            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Секция "Наша Миссия" */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Ваш личный гид в мире гаджетов.</h2>
                        <p className="text-lg text-brand-gray-light leading-relaxed">
                            В Aura Shop мы верим, что правильный гаджет — это продолжение вашего стиля и идей. Мы здесь, чтобы помочь вам найти именно его.

Забудьте о сложных характеристиках и мучительном выборе. Мы уже отобрали для вас лучшее — устройства, которые не просто работают, а по-настоящему вдохновляют. Добро пожаловать в сообщество, где технологии становятся частью вашей жизни.
                        </p>
                    </div>

                    {/* Секция "Наши Ценности" */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <ValueCard 
                            icon={<FaBullseye />}
                            title="Качество и Гарантия"
                            text="Мы работаем только с проверенными поставщиками и предлагаем исключительно оригинальную продукцию с официальной гарантией."
                        />
                        <ValueCard 
                            icon={<FaUsers />}
                            title="Экспертный подход"
                            text="Наша команда — энтузиасты технологий. Мы знаем наши товары и всегда готовы помочь вам сделать правильный выбор."
                        />
                        <ValueCard 
                            icon={<FaHeart />}
                            title="Забота о клиентах"
                            text="Ваше доверие — наша главная ценность. Мы стремимся обеспечить лучший сервис на каждом этапе: от выбора до послепродажной поддержки."
                        />
                    </div>

                     {/* Секция "Наша История" */}
                     <div className="bg-brand-bg-black p-8 rounded-xl shadow-xl flex flex-col md:flex-row items-center gap-8">
                        
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Наша История</h2>
                            <p className="text-brand-gray-light leading-relaxed">
                                Aura Shop был основан в 2025 году студентом Владивостокского колледжа. 
                                Мы хотели создать не просто магазин, а место, где каждый может найти идеальный гаджет, 
                                который станет частью его жизни. Начиная с небольшого онлайн-проекта, мы выросли 
                                в надежного проводника в мире технологий, которому доверяют тысячи клиентов по всей стране.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;