'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, PartyPopper } from 'lucide-react';

export const PromoPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show popup on mount with delay
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header Background */}
                        <div className="h-32 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                            <PartyPopper className="w-16 h-16 text-white/90 relative z-10" />

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Hoş Geldiniz! 🎉</h3>
                            <p className="text-gray-600 mb-6">
                                piiyuu'ya hoş geldiniz. Keyifli vakit geçirmenizi dileriz.
                            </p>

                            <div className="bg-orange-50 rounded-2xl p-4 mb-6 border border-orange-100">
                                <div className="flex items-center justify-center gap-2 text-orange-600 font-bold mb-1">
                                    <Clock size={20} />
                                    <span>HAPPY HOUR</span>
                                </div>
                                <p className="text-orange-500 font-medium">Her Gün 17:00 - 20:00</p>
                                <p className="text-sm text-gray-500 mt-1">Tüm kokteyllerde %20 indirim!</p>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] transition-all"
                            >
                                Menüyü İncele
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
