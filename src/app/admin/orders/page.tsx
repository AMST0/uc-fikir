'use client';

import React, { useState, useEffect } from 'react';
import {
    Clock,
    Check,
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

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Bekliyor' },
    preparing: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Hazırlanıyor' },
    ready: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Hazır' },
    delivered: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Teslim Edildi' },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const ordersRes = await fetch('/api/orders');
            const ordersData = await ordersRes.json();
            if (ordersData.success) {
                setOrders(ordersData.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
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
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

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
                    <h1 className="text-2xl font-bold text-white">Siparişler</h1>
                    <p className="text-gray-400 text-sm">{orders.length} toplam sipariş</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 font-medium transition-colors"
                >
                    <RefreshCw size={18} />
                    Yenile
                </button>
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
                                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
                                    >
                                        <Clock size={14} /> Hazırlanıyor
                                    </button>
                                )}
                                {order.status === 'preparing' && (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'ready')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors"
                                    >
                                        <Check size={14} /> Hazır
                                    </button>
                                )}
                                {order.status === 'ready' && (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'delivered')}
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
