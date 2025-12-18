// Utility functions for Uç Fikir Digital Menu Platform
import { AvailabilityHours, Phase, PhaseFeatures } from '@/types';

/**
 * Check if current time is within availability hours
 */
export const isWithinAvailabilityHours = (hours?: AvailabilityHours): boolean => {
    if (!hours) return true; // No restriction = always available

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = hours.start.split(':').map(Number);
    const [endHour, endMin] = hours.end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

/**
 * Get features enabled for each phase
 */
export const getPhaseFeatures = (phase: Phase): PhaseFeatures => {
    switch (phase) {
        case 1:
            return {
                showAddToCart: false,
                showCart: false,
                showUpsells: false,
                showStockStatus: false,
                checkAvailabilityHours: false,
                showWaiterButton: false,
                enableAnalytics: false,
                showReviewFunnel: false,
            };
        case 2:
            return {
                showAddToCart: false,
                showCart: false,
                showUpsells: false,
                showStockStatus: false,
                checkAvailabilityHours: false,
                showWaiterButton: false,
                enableAnalytics: true,
                showReviewFunnel: true,
            };
        case 3:
            return {
                showAddToCart: true,
                showCart: true,
                showUpsells: true,
                showStockStatus: true,
                checkAvailabilityHours: true,
                showWaiterButton: true,
                enableAnalytics: true,
                showReviewFunnel: true,
            };
    }
};

/**
 * Format price with currency
 */
export const formatPrice = (price: number | string, currency: string = '₺'): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return `0.00 ${currency}`;
    return `${numPrice.toFixed(2)} ${currency}`;
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};
