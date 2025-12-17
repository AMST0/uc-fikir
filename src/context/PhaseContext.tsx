'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Phase, PhaseFeatures, CartItem, Product } from '@/types';
import { getPhaseFeatures } from '@/lib/utils';
import { mockRestaurant } from '@/lib/mockData';

interface PhaseContextType {
    currentPhase: Phase;
    setPhase: (phase: Phase) => void;
    features: PhaseFeatures;
    // Cart state (for Phase 3)
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    // Toast state
    toast: { message: string; visible: boolean };
    showToast: (message: string) => void;
    // Language
    language: 'tr' | 'en';
    setLanguage: (lang: 'tr' | 'en') => void;
    // Table Number
    tableNumber: string;
    setTableNumber: (number: string) => void;
    hasSetTable: boolean;
}

const PhaseContext = createContext<PhaseContextType | undefined>(undefined);

export const usePhase = () => {
    const context = useContext(PhaseContext);
    if (!context) {
        throw new Error('usePhase must be used within a PhaseProvider');
    }
    return context;
};

interface PhaseProviderProps {
    children: React.ReactNode;
}

export const PhaseProvider: React.FC<PhaseProviderProps> = ({ children }) => {
    // Initialize phase from mock data
    const [currentPhase, setCurrentPhase] = useState<Phase>(mockRestaurant.defaultPhase);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [toast, setToast] = useState({ message: '', visible: false });
    const [language, setLanguage] = useState<'tr' | 'en'>('tr');
    const [tableNumber, setTableNumberState] = useState<string>('');
    const [hasSetTable, setHasSetTable] = useState(false);

    const features = getPhaseFeatures(currentPhase);

    const setPhase = useCallback((phase: Phase) => {
        setCurrentPhase(phase);

        // Show toast with phase description
        const phaseDescriptions = {
            1: 'Phase 1: Dijital Vitrin - Kategoriler, Ürünler, Temel Görünüm',
            2: 'Phase 2: Analitik - + Analitik Hooks, Değerlendirme Popup',
            3: 'Phase 3: Tam Ticaret - + Sipariş, Upsell, Stok, Zamanlı Menü',
        };

        showToast(phaseDescriptions[phase]);
    }, []);

    const showToast = useCallback((message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => {
            setToast({ message: '', visible: false });
        }, 3000);
    }, []);

    const setTableNumber = useCallback((number: string) => {
        setTableNumberState(number);
        setHasSetTable(true);
        if (number) {
            showToast(`Masa ${number} olarak ayarlandı`);
        }
    }, [showToast]);

    const addToCart = useCallback((product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
        showToast(`${product.name.tr} sepete eklendi!`);
    }, [showToast]);

    const removeFromCart = useCallback((productId: string) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const cartTotal = cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    return (
        <PhaseContext.Provider
            value={{
                currentPhase,
                setPhase,
                features,
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                toast,
                showToast,
                language,
                setLanguage,
                tableNumber,
                setTableNumber,
                hasSetTable,
            }}
        >
            {children}
        </PhaseContext.Provider>
    );
};

