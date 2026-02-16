'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { Product } from '@/types';
import { getProductById, translations } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface UpsellGridProps {
    productIds: string[];
    onProductClick: (product: Product) => void;
}

export const UpsellGrid: React.FC<UpsellGridProps> = ({ productIds, onProductClick }) => {
    const { features, language, addToCart } = usePhase();
    const t = translations[language];

    if (!features.showUpsells || !productIds || productIds.length === 0) return null;

    const relatedProducts = productIds
        .map((id) => getProductById(id))
        .filter((p): p is Product => p !== undefined && p.is_available);

    if (relatedProducts.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 pt-4 border-t border-gray-700/50"
        >
            <h4 className="text-sm font-medium text-gray-400 mb-3">{t.relatedProducts}</h4>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {relatedProducts.map((product) => (
                    <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-shrink-0 w-32 bg-gray-800/50 rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => onProductClick(product)}
                    >
                        <div className="relative">
                            <img
                                src={product.image}
                                alt={product.name[language]}
                                className="w-full h-20 object-cover"
                            />
                            <motion.button
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                }}
                                className="absolute bottom-1 right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <Plus size={14} />
                            </motion.button>
                        </div>
                        <div className="p-2">
                            <p className="text-white text-xs font-medium truncate">{product.name[language]}</p>
                            <p className="text-orange-400 text-xs font-semibold">{formatPrice(product.price)}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
