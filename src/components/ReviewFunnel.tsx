'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { Star, X } from 'lucide-react';
import { translations } from '@/lib/mockData';

export const ReviewFunnel: React.FC = () => {
    const { features, language } = usePhase();
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const t = translations[language];

    useEffect(() => {
        if (!features.showReviewFunnel || hasShown) return;

        const handleMouseLeave = (e: MouseEvent) => {
            // Exit intent detection: mouse leaves from top of viewport
            if (e.clientY < 10 && !hasShown) {
                setIsVisible(true);
                setHasShown(true);
            }
        };

        // Also show after 30 seconds as fallback for demo
        const timer = setTimeout(() => {
            if (!hasShown) {
                setIsVisible(true);
                setHasShown(true);
            }
        }, 30000);

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(timer);
        };
    }, [features.showReviewFunnel, hasShown]);

    if (!features.showReviewFunnel) return null;

    const handleSubmit = () => {
        // In real app, this would send to analytics
        console.log('Review submitted:', selectedRating);
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsVisible(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-sm"
                    >
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700/50 mx-4">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-3 right-3 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>

                            {/* Content */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                    <Star className="w-8 h-8 text-white" fill="white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{t.reviewTitle}</h3>
                                <p className="text-gray-400 text-sm mb-6">{t.reviewSubtitle}</p>

                                {/* Star Rating */}
                                <div className="flex justify-center gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setSelectedRating(star)}
                                            className="p-1"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${star <= selectedRating
                                                        ? 'text-amber-400'
                                                        : 'text-gray-600'
                                                    }`}
                                                fill={star <= selectedRating ? 'currentColor' : 'none'}
                                            />
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="flex-1 py-3 rounded-xl bg-gray-700 text-gray-300 font-medium hover:bg-gray-600 transition-colors"
                                    >
                                        {t.later}
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={selectedRating === 0}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t.rateUs}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
