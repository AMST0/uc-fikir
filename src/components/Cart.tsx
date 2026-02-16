'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { usePhase } from '@/context/PhaseContext';
import { ShoppingCart, X, Plus, Minus, ArrowRight, MapPin } from 'lucide-react';
import { translations } from '@/lib/mockData';
import { formatPrice } from '@/lib/utils';
import { TableNumberModal } from './TableNumberModal';

export const Cart: React.FC = () => {
    const pathname = usePathname();
    const { features, cart, cartTotal, updateQuantity, removeFromCart, language, tableNumber, setTableNumber, clearCart, showToast } = usePhase();
    const [isOpen, setIsOpen] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false);
    const t = translations[language];

    // Hide cart on admin pages
    if (pathname?.startsWith('/admin')) return null;

    if (!features.showCart) return null;

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleOrderClick = () => {
        if (!tableNumber) {
            setShowTableModal(true);
        } else {
            completeOrder(tableNumber);
        }
    };

    const completeOrder = async (table: string) => {
        try {
            // Create order items for API
            const orderItems = cart.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                unitPrice: item.product.price
            }));

            // Send to API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tableNumber: table,
                    items: orderItems
                })
            });

            const result = await response.json();

            if (result.success) {
                showToast(`Sipariş #${result.data.orderId.slice(-6).toUpperCase()} Masa ${table} için oluşturuldu! 🎉`);
                clearCart();
                setIsOpen(false);
            } else {
                showToast('Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Order error:', error);
            showToast('Sipariş gönderilirken hata oluştu.');
        }
    };

    const handleTableConfirm = (number: string) => {
        setTableNumber(number);
        setShowTableModal(false);
        if (number) {
            completeOrder(number);
        }
    };


    return (
        <>
            {/* Cart Button - Bottom Center like canlimenu */}
            <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/30 text-white font-semibold hover:shadow-xl hover:shadow-orange-500/40 transition-all active:scale-95"
            >
                <ShoppingCart size={20} />
                <span>Sepetim</span>
                {itemCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-white text-orange-600 rounded-full text-xs font-bold flex items-center justify-center"
                    >
                        {itemCount}
                    </motion.span>
                )}
                {itemCount > 0 && (
                    <span className="text-white/90">• {formatPrice(cartTotal)}</span>
                )}
            </motion.button>

            {/* Cart Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />

                        {/* Drawer - Full screen on mobile */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-gray-900 z-[101] flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <ShoppingCart size={20} />
                                    {t.cart}
                                    <span className="text-gray-400 text-sm">({itemCount})</span>
                                </h2>
                                <div className="flex items-center gap-2">
                                    {/* Table Number Badge */}
                                    {tableNumber && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 rounded-full">
                                            <MapPin size={14} className="text-orange-400" />
                                            <span className="text-orange-400 text-sm font-medium">Masa {tableNumber}</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <X className="text-gray-400" size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {cart.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-400">Sepetiniz boş</p>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <motion.div
                                            key={item.product.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 100 }}
                                            className="flex gap-3 bg-gray-800/50 rounded-xl p-3"
                                        >
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name[language]}
                                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium truncate text-sm sm:text-base">
                                                    {item.product.name[language]}
                                                </h3>
                                                <p className="text-orange-400 text-sm font-semibold">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end justify-between">
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-gray-400" />
                                                </button>
                                                <div className="flex items-center gap-1 sm:gap-2 bg-gray-700 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="p-1.5 sm:p-2 hover:bg-gray-600 rounded-l-lg transition-colors"
                                                    >
                                                        <Minus size={14} className="text-gray-300" />
                                                    </button>
                                                    <span className="text-white text-sm w-5 sm:w-6 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="p-1.5 sm:p-2 hover:bg-gray-600 rounded-r-lg transition-colors"
                                                    >
                                                        <Plus size={14} className="text-gray-300" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {cart.length > 0 && (
                                <div className="p-4 border-t border-gray-800 space-y-4 pb-safe">
                                    <div className="flex justify-between text-lg">
                                        <span className="text-gray-400">{t.total}</span>
                                        <span className="text-white font-bold">{formatPrice(cartTotal)}</span>
                                    </div>
                                    <button
                                        onClick={handleOrderClick}
                                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]"
                                    >
                                        {t.orderNow}
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Table Number Modal */}
            <TableNumberModal
                isOpen={showTableModal}
                onClose={() => setShowTableModal(false)}
                onConfirm={handleTableConfirm}
                mode="order"
            />
        </>
    );
};
