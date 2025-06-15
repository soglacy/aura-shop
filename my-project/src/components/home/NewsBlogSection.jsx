// src/components/home/NewsBlogSection.jsx
import React from 'react';
import SectionTitle from '../common/SectionTitle';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewsBlogSection = ({ posts = [] }) => {
    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <section className="py-12 md:py-16 bg-brand-bg-black">
            <div className="container mx-auto px-4">
                <SectionTitle mainTitle="Наш Блог" centered={true} className="mb-10 md:mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {posts.slice(0, 3).map(post => (
                        <div key={post.slug || post.title} className="group bg-brand-bg-dark rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                            <Link to={`/blog/${post.slug}`} className="block overflow-hidden aspect-[16/9]">
                                <img src={post.imageUrl || '/images/placeholder.png'} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            </Link>
                            <div className="p-5 md:p-6 flex flex-col flex-grow">
                                <div className="mb-3 flex justify-between items-center text-xs text-brand-gray-light">
                                    <span>{post.date || 'Недавно'}</span>
                                    {post.category && (
                                        <span className="bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-full font-medium">{post.category}</span>
                                    )}
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold text-white mb-3 leading-tight flex-grow">
                                    <Link to={`/blog/${post.slug}`} className="hover:text-brand-blue transition-colors duration-300">{post.title}</Link>
                                </h3>
                                <p className="text-sm text-brand-gray-light mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>
                                <Link to={`/blog/${post.slug}`} className="mt-auto inline-flex items-center text-sm text-brand-blue hover:text-blue-400 font-semibold group-hover:translate-x-1 transition-all duration-300 self-start">
                                    Читать далее <FiArrowRight className="ml-1.5 w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsBlogSection;