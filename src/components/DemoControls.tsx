'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { Sparkles, Eye, BarChart3, ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { Phase } from '@/types';

const phases: { phase: Phase; label: string; icon: React.ReactNode; gradient: string }[] = [
    { phase: 1, label: 'Menü', icon: <Eye size={16} />, gradient: 'from-blue-500 to-cyan-500' },
    { phase: 2, label: 'Analitik', icon: <BarChart3 size={16} />, gradient: 'from-violet-500 to-purple-500' },
    { phase: 3, label: 'Sipariş', icon: <ShoppingCart size={16} />, gradient: 'from-emerald-500 to-green-500' },
];

export const DemoControls: React.FC = () => {
    const { currentPhase, setPhase } = usePhase();
    const [isExpanded, setIsExpanded] = React.useState(false);

    const currentPhaseData = phases.find(p => p.phase === currentPhase) || phases[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-6 z-[9999]"
        >
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="absolute bottom-full left-0 mb-3 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                        style={{ minWidth: '200px' }}
                    >
                        {/* Phase Selector */}
                        <div className="p-2">
                            {phases.map(({ phase, label, icon, gradient }) => (
                                <motion.button
                                    key={phase}
                                    onClick={() => {
                                        setPhase(phase);
                                        setIsExpanded(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPhase === phase
                                        ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                    whileHover={{ x: currentPhase !== phase ? 4 : 0 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className={currentPhase === phase ? 'text-white' : 'text-white/60'}>
                                        {icon}
                                    </span>
                                    <div className="flex-1 text-left">
                                        <span className="font-semibold text-sm">Phase {phase}</span>
                                        <span className="text-xs ml-2 opacity-75">({label})</span>
                                    </div>
                                    {currentPhase === phase && (
                                        <motion.div
                                            layoutId="checkmark"
                                            className="w-2 h-2 rounded-full bg-white"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Features Info */}
                        <div className="px-4 pb-3 pt-2 border-t border-white/10">
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2 font-medium">
                                Aktif Özellikler
                            </p>
                            <div className="flex flex-wrap gap-1">
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-[10px] rounded-full font-medium">
                                    Menü
                                </span>
                                {currentPhase >= 2 && (
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-[10px] rounded-full font-medium">
                                        Analitik
                                    </span>
                                )}
                                {currentPhase >= 3 && (
                                    <>
                                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-[10px] rounded-full font-medium">
                                            Sepet
                                        </span>
                                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-[10px] rounded-full font-medium">
                                            Sipariş
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${currentPhaseData.gradient} rounded-2xl shadow-lg hover:shadow-xl transition-shadow`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                </div>
                <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-white/70 font-medium">Demo Mode</p>
                    <p className="text-white font-bold text-sm">Phase {currentPhase}</p>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="ml-2 text-white/70"
                >
                    <ChevronUp size={16} />
                </motion.div>
            </motion.button>
        </motion.div>
    );
};
