// src/pages/admin/ProductSelectionModal.jsx
import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const ProductSelectionModal = ({ isOpen, onClose, allProducts, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredProducts = allProducts.filter(p => 
        (p.name?.join(' ') || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[101] p-4">
            <div className="bg-brand-bg-black w-full max-w-2xl h-[80vh] rounded-lg shadow-xl flex flex-col border border-brand-border-gray">
                <div className="p-4 border-b border-brand-border-gray flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-semibold text-white">Выберите товар</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><FaTimes /></button>
                </div>
                <div className="p-4 shrink-0">
                    <div className="relative">
                        <input type="text" placeholder="Поиск по названию или ID..."
                               value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                               className="w-full bg-brand-item-bg border border-brand-border-gray rounded-md py-2 pl-10 pr-4 text-white"/>
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow p-4">
                    <div className="space-y-2">
                        {filteredProducts.map(product => (
                            <div key={product._id} onClick={() => onSelect(product)}
                                 className="flex items-center p-2 rounded-md hover:bg-brand-blue/20 cursor-pointer transition-colors">
                                <img src={product.imageUrl} alt={product.name.join(' ')} className="w-12 h-12 object-contain rounded-md mr-4 bg-gray-800"/>
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-white">{product.name.join(' ')}</p>
                                    <p className="text-xs text-gray-400">{product.customId}</p>
                                </div>
                                <p className="text-sm font-semibold text-brand-blue">{product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSelectionModal;