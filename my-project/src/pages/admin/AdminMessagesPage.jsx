// src/pages/admin/AdminMessagesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaSpinner, FaEnvelopeOpen, FaTrash, FaReply, FaPaperPlane } from 'react-icons/fa';
import eventBus from '../../utils/eventBus';

// Вспомогательный компонент для одной карточки сообщения
const MessageCard = ({ msg, onUpdate }) => {
    const { userInfo } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const handleMarkAsRead = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`/api/messages/${msg._id}/read`, {}, config);
            onUpdate();
        } catch (err) {
            alert('Ошибка: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`/api/messages/${msg._id}`, config);
                onUpdate();
            } catch (err) {
                alert('Ошибка удаления: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setIsReplying(true);
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            const body = { message: replyText }; 
            await axios.post(`/api/messages/${msg._id}/reply`, body, config);
            
            eventBus.dispatch('notificationsUpdated');

            setReplyText('');
            setShowReplyForm(false);
            onUpdate();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Произошла неизвестная ошибка';
            alert(`Ошибка отправки ответа: ${errorMessage}`);
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <div className={`bg-brand-bg-black p-4 rounded-lg shadow-lg border-l-4 ${msg.isRead ? 'border-gray-700' : 'border-brand-blue'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString('ru-RU')}</p>
                    <h3 className="font-semibold text-white">{msg.subject}</h3>
                    <p className="text-sm text-brand-blue">{`${msg.name} <${msg.email}>`}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setShowReplyForm(!showReplyForm)} title="Ответить" className="text-blue-400 hover:text-blue-300 p-2 bg-blue-600/10 hover:bg-blue-600/30 rounded-full"><FaReply /></button>
                    {!msg.isRead && (<button onClick={handleMarkAsRead} title="Отметить как прочитанное" className="text-green-400 hover:text-green-300 p-2 bg-green-600/10 hover:bg-green-600/30 rounded-full"><FaEnvelopeOpen /></button>)}
                    <button onClick={handleDelete} title="Удалить" className="text-red-400 hover:text-red-300 p-2 bg-red-600/10 hover:bg-red-600/30 rounded-full"><FaTrash /></button>
                </div>
            </div>
            <p className="mt-3 pt-3 border-t border-brand-border-gray/30 text-sm text-gray-300 whitespace-pre-wrap">{msg.message}</p>
            
            {msg.replies && msg.replies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-brand-border-gray/30 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-gray-500">История ответов</h4>
                    {msg.replies.map(reply => (
                        <div key={reply._id} className="bg-gray-800/50 p-3 rounded-md ml-4 border-l-2 border-gray-700">
                            <p className="text-xs text-gray-400">Ответ от <span className="font-semibold text-white">{reply.userName}</span> ({new Date(reply.createdAt).toLocaleString('ru-RU')})</p>
                            <p className="text-sm text-gray-200 mt-1 whitespace-pre-wrap">{reply.message}</p>
                        </div>
                    ))}
                </div>
            )}

            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="mt-4 pt-4 border-t border-dashed border-brand-border-gray/50">
                    <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full bg-brand-item-bg rounded-md p-2 text-white focus:ring-brand-blue focus:border-brand-blue" rows="3" placeholder="Ваш ответ..."></textarea>
                    <button type="submit" disabled={isReplying} className="mt-2 px-4 py-1.5 bg-brand-blue hover:bg-blue-700 text-white rounded-md text-sm flex items-center gap-2 disabled:opacity-50">
                        {isReplying ? <FaSpinner className="animate-spin"/> : <FaPaperPlane/>}
                        Отправить ответ
                    </button>
                </form>
            )}
        </div>
    );
};

// Основной компонент страницы
const AdminMessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo } = useAuth();

    const fetchMessages = useCallback(async () => {
        if (!userInfo) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/messages', config);
            setMessages(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка загрузки сообщений');
        } finally {
            setLoading(false);
        }
    }, [userInfo]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);
    
    const handleUpdate = () => {
        fetchMessages();
        eventBus.dispatch('notificationsUpdated'); 
    };

    if (loading) return <div className="text-center p-8"><FaSpinner className="animate-spin text-brand-blue text-4xl mx-auto" /></div>;
    if (error) return <div className="bg-red-900/50 p-4 rounded-lg">{error}</div>;

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div>
            <h1 className="text-2xl font-semibold text-white mb-6">Входящие сообщения ({unreadCount > 0 ? `${unreadCount} новых` : 'нет новых'})</h1>
            <div className="space-y-4">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Нет входящих сообщений.</p>
                ) : (
                    messages.map(msg => (
                        <MessageCard key={msg._id} msg={msg} onUpdate={handleUpdate} />
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminMessagesPage;