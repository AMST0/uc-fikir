'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { Category } from '@/types';
import { isWithinAvailabilityHours } from '@/lib/utils';

interface CategoryNavProps {
    categories: Category[];
    activeCategory: string;
    onCategoryClick: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
    categories,
    activeCategory,
    onCategoryClick,
}) => {
    const { features, language } = usePhase();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter categories based on availability (Phase 3 only)
    const visibleCategories = categories.filter((cat) => {
        if (!features.checkAvailabilityHours) return true;
        return isWithinAvailabilityHours(cat.availability_hours);
    });

    return (
        <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/50">
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto py-3 px-4 scrollbar-hide"
            >
                {visibleCategories.map((category) => (
                    <motion.button
                        key={category.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCategoryClick(category.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${activeCategory === category.id
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <span className="text-lg">{category.icon}</span>
                        <span>{category.name[language]}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
