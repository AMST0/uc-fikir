'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Edit2,
    Eye,
    EyeOff,
    RefreshCw
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Category {
    id: string;
    name: { tr: string; en: string };
    icon: string;
    products: Product[];
}

interface Product {
    id: string;
    name: { tr: string; en: string };
    description: { tr: string; en: string };
    price: number;
    image: string;
    is_available: boolean;
}

export default function MenuManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name_tr: '',
        name_en: '',
        desc_tr: '',
        desc_en: '',
        price: '',
        image: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const menuRes = await fetch('/api/menu');
            const menuData = await menuRes.json();
            if (menuData.success) {
                setCategories(menuData.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const handleEditClick = (product: Product) => {
        setEditProduct(product);
        setFormData({
            name_tr: product.name.tr,
            name_en: product.name.en,
            desc_tr: product.description.tr,
            desc_en: product.description.en,
            price: product.price.toString(),
            image: product.image
        });
    };

    const handleToggleAvailability = async (product: Product) => {
        try {
            const res = await fetch('/api/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    is_available: !product.is_available
                })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    const handleSaveProduct = async () => {
        if (!editProduct) return;
        setSaving(true);
        try {
            const res = await fetch('/api/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: editProduct.id,
                    name_tr: formData.name_tr,
                    name_en: formData.name_en,
                    description_tr: formData.desc_tr,
                    description_en: formData.desc_en,
                    price: parseFloat(formData.price),
                    image: formData.image
                })
            });
            if (res.ok) {
                fetchData();
            }
            setEditProduct(null);
        } catch (error) {
            console.error('Error saving product:', error);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Menü Yönetimi</h1>
                    <p className="text-gray-400 text-sm">{categories.length} kategori, {categories.reduce((sum, cat) => sum + cat.products.length, 0)} ürün</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 font-medium transition-colors"
                    >
                        <RefreshCw size={18} />
                        Yenile
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Yeni Ürün
                    </button>
                </div>
            </div>

            {/* Categories */}
            {categories.map((category) => (
                <div key={category.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.icon}</span>
                            <h3 className="text-lg font-semibold text-white">{category.name.tr}</h3>
                            <span className="text-gray-500 text-sm">({category.products.length} ürün)</span>
                        </div>
                        <button
                            onClick={() => alert('Kategori düzenleme yakında eklenecek')}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <Edit2 size={18} />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
                        {category.products.map((product) => (
                            <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors">
                                <img
                                    src={product.image}
                                    alt={product.name.tr}
                                    className="w-14 h-14 rounded-xl object-cover bg-gray-800"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=🍽️'; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{product.name.tr}</p>
                                    <p className="text-gray-500 text-sm truncate">{product.description.tr}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-orange-400 font-semibold">{formatPrice(product.price)}</span>
                                    <button
                                        onClick={() => handleToggleAvailability(product)}
                                        className={`p-2 rounded-lg transition-colors ${product.is_available ? 'text-green-400 bg-green-500/20 hover:bg-green-500/30' : 'text-red-400 bg-red-500/20 hover:bg-red-500/30'}`}
                                        title={product.is_available ? 'Ürünü gizle' : 'Ürünü göster'}
                                    >
                                        {product.is_available ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(product)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Ürünü düzenle"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Edit Product Modal */}
            {editProduct && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Ürün Düzenle</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Ürün Adı (TR)</label>
                                <input
                                    type="text"
                                    value={formData.name_tr}
                                    onChange={(e) => setFormData({ ...formData, name_tr: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Ürün Adı (EN)</label>
                                <input
                                    type="text"
                                    value={formData.name_en}
                                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Açıklama (TR)</label>
                                <textarea
                                    value={formData.desc_tr}
                                    onChange={(e) => setFormData({ ...formData, desc_tr: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Fiyat (₺)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Ürün Görseli</label>

                                {/* Current image preview */}
                                {formData.image && (
                                    <div className="mb-2">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-20 h-20 rounded-xl object-cover bg-gray-800"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=🍽️'; }}
                                        />
                                    </div>
                                )}

                                {/* File upload */}
                                <div className="flex gap-2">
                                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 border-dashed rounded-xl text-gray-400 hover:border-orange-500 hover:text-orange-400 cursor-pointer transition-colors">
                                        <Plus size={16} />
                                        <span>Dosya Seç</span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const formDataUpload = new FormData();
                                                formDataUpload.append('file', file);

                                                try {
                                                    const res = await fetch('/api/upload', {
                                                        method: 'POST',
                                                        body: formDataUpload
                                                    });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                        setFormData({ ...formData, image: data.url });
                                                    } else {
                                                        alert(data.error || 'Yükleme başarısız');
                                                    }
                                                } catch (error) {
                                                    alert('Dosya yüklenirken hata oluştu');
                                                }
                                            }}
                                        />
                                    </label>
                                </div>

                                {/* URL input as alternative */}
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="veya URL yapıştır..."
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setEditProduct(null)}
                                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSaveProduct}
                                disabled={saving}
                                className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-md w-full"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Yeni Ürün Ekle</h2>
                        <p className="text-gray-400 mb-4">Bu özellik yakında eklenecek. Şimdilik veritabanını yeniden oluşturmak için Ayarlar sekmesindeki "Veritabanını Sıfırla" butonunu kullanabilirsiniz.</p>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                        >
                            Kapat
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
