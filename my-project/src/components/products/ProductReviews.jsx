// src/components/products/ProductReviews.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaStar, FaUserCircle, FaSpinner } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange }) => {
    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={ratingValue} className="cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => onRatingChange(ratingValue)}
                            className="sr-only"
                        />
                        <FaStar
                            className="transition-colors duration-200"
                            color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                            size={20}
                        />
                    </label>
                );
            })}
        </div>
    );
};

const ProductReviews = ({ product, onReviewAdded }) => {
    const { userInfo } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        if (comment.trim() === '' || rating === 0) {
            setError('Пожалуйста, поставьте оценку и напишите комментарий.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            await axios.post(`/api/products/${product.customId}/reviews`, { rating, comment }, config);
            setLoading(false);
            setRating(0);
            setComment('');
            onReviewAdded(); // Сообщаем родительскому компоненту обновить данные
        } catch (err) {
            const message = err.response?.data?.message || 'Ошибка отправки отзыва';
            setError(message);
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 pt-8 border-t border-brand-border-gray/30">
            <h3 className="text-xl font-semibold text-white mb-6">Отзывы ({product.numReviews || 0})</h3>
            
            {/* Список отзывов */}
            <div className="space-y-6 mb-8">
                {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                        <div key={review._id} className="flex items-start space-x-4">
                            <FaUserCircle size={32} className="text-gray-500 mt-1"/>
                            <div>
                                <div className="flex items-center mb-1">
                                    <strong className="text-sm text-white mr-3">{review.name}</strong>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => <FaStar key={i} color={i < review.rating ? "#ffc107" : "#4A5568"} size={14}/>)}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{new Date(review.createdAt).toLocaleDateString('ru-RU')}</p>
                                <p className="text-sm text-gray-300">{review.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Отзывов пока нет. Будьте первым!</p>
                )}
            </div>

            {/* Форма для нового отзыва */}
            {userInfo ? (
                <div className="bg-brand-bg-black p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-4">Оставить свой отзыв</h4>
                    {error && <div className="p-3 bg-red-900/50 text-red-300 text-sm rounded-md mb-4">{error}</div>}
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Ваша оценка</label>
                            <StarRating rating={rating} onRatingChange={setRating} />
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-2">Комментарий</label>
                            <textarea id="comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)}
                                      className="w-full bg-brand-item-bg border border-brand-border-gray rounded-md p-3 text-white text-sm focus:ring-brand-blue focus:border-brand-blue"
                            ></textarea>
                        </div>
                        <button type="submit" disabled={loading}
                                className="inline-flex items-center px-6 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50">
                            {loading && <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                            Отправить
                        </button>
                    </form>
                </div>
            ) : (
                <p className="text-sm text-center bg-brand-bg-black p-4 rounded-lg">
                    Пожалуйста, <a href="/login" className="text-brand-blue font-bold hover:underline">войдите</a>, чтобы оставить отзыв.
                </p>
            )}
        </div>
    );
};

export default ProductReviews;