'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { MapPin, X, ChefHat } from 'lucide-react';

interface TableNumberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (tableNumber: string) => void;
    mode: 'welcome' | 'order';
}

export const TableNumberModal: React.FC<TableNumberModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    mode,
}) => {
    const { language } = usePhase();
    const [tableNumber, setTableNumber] = useState('');

    const texts = {
        tr: {
            welcomeTitle: 'Hoş Geldiniz! 👋',
            welcomeSubtitle: 'Siparişlerinizi masanıza getirelim',
            orderTitle: 'Sipariş Onayı',
            orderSubtitle: 'Lütfen masa numaranızı onaylayın',
            tableLabel: 'Masa Numarası',
            tablePlaceholder: 'Örn: 5',
            confirm: 'Onayla',
            startBrowsing: 'Menüye Göz At',
            completeOrder: 'Siparişi Tamamla',
            skip: 'Daha Sonra',
        },
        en: {
            welcomeTitle: 'Welcome! 👋',
            welcomeSubtitle: 'Let us bring your orders to your table',
            orderTitle: 'Order Confirmation',
            orderSubtitle: 'Please confirm your table number',
            tableLabel: 'Table Number',
            tablePlaceholder: 'E.g: 5',
            confirm: 'Confirm',
            startBrowsing: 'Browse Menu',
            completeOrder: 'Complete Order',
            skip: 'Later',
        },
    };

    const t = texts[language];
    const isWelcome = mode === 'welcome';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300]"
                        onClick={isWelcome ? undefined : onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-full max-w-sm mx-4"
                    >
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-700/50 relative overflow-hidden">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

                            {/* Close Button (only for order mode) */}
                            {!isWelcome && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            )}

                            {/* Icon */}
                            <div className="relative flex justify-center mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.1 }}
                                    className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30"
                                >
                                    {isWelcome ? (
                                        <ChefHat className="w-10 h-10 text-white" />
                                    ) : (
                                        <MapPin className="w-10 h-10 text-white" />
                                    )}
                                </motion.div>
                            </div>

                            {/* Title */}
                            <div className="relative text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {isWelcome ? t.welcomeTitle : t.orderTitle}
                                </h2>
                                <p className="text-gray-400">
                                    {isWelcome ? t.welcomeSubtitle : t.orderSubtitle}
                                </p>
                            </div>

                            {/* Table Number Input */}
                            <div className="relative mb-6">
                                <label className="block text-sm text-gray-400 mb-2">
                                    {t.tableLabel}
                                </label>
                                <input
                                    type="text"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    placeholder={t.tablePlaceholder}
                                    className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-center text-2xl font-bold placeholder:text-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    autoFocus
                                />
                            </div>

                            {/* Actions */}
                            <div className="relative space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (tableNumber.trim()) {
                                            onConfirm(tableNumber);
                                        }
                                    }}
                                    disabled={!tableNumber.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isWelcome ? t.startBrowsing : t.completeOrder}
                                </motion.button>

                                {isWelcome && (
                                    <button
                                        onClick={() => onConfirm('')}
                                        className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {t.skip}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
