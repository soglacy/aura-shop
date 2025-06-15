// src/pages/BlogPostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../components/common/PageHeader';
import { FaSpinner, FaCalendar, FaUser, FaTag } from 'react-icons/fa';

const BlogPostPage = () => {
    const { postSlug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await axios.get('/api/content/homepage');
                const foundPost = data.blogPosts.find(p => p.slug === postSlug);
                if (foundPost) {
                    setPost(foundPost);
                } else {
                    setError('Новость не найдена.');
                }
            } catch (err) {
                setError('Ошибка загрузки новости.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center"><FaSpinner className="animate-spin text-brand-blue text-4xl" /></div>;
    }

    if (error) {
        return (
            <div className="min-h-screen text-center pt-20">
                <h1 className="text-2xl text-red-500">{error}</h1>
                <Link to="/" className="text-brand-blue hover:underline mt-4 inline-block">Вернуться на главную</Link>
            </div>
        );
    }
    
    if (!post) return null;

    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader 
                title={post.title}
                breadcrumbs={[
                    { label: 'Главная', path: '/' },
                    { label: 'Блог', path: '/#blog' }, // Можно сделать ссылку на секцию блога
                    { label: post.title.substring(0, 30) + '...' }
                ]}
            />
            <article className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Главное изображение статьи */}
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg mb-8" />

                    {/* Мета-информация */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-gray-light mb-6">
                        <div className="flex items-center"><FaUser className="mr-2 text-brand-blue" /> Aura Team</div>
                        <div className="flex items-center"><FaCalendar className="mr-2 text-brand-blue" /> {post.date}</div>
                        <div className="flex items-center"><FaTag className="mr-2 text-brand-blue" /> {post.category}</div>
                    </div>

                    {/* Заголовок (уже есть в PageHeader, здесь можно не дублировать или сделать h2) */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">{post.title}</h1>

                    {/* Содержимое статьи */}
                    <div 
                        className="prose prose-lg prose-invert max-w-none text-gray-300 prose-headings:text-white prose-a:text-brand-blue hover:prose-a:text-blue-400 prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: post.fullText.replace(/\n/g, '<br />') }}
                    >
                        {/* fullText будет отрендерен здесь */}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPostPage;