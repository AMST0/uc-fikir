'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Check,
    RefreshCw,
    X,
    ShoppingBag
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Order {
    id: string;
    table_number: string;
    status: string;
    total: number;
    item_count: number;
    created_at: string;
    notes?: string;
}

interface OrderItem {
    id: string;
    productId: string;
    name: { tr: string; en: string };
    description: string;
    image: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface OrderDetails extends Order {
    items: OrderItem[];
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
    const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

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

    const fetchOrderDetails = async (orderId: string) => {
        setLoadingDetails(true);
        try {
            const res = await fetch(`/api/orders?orderId=${orderId}`);
            const data = await res.json();
            if (data.success) {
                setSelectedOrder(data.data);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
        setLoadingDetails(false);
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
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status });
                }
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleOrderClick = (order: Order) => {
        fetchOrderDetails(order.id);
    };

    const closeModal = () => {
        setSelectedOrder(null);
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
                        <div
                            key={order.id}
                            onClick={() => handleOrderClick(order)}
                            className="bg-gray-900 rounded-2xl border border-gray-800 p-4 cursor-pointer hover:border-gray-700 transition-colors"
                        >
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
                            <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
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

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg max-h-[85vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center">
                                        <ShoppingBag size={20} className="text-rose-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold">Sipariş #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                                        <p className="text-gray-500 text-sm">Masa {selectedOrder.table_number}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                                >
                                    <X size={18} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-4 overflow-y-auto max-h-[60vh]">
                                {loadingDetails ? (
                                    <div className="flex items-center justify-center py-8">
                                        <RefreshCw className="w-6 h-6 text-rose-400 animate-spin" />
                                    </div>
                                ) : (
                                    <>
                                        {/* Order Status & Time */}
                                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-800/50 rounded-xl">
                                            <div>
                                                <p className="text-gray-400 text-xs">Durum</p>
                                                <span className={`inline-block px-2.5 py-1 mt-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]?.bg || 'bg-gray-500/20'} ${statusColors[selectedOrder.status]?.text || 'text-gray-400'}`}>
                                                    {statusColors[selectedOrder.status]?.label || selectedOrder.status}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-400 text-xs">Tarih</p>
                                                <p className="text-white text-sm mt-1">{new Date(selectedOrder.created_at).toLocaleString('tr-TR')}</p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <h3 className="text-white font-semibold mb-3">Sipariş İçeriği</h3>
                                        <div className="space-y-3 mb-4">
                                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                                selectedOrder.items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name.tr}
                                                                className="w-14 h-14 rounded-xl object-cover bg-gray-800"
                                                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=🍽️'; }}
                                                            />
                                                        ) : (
                                                            <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center text-2xl">
                                                                🍽️
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white font-medium">{item.name.tr}</p>
                                                            <p className="text-gray-500 text-sm">{formatPrice(item.unitPrice)} x {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-rose-400 font-bold">{formatPrice(item.subtotal)}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    Ürün bilgisi bulunamadı
                                                </div>
                                            )}
                                        </div>

                                        {/* Notes */}
                                        {selectedOrder.notes && (
                                            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                                <p className="text-yellow-400 text-xs font-medium mb-1">Not</p>
                                                <p className="text-white text-sm">{selectedOrder.notes}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-gray-400">Toplam</span>
                                    <span className="text-2xl font-bold text-white">{formatPrice(selectedOrder.total)}</span>
                                </div>

                                {/* Status Actions */}
                                <div className="flex gap-2">
                                    {selectedOrder.status === 'pending' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                                        >
                                            <Clock size={18} /> Hazırlamaya Başla
                                        </button>
                                    )}
                                    {selectedOrder.status === 'preparing' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                                        >
                                            <Check size={18} /> Hazır Olarak İşaretle
                                        </button>
                                    )}
                                    {selectedOrder.status === 'ready' && (
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-500 transition-colors"
                                        >
                                            <Check size={18} /> Teslim Edildi
                                        </button>
                                    )}
                                    {selectedOrder.status === 'delivered' && (
                                        <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-gray-400 rounded-xl font-medium">
                                            <Check size={18} /> Teslim Edildi
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
