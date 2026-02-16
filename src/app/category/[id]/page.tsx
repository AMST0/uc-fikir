'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { usePhase } from '@/context/PhaseContext';
import { translations } from '@/lib/mockData';
import { ProductModal, PoweredBy } from '@/components';
import { Product, Category } from '@/types';
import { ArrowLeft, MapPin, Globe, RefreshCw } from 'lucide-react';

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.id as string;

    const { language, setLanguage, tableNumber, features } = usePhase();
    const [category, setCategory] = useState<Category | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const t = translations[language];

    // Fetch category data
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch('/api/menu');
                const data = await res.json();
                if (data.success) {
                    const found = data.data.find((c: Category) => c.id === categoryId);
                    setCategory(found || null);

                    // Record category view
                    if (found) {
                        fetch('/api/views', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ categoryId: found.id, type: 'category' })
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            }
            setLoading(false);
        };
        fetchCategory();
    }, [categoryId]);

    const handleProductClick = (product: Product) => {
        // Navigate to product page
        router.push(`/product/${product.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Kategori bulunamadı</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-orange-500 text-white rounded-xl"
                    >
                        Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-32 bg-[#f5f0e8]">
            {/* Header */}
            <header className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-white font-medium"
                    >
                        <ArrowLeft size={20} />
                        Geri
                    </button>
                    <div className="flex items-center gap-2">
                        {tableNumber && (
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full">
                                <MapPin size={14} className="text-white" />
                                <span className="text-white text-sm font-medium">Masa {tableNumber}</span>
                            </div>
                        )}
                        <button
                            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 rounded-full"
                        >
                            <Globe size={14} className="text-white" />
                            <span className="text-white text-sm font-medium">{language.toUpperCase()}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Category Title */}
            <div className="px-4 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{category.name[language]}</h1>
                        <p className="text-gray-500 text-sm">{category.products.length} ürün</p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mobile-grid-2">
                    {category.products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleProductClick(product)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                        >
                            {/* Ayın Favorisi Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center gap-1 shadow-lg">
                                    <span className="text-white text-[10px] font-bold">🔥 Ayın Favorisi</span>
                                </div>
                            )}
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name[language]}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=🍽️'; }}
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{product.name[language]}</h3>
                                <p className="text-orange-500 font-bold">₺{product.price.toFixed(2)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <PoweredBy />

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onProductChange={(product) => handleProductClick(product)}
            />
        </main>
    );
}
