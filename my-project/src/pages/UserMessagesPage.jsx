// src/pages/UserMessagesPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PageHeader from '../components/common/PageHeader';
import { FaSpinner, FaInbox, FaUser, FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// --- Вспомогательный компонент для отображения пустого состояния ---
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500">
        <FaInbox className="text-5xl mb-4" />
        <h3 className="text-lg font-semibold text-gray-300">Нет выбранных обращений</h3>
        <p className="text-sm mt-1">Выберите обращение из списка слева или создайте новое.</p>
    </div>
);

// --- Основной компонент страницы ---
const UserMessagesPage = () => {
    const { userInfo } = useAuth();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyMessages = async () => {
            if (userInfo) {
                setLoading(true);
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    const { data } = await axios.get('/api/messages/mymessages', config);
                    setMessages(data);
                    // Если есть сообщения, выбираем первое по умолчанию
                    if (data.length > 0) {
                        setSelectedMessage(data[0]);
                    }
                } catch (error) {
                    console.error("Ошибка загрузки ваших сообщений", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchMyMessages();
    }, [userInfo]);

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin text-brand-blue text-4xl" /></div>;
    }

    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader title="Мои обращения" breadcrumbs={[{label: 'Профиль', path: '/profile'}, {label: 'Обращения'}]} />
            <div className="container mx-auto px-4 py-8 md:py-12">
                {messages.length === 0 ? (
                    <div className="text-center py-20 bg-brand-bg-black rounded-xl">
                        <FaInbox className="text-6xl mx-auto text-gray-600 mb-4"/>
                        <h2 className="text-2xl font-semibold text-white">У вас пока нет обращений</h2>
                        <p className="text-brand-gray-light my-4">Если у вас есть вопрос, мы всегда готовы помочь.</p>
                        <Link to="/contact" className="bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md">
                            Создать обращение
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
                        {/* Левая колонка: Список диалогов */}
                        <aside className="w-full lg:w-1/3 xl:w-1/4 bg-brand-bg-black rounded-xl p-4 flex flex-col">
                            <h3 className="text-lg font-semibold p-2 mb-2">Диалоги</h3>
                            <ul className="space-y-1 overflow-y-auto custom-scrollbar flex-grow">
                                {messages.map(msg => (
                                    <li key={msg._id}>
                                        <button
                                            onClick={() => setSelectedMessage(msg)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${selectedMessage?._id === msg._id ? 'bg-brand-blue/20' : 'hover:bg-gray-800/50'}`}
                                        >
                                            <p className="font-semibold text-white truncate">{msg.subject}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                                                {msg.replies.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">Есть ответ</span>}
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* Правая колонка: Содержимое диалога */}
                        <main className="w-full lg:w-2/3 xl:w-3/4 bg-brand-bg-black rounded-xl p-4 md:p-6 flex flex-col">
                            {selectedMessage ? (
                                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                                    <h2 className="text-xl font-bold text-white mb-4 pb-4 border-b border-brand-border-gray">{selectedMessage.subject}</h2>
                                    <div className="space-y-6">
                                        {/* Сообщение пользователя */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shrink-0"><FaUser /></div>
                                            <div>
                                                <p className="font-semibold text-white">Вы <span className="text-xs text-gray-500 ml-2">{new Date(selectedMessage.createdAt).toLocaleString('ru-RU')}</span></p>
                                                <div className="mt-1 bg-brand-item-bg p-3 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</div>
                                            </div>
                                        </div>

                                        {/* Ответы администратора */}
                                        {selectedMessage.replies.map(reply => (
                                            <div key={reply._id} className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center shrink-0"><FaUserShield /></div>
                                                <div>
                                                    <p className="font-semibold text-white">{reply.userName} (Поддержка) <span className="text-xs text-gray-500 ml-2">{new Date(reply.createdAt).toLocaleString('ru-RU')}</span></p>
                                                    <div className="mt-1 bg-blue-900/30 p-3 rounded-lg text-sm text-gray-200 whitespace-pre-wrap">{reply.message}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </main>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMessagesPage;