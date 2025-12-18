'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Users,
    UtensilsCrossed,
    TrendingUp,
    RefreshCw
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
    products: Array<{ id: string }>;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Bekliyor' },
    preparing: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Hazırlanıyor' },
    ready: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Hazır' },
    delivered: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Teslim Edildi' },
};

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

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

    const recentOrders = orders.slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-rose-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 text-sm">Hoş geldiniz, güncel veriler Postgres veritabanından</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 font-medium transition-colors"
                >
                    <RefreshCw size={18} />
                    Yenile
                </button>
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
