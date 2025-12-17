'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    BarChart3,
    Settings,
    Users,
    Clock,
    TrendingUp,
    ChevronRight,
    Plus,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    RefreshCw,
    Check
} from 'lucide-react';
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

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Bekliyor' },
    preparing: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Hazırlanıyor' },
    ready: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Hazır' },
    delivered: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Teslim Edildi' },
};

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch menu data
            const menuRes = await fetch('/api/menu');
            const menuData = await menuRes.json();
            if (menuData.success) {
                setCategories(menuData.data);
            }

            // Fetch orders
            const ordersRes = await fetch('/api/orders');
            const ordersData = await ordersRes.json();
            if (ordersData.success) {
                setOrders(ordersData.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status })
            });
            if (res.ok) {
                // Refresh orders
                const ordersRes = await fetch('/api/orders');
                const ordersData = await ordersRes.json();
                if (ordersData.success) {
                    setOrders(ordersData.data);
                }
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'menu', label: 'Menü Yönetimi', icon: UtensilsCrossed },
        { id: 'orders', label: 'Siparişler', icon: ShoppingBag },
        { id: 'analytics', label: 'Analitik', icon: BarChart3 },
        { id: 'settings', label: 'Ayarlar', icon: Settings },
    ];

    // Calculate stats from real data
    const stats = [
        {
            label: 'Toplam Sipariş',
            value: orders.length.toString(),
            change: '+' + orders.filter(o => o.status === 'pending').length + ' bekleyen',
            icon: ShoppingBag,
            color: 'rose'
        },
        {
            label: 'Aktif Masa',
            value: new Set(orders.filter(o => o.status !== 'delivered').map(o => o.table_number)).size.toString(),
            change: 'şu an',
            icon: Users,
            color: 'blue'
        },
        {
            label: 'Toplam Ürün',
            value: categories.reduce((sum, cat) => sum + cat.products.length, 0).toString(),
            change: categories.length + ' kategori',
            icon: UtensilsCrossed,
            color: 'amber'
        },
        {
            label: 'Toplam Gelir',
            value: formatPrice(orders.reduce((sum, o) => sum + o.total, 0)),
            change: 'bugün',
            icon: TrendingUp,
            color: 'green'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-950 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4 hidden lg:block">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold">Cemil Pub</h1>
                        <p className="text-gray-500 text-xs">Admin Panel</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Refresh Button */}
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 text-sm transition-colors"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Verileri Yenile
                </button>
            </aside>

            {/* Mobile Nav */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 px-2 py-2">
                <div className="flex justify-around">
                    {tabs.slice(0, 4).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${activeTab === tab.id ? 'text-rose-400' : 'text-gray-500'
                                }`}
                        >
                            <tab.icon size={20} />
                            <span className="text-[10px]">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <RefreshCw className="w-8 h-8 text-rose-400 animate-spin" />
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && <DashboardContent stats={stats} orders={orders} />}
                        {activeTab === 'menu' && <MenuManagementContent categories={categories} onRefresh={fetchData} />}
                        {activeTab === 'orders' && <OrdersContent orders={orders} onUpdateStatus={updateOrderStatus} />}
                        {activeTab === 'analytics' && <AnalyticsContent orders={orders} categories={categories} />}
                        {activeTab === 'settings' && <SettingsContent />}
                    </>
                )}
            </main>
        </div>
    );
}

function DashboardContent({ stats, orders }: { stats: Array<{ label: string; value: string; change: string; icon: any; color: string }>; orders: Order[] }) {
    const recentOrders = orders.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 text-sm">Hoş geldiniz, güncel veriler SQLite'dan</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-gray-900 rounded-2xl p-4 border border-gray-800"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color === 'rose' ? 'bg-rose-500/20' :
                                stat.color === 'blue' ? 'bg-blue-500/20' :
                                    stat.color === 'amber' ? 'bg-amber-500/20' : 'bg-green-500/20'
                                }`}>
                                <stat.icon className={`w-5 h-5 ${stat.color === 'rose' ? 'text-rose-400' :
                                    stat.color === 'blue' ? 'text-blue-400' :
                                        stat.color === 'amber' ? 'text-amber-400' : 'text-green-400'
                                    }`} />
                            </div>
                            <span className="text-xs font-medium text-gray-500">{stat.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold text-white">Son Siparişler</h2>
                    <span className="text-gray-500 text-sm">{orders.length} toplam</span>
                </div>
                <div className="divide-y divide-gray-800">
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Henüz sipariş yok
                        </div>
                    ) : (
                        recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-semibold">{order.table_number}</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">#{order.id.slice(-6).toUpperCase()}</p>
                                        <p className="text-gray-500 text-sm">{order.item_count} ürün • {new Date(order.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]?.bg || 'bg-gray-500/20'} ${statusColors[order.status]?.text || 'text-gray-400'}`}>
                                        {statusColors[order.status]?.label || order.status}
                                    </span>
                                    <span className="text-white font-semibold">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function MenuManagementContent({ categories, onRefresh }: { categories: Category[]; onRefresh?: () => void }) {
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
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
            if (res.ok && onRefresh) {
                onRefresh();
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
            if (res.ok && onRefresh) {
                onRefresh();
            }
            setEditProduct(null);
        } catch (error) {
            console.error('Error saving product:', error);
        }
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Menü Yönetimi</h1>
                    <p className="text-gray-400 text-sm">{categories.length} kategori, {categories.reduce((sum, cat) => sum + cat.products.length, 0)} ürün</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-white font-medium transition-colors"
                >
                    <Plus size={18} />
                    Yeni Ürün
                </button>
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
                                    <span className="text-rose-400 font-semibold">{formatPrice(product.price)}</span>
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
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Ürün Adı (EN)</label>
                                <input
                                    type="text"
                                    value={formData.name_en}
                                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Açıklama (TR)</label>
                                <textarea
                                    value={formData.desc_tr}
                                    onChange={(e) => setFormData({ ...formData, desc_tr: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-rose-500 focus:outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Fiyat (₺)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-rose-500 focus:outline-none"
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
                                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 border-dashed rounded-xl text-gray-400 hover:border-rose-500 hover:text-rose-400 cursor-pointer transition-colors">
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
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
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
                                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors disabled:opacity-50"
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

function OrdersContent({ orders, onUpdateStatus }: { orders: Order[]; onUpdateStatus: (id: string, status: string) => void }) {
    const [filter, setFilter] = useState('all');

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Siparişler</h1>
                <p className="text-gray-400 text-sm">{orders.length} toplam sipariş</p>
            </div>

            {/* Order Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'all', label: 'Tümü' },
                    { id: 'pending', label: 'Bekliyor' },
                    { id: 'preparing', label: 'Hazırlanıyor' },
                    { id: 'ready', label: 'Hazır' },
                    { id: 'delivered', label: 'Teslim Edildi' }
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filter === f.id ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Orders */}
            <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                    <div className="bg-gray-900 rounded-2xl p-8 text-center text-gray-500">
                        Bu filtrede sipariş yok
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{order.table_number}</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">Sipariş #{order.id.slice(-6).toUpperCase()}</p>
                                        <p className="text-gray-500 text-sm">{order.item_count} ürün • {new Date(order.created_at).toLocaleString('tr-TR')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-rose-400 font-bold text-lg">{formatPrice(order.total)}</p>
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]?.bg || 'bg-gray-500/20'} ${statusColors[order.status]?.text || 'text-gray-400'}`}>
                                        {statusColors[order.status]?.label || order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="flex gap-2 flex-wrap">
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => onUpdateStatus(order.id, 'preparing')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
                                    >
                                        <Clock size={14} /> Hazırlanıyor
                                    </button>
                                )}
                                {order.status === 'preparing' && (
                                    <button
                                        onClick={() => onUpdateStatus(order.id, 'ready')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors"
                                    >
                                        <Check size={14} /> Hazır
                                    </button>
                                )}
                                {order.status === 'ready' && (
                                    <button
                                        onClick={() => onUpdateStatus(order.id, 'delivered')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-500/30 transition-colors"
                                    >
                                        <Check size={14} /> Teslim Edildi
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function AnalyticsContent({ orders, categories }: { orders: Order[]; categories: Category[] }) {
    const [viewData, setViewData] = useState<{
        topProducts: Array<{ id: string; name_tr: string; image: string; price: number; category_name: string; view_count: number }>;
        topCategories: Array<{ id: string; name_tr: string; icon: string; view_count: number }>;
        stats: { totalProductViews: number; totalCategoryViews: number; uniqueVisitors: number };
    } | null>(null);
    const [period, setPeriod] = useState('7d');

    useEffect(() => {
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
        fetchViews();
    }, [period]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analitik</h1>
                    <p className="text-gray-400 text-sm">Veritabanından canlı veriler</p>
                </div>
                <div className="flex gap-2">
                    {['24h', '7d', '30d'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${period === p ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            {p === '24h' ? '24 Saat' : p === '7d' ? '7 Gün' : '30 Gün'}
                        </button>
                    ))}
                </div>
            </div>

            {/* View Stats */}
            {viewData && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                        <p className="text-gray-400 text-sm mb-1">Ürün Görüntüleme</p>
                        <p className="text-2xl font-bold text-white">{viewData.stats.totalProductViews}</p>
                    </div>
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                        <p className="text-gray-400 text-sm mb-1">Kategori Görüntüleme</p>
                        <p className="text-2xl font-bold text-white">{viewData.stats.totalCategoryViews}</p>
                    </div>
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
                        <p className="text-gray-400 text-sm mb-1">Tekil Ziyaretçi</p>
                        <p className="text-2xl font-bold text-white">{viewData.stats.uniqueVisitors}</p>
                    </div>
                </div>
            )}

            {/* Revenue Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <p className="text-gray-400 text-sm mb-2">Toplam Gelir</p>
                    <p className="text-3xl font-bold text-white">{formatPrice(totalRevenue)}</p>
                </div>
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <p className="text-gray-400 text-sm mb-2">Ortalama Sipariş</p>
                    <p className="text-3xl font-bold text-white">{formatPrice(avgOrderValue)}</p>
                </div>
            </div>

            {/* Most Viewed Products */}
            {viewData && viewData.topProducts.length > 0 && (
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">🔥 En Çok Görüntülenen Ürünler</h3>
                    <div className="space-y-3">
                        {viewData.topProducts.filter(p => p.view_count > 0).slice(0, 5).map((product, index) => (
                            <div key={product.id} className="flex items-center gap-3">
                                <span className="text-gray-500 font-bold w-6">{index + 1}</span>
                                <img
                                    src={product.image}
                                    alt={product.name_tr}
                                    className="w-10 h-10 rounded-lg object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=🍽️'; }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{product.name_tr}</p>
                                    <p className="text-gray-500 text-xs">{product.category_name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={14} className="text-gray-500" />
                                    <span className="text-rose-400 font-bold">{product.view_count}</span>
                                </div>
                            </div>
                        ))}
                        {viewData.topProducts.filter(p => p.view_count > 0).length === 0 && (
                            <p className="text-gray-500 text-sm">Henüz görüntüleme verisi yok</p>
                        )}
                    </div>
                </div>
            )}

            {/* Categories Chart */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Kategori Dağılımı</h3>
                <div className="space-y-3">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex items-center gap-3">
                            <span className="text-xl">{cat.icon}</span>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-white text-sm">{cat.name.tr}</span>
                                    <span className="text-gray-400 text-sm">{cat.products.length} ürün</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                                        style={{ width: `${(cat.products.length / Math.max(...categories.map(c => c.products.length))) * 100}%` }}
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

function SettingsContent() {
    const [seeding, setSeeding] = useState(false);

    const handleReseed = async () => {
        setSeeding(true);
        try {
            await fetch('/api/seed', { method: 'POST' });
            window.location.reload();
        } catch (error) {
            console.error('Error seeding:', error);
        }
        setSeeding(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
                <p className="text-gray-400 text-sm">Veritabanı ve uygulama ayarları</p>
            </div>

            {/* Database Actions */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Veritabanı</h3>
                <p className="text-gray-400 text-sm mb-4">
                    SQLite veritabanı kullanılıyor. Verileri sıfırlamak ve demo verileri ile yeniden yüklemek için:
                </p>
                <button
                    onClick={handleReseed}
                    disabled={seeding}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={18} className={seeding ? 'animate-spin' : ''} />
                    {seeding ? 'Yükleniyor...' : 'Veritabanını Sıfırla'}
                </button>
            </div>

            {/* Info */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Hakkında</h3>
                <div className="space-y-2 text-gray-400 text-sm">
                    <p>• <span className="text-white">10</span> kategori</p>
                    <p>• <span className="text-white">50+</span> ürün (Cemil Pub tarzı menü)</p>
                    <p>• <span className="text-white">Vercel Postgres</span> veritabanı</p>
                    <p>• <span className="text-white">Serverless</span></p>
                </div>
            </div>
        </div>
    );
}
