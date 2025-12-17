'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { CheckCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
    const { toast } = usePhase();

    return (
        <AnimatePresence>
            {toast.visible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9998] max-w-md"
                >
                    <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-2xl flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {toast.message.includes('Phase') ? (
                                <Info className="w-5 h-5 text-blue-400" />
                            ) : (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-white font-medium">{toast.message}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
