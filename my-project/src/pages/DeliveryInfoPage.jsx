// src/pages/DeliveryInfoPage.jsx
import React from 'react';
import PageHeader from '../components/common/PageHeader';
import { FaTruck, FaBoxOpen, FaCreditCard, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

const InfoBlock = ({ icon, title, children }) => (
    <div className="bg-brand-bg-black p-6 rounded-lg shadow-lg flex items-start">
        <div className="text-brand-blue text-2xl mr-5 mt-1 shrink-0">{icon}</div>
        <div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <div className="text-sm text-brand-gray-light space-y-2">{children}</div>
        </div>
    </div>
);

const DeliveryInfoPage = () => {
    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader 
                title="Доставка и Оплата"
                subText="Вся информация о том, как мы доставляем ваши заказы и какие способы оплаты принимаем."
                breadcrumbs={[
                    { label: 'Главная', path: '/' },
                    { label: 'Доставка и Оплата' }
                ]}
            />

            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Секция доставки */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Способы Доставки</h2>
                        <InfoBlock icon={<FaTruck />} title="Курьерская доставка по городу">
                            <p>Доставка осуществляется в течение 1-2 рабочих дней после оформления заказа. Наш курьер свяжется с вами за час до прибытия.</p>
                            <p><strong>Стоимость:</strong> 500 ₽ (бесплатно при заказе от 5000 ₽).</p>
                        </InfoBlock>
                        <InfoBlock icon={<FaBoxOpen />} title="Доставка в пункты выдачи (СДЭК, Boxberry)">
                            <p>Получите заказ в удобном для вас пункте выдачи. Сроки доставки составляют от 2 до 7 дней в зависимости от региона.</p>
                            <p><strong>Стоимость:</strong> Рассчитывается индивидуально при оформлении заказа.</p>
                        </InfoBlock>
                    </div>

                    {/* Секция оплаты */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Способы Оплаты</h2>
                        <InfoBlock icon={<FaCreditCard />} title="Картой онлайн">
                            <p>Оплачивайте заказ банковской картой Visa, MasterCard или МИР через защищенный платежный шлюз. Безопасно и быстро.</p>
                        </InfoBlock>
                        <InfoBlock icon={<FaMoneyBillWave />} title="Оплата при получении">
                            <p>Вы можете оплатить заказ наличными или картой курьеру при получении (доступно только для курьерской доставки по городу).</p>
                        </InfoBlock>
                        <InfoBlock icon={<FaShieldAlt />} title="Безопасность платежей">
                            <p>Все онлайн-транзакции защищены современными протоколами шифрования. Ваши данные в полной безопасности.</p>
                        </InfoBlock>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryInfoPage;