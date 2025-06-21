// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import PageHeader from '../components/common/PageHeader';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ContactPage = () => {
    const { userInfo } = useAuth();
    const [formData, setFormData] = useState({ subject: 'Вопрос по товару', message: '' });
    const [status, setStatus] = useState({ loading: false, error: '', success: '' });

    const subjectOptions = ["Вопрос по товару", "Доставка и оплата", "Технические проблемы", "Сотрудничество", "Другое"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            // Данные для отправки. Имя и email берутся из userInfo на сервере.
            const payload = { subject: formData.subject, message: formData.message };
            const { data } = await axios.post('/api/messages', payload, config);
            setStatus({ loading: false, error: '', success: data.message || 'Сообщение успешно отправлено!' });
            setFormData(prev => ({ ...prev, subject: 'Вопрос по товару', message: '' }));
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Произошла ошибка.';
            setStatus({ loading: false, error: errorMessage, success: '' });
        }
    };

    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader
                title="Служба поддержки"
                breadcrumbs={[
                    { label: 'Главная', path: '/' },
                    { label: 'Контакты' }
                ]}
                className="py-6 md:py-8"
            />
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="bg-brand-bg-black max-w-3xl mx-auto p-6 md:p-10 rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white">Остались вопросы?</h2>
                        <p className="text-brand-gray-light mt-2">Заполните форму, и мы свяжемся с вами в ближайшее время. Вы сможете увидеть ответ на странице <Link to="/profile/messages" className="text-brand-blue hover:underline">"Мои обращения"</Link>.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-brand-gray-light mb-2">Тема обращения</label>
                            <select name="subject" id="subject" value={formData.subject} onChange={handleChange} className="w-full bg-brand-item-bg p-3 rounded-md border-2 border-brand-border-gray/50 focus:border-brand-blue focus:outline-none transition-colors">
                                {subjectOptions.map(option => ( <option key={option} value={option}>{option}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-brand-gray-light mb-2">Ваше сообщение</label>
                            <textarea name="message" id="message" rows="6" value={formData.message} onChange={handleChange} required className="w-full bg-brand-item-bg p-3 rounded-md border-2 border-brand-border-gray/50 focus:border-brand-blue focus:outline-none transition-colors"></textarea>
                        </div>

                        {status.error && <p className="text-red-400 text-sm text-center bg-red-900/30 p-3 rounded-md">{status.error}</p>}
                        {status.success && <p className="text-green-400 text-sm text-center bg-green-900/30 p-3 rounded-md">{status.success}</p>}

                        <div>
                            <button type="submit" disabled={status.loading} className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-black focus:ring-brand-blue transition-all duration-300 disabled:opacity-50">
                                {status.loading ? <FaSpinner className="animate-spin" /> : <><FaPaperPlane className="mr-2" /> Отправить</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
