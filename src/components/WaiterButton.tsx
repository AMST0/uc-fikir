'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { Bell, UserCheck } from 'lucide-react';
import { translations } from '@/lib/mockData';

export const WaiterButton: React.FC = () => {
    const { features, language, showToast } = usePhase();
    const [isCalling, setIsCalling] = React.useState(false);
    const t = translations[language];

    if (!features.showWaiterButton) return null;

    const handleClick = () => {
        setIsCalling(true);
        showToast('Garson çağrıldı! Birazdan yanınızda olacak.');
        setTimeout(() => setIsCalling(false), 3000);
    };

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleClick}
            disabled={isCalling}
            className={`fixed bottom-4 right-20 z-50 px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white font-medium transition-all ${isCalling
                    ? 'bg-green-600 shadow-green-500/30'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40'
                }`}
        >
            <AnimatePresence mode="wait">
                {isCalling ? (
                    <motion.div
                        key="calling"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="flex items-center gap-2"
                    >
                        <UserCheck size={20} />
                        <span>Garson Geliyor...</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Bell size={20} />
                        <span>{t.callWaiter}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};
