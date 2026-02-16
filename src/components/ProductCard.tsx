'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { Product } from '@/types';
import { translations } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import { Plus, AlertCircle } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
    index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, index }) => {
    const { features, language, addToCart } = usePhase();
    const t = translations[language];

    const isOutOfStock = features.showStockStatus && !product.is_available;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={onClick}
            className={`relative bg-gray-900/80 rounded-2xl overflow-hidden cursor-pointer border border-gray-800/50 hover:border-gray-700 transition-all active:scale-[0.98] ${isOutOfStock ? 'opacity-60' : ''
                }`}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name[language]}
                    className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${isOutOfStock ? 'grayscale' : ''
                        }`}
                    loading="lazy"
                />

                {/* Sold Out Overlay */}
                {isOutOfStock && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/70 flex items-center justify-center"
                    >
                        <div className="bg-red-500 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                            <AlertCircle size={16} />
                            <span className="text-sm font-bold">{t.soldOut}</span>
                        </div>
                    </motion.div>
                )}

                {/* Quick Add Button - Small circle like canlimenu */}
                {features.showAddToCart && !isOutOfStock && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className="absolute bottom-2 right-2 w-9 h-9 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/40 transition-colors"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                    </motion.button>
                )}
            </div>

            {/* Content - Compact like canlimenu */}
            <div className="p-3">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                    {product.name[language]}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-2 min-h-[2rem]">
                    {product.description[language]}
                </p>

                {/* Price - Prominent */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-400">
                        {formatPrice(product.price)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
