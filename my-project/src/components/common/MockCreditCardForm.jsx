// src/components/common/MockCreditCardForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaCcVisa, FaCcMastercard, FaRedo } from 'react-icons/fa';

const MockCreditCardForm = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
    });
    
    // Рефы для фокуса на полях
    const expiryRef = useRef(null);
    const cvcRef = useRef(null);

    // --- Автоматический переворот карты ---
    useEffect(() => {
        // Если срок действия полностью введен (5 символов, напр. "12/26")
        if (cardData.expiry.length === 5) {
            setIsFlipped(true); // Переворачиваем карту
            cvcRef.current.focus(); // и ставим фокус на поле CVC
        }
    }, [cardData.expiry]);

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === 'number') {
            value = value.replace(/[^\d]/g, '').slice(0, 16);
            if (value.length === 16) {
                // Авто-переход на следующее поле
                // (Это можно сделать, но потребует больше рефов, пока оставим так для простоты)
            }
        } else if (name === 'expiry') {
            value = value.replace(/[^\d]/g, '').slice(0, 4);
            if (cardData.expiry.length === 1 && value.length === 2) {
                value += '/'; // Добавляем слэш после ввода месяца
            }
        } else if (name === 'cvc') {
            value = value.replace(/[^\d]/g, '').slice(0, 3);
        } else if (name === 'name') {
            value = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
        }
        
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const formatCardNumber = (num) => { /* ... (без изменений) ... */ };
    
    return (
        <div className="bg-gray-800/50 p-4 rounded-lg mt-4 border border-brand-border-gray/50 max-w-sm mx-auto">
            <div style={{ perspective: '1000px' }}>
                <div
                    className="relative w-full aspect-[16/10] transition-transform duration-700"
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                    {/* === Лицевая сторона === */}
                    <div className="absolute w-full h-full bg-gradient-to-tl from-brand-blue/30 via-brand-bg-black to-brand-bg-black rounded-xl shadow-2xl p-4 flex flex-col justify-between border border-white/10 z-10" style={{ backfaceVisibility: 'hidden' }}>
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-bold text-white/80">AURA Bank</span>
                            <div className="flex space-x-2">
                                <FaCcVisa className="text-white text-3xl" />
                                <FaCcMastercard className="text-white text-3xl" />
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400">Номер карты</label>
                                <input type="text" name="number" value={formatCardNumber(cardData.number)} onChange={handleInputChange} maxLength="19" placeholder="•••• •••• •••• ••••"
                                       className="w-full bg-transparent text-white text-lg tracking-widest font-mono border-b-2 border-white/20 focus:border-white transition-colors focus:outline-none p-1 text-center" />
                            </div>

                            <div className="flex justify-between gap-4">
                                <div className="w-2/3">
                                    <label className="text-xs text-gray-400">Владелец карты</label>
                                    {/* ИСПРАВЛЕНИЕ 1: Теперь это полноценный input */}
                                    <input type="text" name="name" value={cardData.name} onChange={handleInputChange} placeholder="AURA USER"
                                           className="w-full bg-transparent text-white font-medium tracking-wider border-b-2 border-white/20 focus:border-white transition-colors focus:outline-none p-1" />
                                </div>
                                <div className="w-1/3">
                                    <label className="text-xs text-gray-400">Срок</label>
                                    <input type="text" name="expiry" value={cardData.expiry} ref={expiryRef} onChange={handleInputChange} maxLength="5" placeholder="MM/YY"
                                           className="w-full bg-transparent text-white font-medium text-center border-b-2 border-white/20 focus:border-white transition-colors focus:outline-none p-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* === Обратная сторона === */}
                    <div className="absolute w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-2 flex flex-col items-center border border-white/10" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <div className="w-full h-12 bg-black mt-5"></div>
                        <div className="w-full px-4 mt-4">
                            <label className="text-xs text-gray-400 text-right block">CVC/CVV</label>
                            {/* ИСПРАВЛЕНИЕ 2: Поле CVC теперь видимое */}
                            <div className="w-full h-10 bg-white mt-1 p-2 text-right italic font-mono relative flex items-center justify-end">
                                <input 
                                    type="password" name="cvc" ref={cvcRef} value={cardData.cvc} maxLength="3"
                                    onChange={handleInputChange}
                                    onFocus={() => setIsFlipped(true)}
                                    // onBlur убран, чтобы карта не переворачивалась обратно сразу
                                    className="w-full h-full bg-transparent border-none text-black text-lg focus:outline-none text-right" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ИСПРАВЛЕНИЕ 3: Кнопка для ручного переворота */}
            <div className="flex justify-end mt-2">
                <button type="button" onClick={() => setIsFlipped(!isFlipped)} className="text-gray-400 hover:text-white transition-colors p-1 flex items-center text-xs">
                    <FaRedo className={`mr-1 transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
                    <span>{isFlipped ? 'На лицевую' : 'На обратную'}</span>
                </button>
            </div>
        </div>
    );
};

export default MockCreditCardForm;