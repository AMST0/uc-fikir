'use client';

import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, TrendingUp, Users, Activity, Info, BarChart3 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Order {
    id: string;
    table_number: string;
    status: string;
    total: number;
    item_count: number;
    created_at: string;
}

interface Category {
    id: string;
    name: { tr: string; en: string };
    icon: string;
    products: Array<{ id: string; name: { tr: string }; price: number }>;
}

interface ViewData {
    topProducts: Array<{ id: string; name_tr: string; image: string; price: number; category_name: string; view_count: number }>;
    topCategories: Array<{ id: string; name_tr: string; icon: string; view_count: number }>;
    stats: { totalProductViews: number; totalCategoryViews: number; uniqueVisitors: number };
}

export default function AnalyticsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [viewData, setViewData] = useState<ViewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('7d');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchViews();
    }, [period]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [menuRes, ordersRes] = await Promise.all([
                fetch('/api/menu'),
                fetch('/api/orders')
            ]);

            const menuData = await menuRes.json();
            const ordersData = await ordersRes.json();

            if (menuData.success) {
                setCategories(menuData.data);
            }
            if (ordersData.success) {
                setOrders(ordersData.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const fetchViews = async () => {
        try {
            const res = await fetch(`/api/views?period=${period}`);
            const data = await res.json();
            if (data.success) {
                setViewData(data.data);
            }
        } catch (error) {
            console.error('Error fetching views:', error);
        }
    };

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);

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
                    <h1 className="text-2xl font-bold text-white">Analitik</h1>
                    <p className="text-gray-400 text-sm">Veritabanından gerçek zamanlı veriler</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { fetchData(); fetchViews(); }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 text-sm transition-colors"
                    >
                        <RefreshCw size={14} />
                        Yenile
                    </button>
                </div>
            </div>

            {/* Period Filter */}
            <div className="flex gap-2">
                {['24h', '7d', '30d'].map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${period === p ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        {p === '24h' ? 'Son 24 Saat' : p === '7d' ? 'Son 7 Gün' : 'Son 30 Gün'}
                    </button>
                ))}
            </div>

            {/* View Stats */}
            {viewData && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye size={16} className="text-blue-400" />
                            <p className="text-gray-400 text-sm">Ürün Görüntüleme</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{viewData.stats.totalProductViews}</p>
                        <p className="text-xs text-gray-500 mt-1">Gerçek veri</p>
                    </div>
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 size={16} className="text-purple-400" />
                            <p className="text-gray-400 text-sm">Kategori Görüntüleme</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{viewData.stats.totalCategoryViews}</p>
                        <p className="text-xs text-gray-500 mt-1">Gerçek veri</p>
                    </div>
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users size={16} className="text-green-400" />
                            <p className="text-gray-400 text-sm">Tekil Ziyaretçi</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{viewData.stats.uniqueVisitors}</p>
                        <p className="text-xs text-gray-500 mt-1">Session bazlı</p>
                    </div>
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={16} className="text-orange-400" />
                            <p className="text-gray-400 text-sm">Toplam Sipariş</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{orders.length}</p>
                        <p className="text-xs text-gray-500 mt-1">{orders.filter(o => o.status === 'pending').length} beklemede</p>
                    </div>
                </div>
            )}

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl border border-orange-500/30 p-6">
                    <p className="text-orange-300 text-sm mb-2">Toplam Gelir</p>
                    <p className="text-3xl font-bold text-white">{formatPrice(totalRevenue)}</p>
                    <p className="text-xs text-gray-400 mt-2">{orders.length} siparişten</p>
                </div>
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <p className="text-gray-400 text-sm mb-2">Ortalama Sipariş</p>
                    <p className="text-3xl font-bold text-white">{formatPrice(avgOrderValue)}</p>
                    <p className="text-xs text-gray-500 mt-2">Sipariş başına</p>
                </div>
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <p className="text-gray-400 text-sm mb-2">Menü Boyutu</p>
                    <p className="text-3xl font-bold text-white">{totalProducts}</p>
                    <p className="text-xs text-gray-500 mt-2">{categories.length} kategoride</p>
                </div>
            </div>

            {/* Most Viewed Products */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">🔥 En Çok Görüntülenen Ürünler</h3>
                    {viewData && viewData.stats.totalProductViews > 0 && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            Canlı Veri
                        </span>
                    )}
                </div>
                <div className="space-y-3">
                    {viewData && viewData.topProducts && viewData.topProducts.filter(p => Number(p.view_count) > 0).length > 0 ? (
                        viewData.topProducts.filter(p => Number(p.view_count) > 0).slice(0, 10).map((product, index) => (
                            <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                                <span className={`font-bold w-6 ${index < 3 ? 'text-orange-400' : 'text-gray-500'}`}>
                                    {index + 1}
                                </span>
                                <img
                                    src={product.image}
                                    alt={product.name_tr}
                                    className="w-12 h-12 rounded-xl object-cover bg-gray-800"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=🍽️'; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{product.name_tr}</p>
                                    <p className="text-gray-500 text-sm">{product.category_name} • {formatPrice(product.price)}</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                                    <Eye size={14} className="text-blue-400" />
                                    <span className="text-white font-bold">{product.view_count}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Eye size={40} className="text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">Henüz görüntüleme verisi yok</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Müşteriler ürünleri görüntülediğinde burada listelenecek
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Most Viewed Categories */}
            {viewData && viewData.topCategories && viewData.topCategories.filter(c => Number(c.view_count) > 0).length > 0 && (
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">📁 En Çok Görüntülenen Kategoriler</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                        {viewData.topCategories.filter(c => Number(c.view_count) > 0).slice(0, 5).map((cat) => (
                            <div key={cat.id} className="bg-gray-800/50 rounded-xl p-4 text-center">
                                <span className="text-3xl mb-2 block">{cat.icon}</span>
                                <p className="text-white font-medium text-sm truncate">{cat.name_tr}</p>
                                <p className="text-orange-400 font-bold mt-1">{cat.view_count} <span className="text-gray-500 font-normal text-xs">görüntüleme</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories Chart */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Kategori Dağılımı (Ürün Sayısı)</h3>
                <div className="space-y-3">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex items-center gap-3">
                            <span className="text-xl w-8">{cat.icon}</span>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-white text-sm">{cat.name.tr}</span>
                                    <span className="text-gray-400 text-sm">{cat.products.length} ürün</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                                        style={{ width: `${(cat.products.length / Math.max(...categories.map(c => c.products.length), 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
