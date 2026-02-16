'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { usePhase } from '@/context/PhaseContext';
import { translations } from '@/lib/mockData';
import { Product, Category } from '@/types';
import { ArrowLeft, MapPin, Globe, RefreshCw, Plus, Minus, ShoppingCart, Share2, Clock, Flame } from 'lucide-react';

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const { language, setLanguage, tableNumber, features, addToCart, cart, showToast } = usePhase();
    const [product, setProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isMonthlyFavorite, setIsMonthlyFavorite] = useState(false);
    const t = translations[language];

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch('/api/menu');
                const data = await res.json();
                if (data.success) {
                    for (const cat of data.data) {
                        const found = cat.products.find((p: Product) => p.id === productId);
                        if (found) {
                            setProduct(found);
                            setCategory(cat);
                            // Check if first product in category = monthly favorite
                            setIsMonthlyFavorite(cat.products[0]?.id === found.id);

                            // Record product view
                            fetch('/api/views', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    productId: found.id,
                                    categoryId: cat.id,
                                    type: 'product'
                                })
                            });
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (product && features.showAddToCart) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            showToast(`${product.name[language]} sepete eklendi! 🛒`);
        }
    };

    const handleShare = () => {
        if (navigator.share && product) {
            navigator.share({
                title: product.name[language],
                text: product.description[language],
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast('Link kopyalandı! 📋');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Yükleniyor...</p>
                </motion.div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <p className="text-gray-400 mb-4">Ürün bulunamadı</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-medium shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                    >
                        Ana Sayfaya Dön
                    </button>
                </motion.div>
            </div>
        );
    }

    const cartQuantity = cart.find(item => item.product.id === product.id)?.quantity || 0;

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Floating Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
            >
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-lg"
                    >
                        <ArrowLeft size={20} />
                    </motion.button>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleShare}
                            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-lg"
                        >
                            <Share2 size={18} />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                            className="h-10 px-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-lg gap-1.5 text-sm font-medium"
                        >
                            <Globe size={14} />
                            {language.toUpperCase()}
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Hero Image */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-[50vh] overflow-hidden"
            >
                <img
                    src={product.image}
                    alt={product.name[language]}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                {/* Monthly Favorite Badge */}
                {isMonthlyFavorite && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-6 right-6 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center gap-2 shadow-lg"
                    >
                        <Flame size={16} className="text-white" />
                        <span className="text-white font-semibold text-sm">Ayın Favorisi</span>
                    </motion.div>
                )}
            </motion.div>

            {/* Content Card */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative -mt-8 mx-4 bg-gray-800/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Category Badge */}
                {category && (
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute top-4 left-4"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full border border-orange-500/30">
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-orange-400 font-medium text-sm">{category.name[language]}</span>
                        </div>
                    </motion.div>
                )}

                <div className="p-6 pt-16">
                    {/* Product Name */}
                    <motion.h1
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-white mb-3"
                    >
                        {product.name[language]}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-gray-400 leading-relaxed mb-6"
                    >
                        {product.description[language]}
                    </motion.p>

                    {/* Info Pills */}
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap gap-2 mb-6"
                    >
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded-full text-sm">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-gray-300">15-20 dk</span>
                        </div>
                        {tableNumber && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded-full text-sm">
                                <MapPin size={14} className="text-gray-400" />
                                <span className="text-gray-300">Masa {tableNumber}</span>
                            </div>
                        )}
                        {cartQuantity > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-full text-sm border border-orange-500/30">
                                <ShoppingCart size={14} className="text-orange-400" />
                                <span className="text-orange-400">Sepette: {cartQuantity}</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Price & Quantity */}
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="flex items-center justify-between mb-6"
                    >
                        <div>
                            <span className="text-gray-500 text-sm">Fiyat</span>
                            <p className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                                ₺{product.price.toFixed(2)}
                            </p>
                        </div>

                        {features.showAddToCart && product.is_available && (
                            <div className="flex items-center gap-1 bg-gray-700/50 rounded-2xl p-1">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-xl bg-gray-600 flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                                >
                                    <Minus size={18} />
                                </motion.button>
                                <span className="text-white font-bold text-xl w-12 text-center">{quantity}</span>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-xl bg-gray-600 flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                                >
                                    <Plus size={18} />
                                </motion.button>
                            </div>
                        )}
                    </motion.div>

                    {/* Add to Cart Button */}
                    {features.showAddToCart && product.is_available && (
                        <motion.button
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all active:scale-[0.98]"
                        >
                            <ShoppingCart size={22} />
                            Sepete Ekle • ₺{(product.price * quantity).toFixed(2)}
                        </motion.button>
                    )}

                    {!product.is_available && (
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="w-full py-4 bg-gray-700/50 text-gray-400 text-center rounded-2xl font-medium border border-gray-600"
                        >
                            Şu anda mevcut değil
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Bottom Spacer */}
            <div className="h-24" />
        </main>
    );
}
