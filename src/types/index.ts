// Type definitions for Uç Fikir Digital Menu Platform

export interface Translation {
    tr: string;
    en: string;
}

export interface Product {
    id: string;
    name: Translation;
    description: Translation;
    price: number;
    image: string;
    is_available: boolean;
    related_products?: string[]; // Product IDs for upsell
}

export interface AvailabilityHours {
    start: string; // e.g., "07:00"
    end: string;   // e.g., "11:00"
}

export interface Category {
    id: string;
    name: Translation;
    icon: string;
    availability_hours?: AvailabilityHours;
    products: Product[];
}

export interface Restaurant {
    id: string;
    name: string;
    slug: string;
    logo: string;
    theme: {
        primaryColor: string;
        accentColor: string;
    };
    categories: Category[];
    defaultPhase: 1 | 2 | 3;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface PhaseFeatures {
    showAddToCart: boolean;
    showCart: boolean;
    showUpsells: boolean;
    showStockStatus: boolean;
    checkAvailabilityHours: boolean;
    showWaiterButton: boolean;
    enableAnalytics: boolean;
    showReviewFunnel: boolean;
}

export type Phase = 1 | 2 | 3;
