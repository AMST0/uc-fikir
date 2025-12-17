'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { Product } from '@/types';
import { translations } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import { X, Plus, Minus, AlertCircle } from 'lucide-react';
import { UpsellGrid } from './UpsellGrid';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onProductChange: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onProductChange }) => {
    const { features, language, addToCart, cart, updateQuantity } = usePhase();
    const [quantity, setQuantity] = React.useState(1);
    const t = translations[language];

    React.useEffect(() => {
        if (product) {
            const inCart = cart.find((item) => item.product.id === product.id);
            setQuantity(inCart?.quantity || 1);
        }
    }, [product, cart]);

    if (!product) return null;

    const isOutOfStock = features.showStockStatus && !product.is_available;

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {product && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl z-[101] overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Image */}
                        <div className="relative aspect-video flex-shrink-0">
                            <img
                                src={product.image}
                                alt={product.name[language]}
                                className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                            />
                            {isOutOfStock && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <div className="bg-red-500/90 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2">
                                        <AlertCircle size={20} />
                                        <span className="font-semibold">{t.soldOut}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">{product.name[language]}</h2>
                            <p className="text-gray-400 mb-4">{product.description[language]}</p>

                            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 mb-6">
                                {formatPrice(product.price)}
                            </div>

                            {/* Quantity Selector & Add Button (Phase 3) */}
                            {features.showAddToCart && !isOutOfStock && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center bg-gray-700/50 rounded-xl">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-3 hover:bg-gray-600/50 rounded-l-xl transition-colors"
                                        >
                                            <Minus size={18} className="text-gray-300" />
                                        </button>
                                        <span className="w-12 text-center text-white font-semibold">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-3 hover:bg-gray-600/50 rounded-r-xl transition-colors"
                                        >
                                            <Plus size={18} className="text-gray-300" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} />
                                        {t.addToCart} - {formatPrice(product.price * quantity)}
                                    </button>
                                </motion.div>
                            )}

                            {/* Upsell Grid (Phase 3 Only) */}
                            {product.related_products && (
                                <UpsellGrid
                                    productIds={product.related_products}
                                    onProductClick={(p) => onProductChange(p)}
                                />
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
