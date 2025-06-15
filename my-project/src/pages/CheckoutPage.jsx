// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';
import MockCreditCardForm from '../components/common/MockCreditCardForm'; // Убедитесь, что этот компонент существует
import axios from 'axios';
import { FaSpinner, FaTruck, FaStore, FaUser } from 'react-icons/fa';

// --- Демонстрационные данные для магазинов ---
const MOCK_STORES = [
  { id: 1, name: 'Aura на Светланской', address: 'г. Владивосток, ул. Светланская, д. 29', workingHours: '10:00 - 22:00' },
  { id: 2, name: 'Aura в ТЦ "Черемушки"', address: 'г. Владивосток, ул. Черемуховая, д. 15', workingHours: '10:00 - 21:00' },
  { id: 3, name: 'Aura на Русской', address: 'г. Владивосток, ул. Русская, д. 16', workingHours: '09:00 - 21:00' },
];

// --- Вспомогательные компоненты для чистоты кода ---
const Section = ({ number, title, children }) => (
  <div className="bg-brand-bg-black p-6 md:p-8 rounded-xl shadow-xl">
    <h2 className="text-xl font-semibold text-white mb-4 border-b border-brand-border-gray pb-3 flex items-center">
      <span className="w-7 h-7 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 shrink-0">{number}</span>
      {title}
    </h2>
    <div className="mt-4">{children}</div>
  </div>
);

