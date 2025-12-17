'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePhase } from '@/context/PhaseContext';
import { Category, Product } from '@/types';
import { isWithinAvailabilityHours } from '@/lib/utils';
import { ProductCard } from './ProductCard';
import { Clock } from 'lucide-react';

interface CategorySectionProps {
    category: Category;
    onProductClick: (product: Product) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category, onProductClick }) => {
    const { features, language } = usePhase();

    // Check time-based availability (only in Phase 3)
    const isAvailable = features.checkAvailabilityHours
        ? isWithinAvailabilityHours(category.availability_hours)
        : true;

    // Don't render if category is not available in Phase 3
    if (!isAvailable && features.checkAvailabilityHours) {
        return null;
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className="mb-8"
        >
            {/* Category Header - Compact */}
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h2 className="text-lg font-bold text-white">{category.name[language]}</h2>
                <span className="text-gray-500 text-sm">({category.products.length})</span>

                {/* Time Indicator */}
                {category.availability_hours && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-full ml-auto">
                        <Clock size={12} className="text-amber-400" />
                        <span className="text-[10px] text-amber-400 font-medium">
                            {category.availability_hours.start}-{category.availability_hours.end}
                        </span>
                    </div>
                )}
            </div>

            {/* Products Grid - 2 columns on mobile, 3 on larger */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {category.products.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => onProductClick(product)}
                        index={index}
                    />
                ))}
            </div>
        </motion.section>
    );
};