const ToggleButton = ({ children, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-5 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
      isActive ? 'bg-brand-blue/20 border-brand-blue text-white' : 'bg-brand-item-bg border-brand-border-gray text-brand-gray-light hover:border-gray-600'
    }`}
  >
    {children}
  </button>
);


// --- Основной компонент ---
const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart, shippingPrice, cartItemCount } = useCart();
    const { userInfo, loadingAuth } = useAuth();

    // Состояния
    const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' или 'pickup'
    const [paymentMethod, setPaymentMethod] = useState('Картой онлайн');
    const [selectedStore, setSelectedStore] = useState(MOCK_STORES[0]);
    const [addressInfo, setAddressInfo] = useState(() => {
        try {
            const savedAddress = localStorage.getItem('auraShippingAddress');
            return savedAddress ? JSON.parse(savedAddress) : { address: '', city: 'Владивосток', postalCode: '', country: 'Россия' };
        } catch (e) {
            return { address: '', city: 'Владивосток', postalCode: '', country: 'Россия' };
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Эффект для сохранения адреса в localStorage
    useEffect(() => {
        localStorage.setItem('auraShippingAddress', JSON.stringify(addressInfo));
    }, [addressInfo]);

    // Эффект для проверки доступа к странице
    useEffect(() => {
        if (loadingAuth) return;
        if (!userInfo) {
            navigate('/login?redirect=/checkout', { replace: true });
        } else if (cartItems.length === 0 && window.location.pathname !== '/order-success') {
            navigate('/cart', { replace: true });
        }
    }, [userInfo, loadingAuth, cartItems, navigate]);

    // --- Расчеты ---
    const finalShippingPrice = deliveryMethod === 'delivery' ? shippingPrice : 0;
    const totalPrice = cartTotal + finalShippingPrice;

    // --- Обработчики ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddressInfo(prev => ({ ...prev, [name]: value }));
    };

    const placeOrderHandler = async () => {
        if (deliveryMethod === 'delivery' && (!addressInfo.address || !addressInfo.city || !addressInfo.postalCode)) {
            setError('Пожалуйста, заполните все поля адреса доставки.');
            window.scrollTo(0, 0);
            return;
        }
        setError('');
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const orderItemsPayload = cartItems.map(item => ({
                name: typeof item.name === 'string' ? [item.name] : (item.name || ['Неизвестный товар']),
                quantity: item.quantity,
                imageUrl: item.imageUrl,
                price: item.priceValue,
                product: item._id,
                customId: item.customId,
            }));
            const payload = {
                orderItems: orderItemsPayload,
                paymentMethod,
                itemsPrice: cartTotal,
                shippingPrice: finalShippingPrice,
                totalPrice: totalPrice,
                shippingAddress: deliveryMethod === 'delivery' ? addressInfo : {
                    address: selectedStore.address,
                    city: 'Владивосток',
                    postalCode: '',
                    country: 'Россия',
                },
            };
            const { data: createdOrder } = await axios.post('/api/orders', payload, config);
            
            clearCart();
            localStorage.removeItem('auraShippingAddress');
            
            navigate(`/order-success`, {
                state: { orderId: createdOrder._id, totalPrice: createdOrder.totalPrice, customerName: userInfo.name },
                replace: true,
            });

        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Ошибка при создании заказа';
            setError(message);
            window.scrollTo(0, 0);
            setLoading(false);
        }
    };

    // --- Рендеринг ---
    if (loadingAuth || (!userInfo && !loadingAuth)) {
        return <div className="min-h-screen bg-brand-bg-dark flex items-center justify-center"><FaSpinner className="animate-spin text-brand-blue text-4xl" /></div>;
    }
    if (cartItems.length === 0) {
        return (
            <div className="bg-brand-bg-dark text-white min-h-screen">
                <PageHeader title="Оформление Заказа" breadcrumbs={[{label: "Корзина", path: "/cart"}, {label: "Оформление"}]}/>
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
                    <p className="text-xl text-white mb-6">Ваша корзина пуста. Нечего оформлять.</p>
                    <Link to="/cart" className="text-brand-blue hover:underline font-semibold">Вернуться в корзину</Link>
                </div>
            </div>
        ); 
    }

    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader title="Оформление Заказа" breadcrumbs={[{label: "Корзина", path: "/cart"}, {label: "Оформление"}]} />
            <div className="container mx-auto px-4 py-8 md:py-12">
                {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-sm mb-6 shadow-lg">{error}</div>}
                
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Левая колонка */}
                    <div className="w-full lg:flex-1 space-y-8">
                        <Section number="1" title="Данные покупателя">
                            <div className="flex items-center bg-gray-800/50 p-4 rounded-lg">
                                <FaUser className="text-brand-blue text-xl mr-4"/>
                                <div>
                                    <p className="font-semibold text-white">{userInfo.name}</p>
                                    <p className="text-sm text-gray-400">{userInfo.email}</p>
                                </div>
                            </div>
                        </Section>

                        <Section number="2" title="Способ получения">
                            <div className="flex gap-4 mb-6">
                                <ToggleButton isActive={deliveryMethod === 'delivery'} onClick={() => setDeliveryMethod('delivery')}>
                                    <div className="flex items-center gap-2"><FaTruck /> Доставка</div>
                                </ToggleButton>
                                <ToggleButton isActive={deliveryMethod === 'pickup'} onClick={() => setDeliveryMethod('pickup')}>
                                    <div className="flex items-center gap-2"><FaStore /> Самовывоз</div>
                                </ToggleButton>
                            </div>
                            {deliveryMethod === 'delivery' && (
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-brand-gray-light mb-1">Город</label>
                                            <input type="text" name="city" id="city" value={addressInfo.city} onChange={handleInputChange} required className="w-full bg-brand-item-bg p-2.5 rounded-md border-2 border-transparent focus:outline-none focus:border-brand-blue"/>
                                        </div>
                                        <div>
                                            <label htmlFor="postalCode" className="block text-sm font-medium text-brand-gray-light mb-1">Почтовый индекс</label>
                                            <input type="text" name="postalCode" id="postalCode" value={addressInfo.postalCode} onChange={handleInputChange} required className="w-full bg-brand-item-bg p-2.5 rounded-md border-2 border-transparent focus:outline-none focus:border-brand-blue"/>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-brand-gray-light mb-1">Улица, дом, квартира</label>
                                        <input type="text" name="address" id="address" value={addressInfo.address} onChange={handleInputChange} required className="w-full bg-brand-item-bg p-2.5 rounded-md border-2 border-transparent focus:outline-none focus:border-brand-blue"/>
                                    </div>
                                </form>
                            )}
                            {deliveryMethod === 'pickup' && (
                                <div className="space-y-4">
                                    {MOCK_STORES.map(store => (
                                        <label key={store.id} className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedStore.id === store.id ? 'bg-brand-blue/10 border-brand-blue' : 'bg-brand-item-bg border-brand-border-gray hover:border-gray-600'}`}>
                                            <input type="radio" name="store" checked={selectedStore.id === store.id} onChange={() => setSelectedStore(store)} className="form-radio h-4 w-4 text-brand-blue bg-gray-700 border-gray-600 focus:ring-2 focus:ring-brand-blue focus:ring-offset-brand-bg-black shrink-0 mt-1"/>
                                            <div className="ml-4">
                                                <p className="font-semibold text-white">{store.name}</p>
                                                <p className="text-sm text-gray-400">{store.address}</p>
                                                <p className="text-xs text-gray-500 mt-1">{store.workingHours}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </Section>
                    </div>

                    {/* Правая колонка */}
                    <div className="w-full lg:w-2/5 xl:w-1/3">
                        <div className="sticky top-24 space-y-8">
                            <Section number="3" title="Способ оплаты">
                                <div className="flex gap-4">
                                    <ToggleButton isActive={paymentMethod === 'Картой онлайн'} onClick={() => setPaymentMethod('Картой онлайн')}>Онлайн</ToggleButton>
                                    <ToggleButton isActive={paymentMethod === 'При получении'} onClick={() => setPaymentMethod('При получении')}>При получении</ToggleButton>
                                </div>
                                {paymentMethod === 'Картой онлайн' && <MockCreditCardForm />}
                            </Section>

                            <div className="bg-brand-bg-black p-6 rounded-xl shadow-xl">
                                <h2 className="text-xl font-semibold text-white mb-4">Сумма заказа</h2>
                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between text-brand-gray-light"><span>Товары ({cartItemCount})</span><span>{cartTotal.toLocaleString('ru-RU')} ₽</span></div>
                                    <div className="flex justify-between text-brand-gray-light"><span>Доставка</span><span>{finalShippingPrice > 0 ? `${finalShippingPrice.toLocaleString('ru-RU')} ₽` : 'Бесплатно'}</span></div>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-brand-border-gray">
                                    <span>Итого</span>
                                    <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <button onClick={placeOrderHandler} disabled={loading} className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-60 flex items-center justify-center">
                                    {loading ? <FaSpinner className="animate-spin" /> : 'Подтвердить заказ'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;