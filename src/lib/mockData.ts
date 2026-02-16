// Mock data for piiyuu Digital Menu Platform
import { Restaurant } from '@/types';

export const mockRestaurant: Restaurant = {
    id: 'rest-001',
    name: 'piiyuu',
    slug: 'piiyuu',
    logo: '/piiyuu-logo-koyu-yazi.svg',
    theme: {
        primaryColor: '#1a1a2e',
        accentColor: '#f47622',
    },
    defaultPhase: 1,
    categories: [
        {
            id: 'cat-breakfast',
            name: { tr: 'Kahvaltı', en: 'Breakfast' },
            icon: '🍳',
            availability_hours: { start: '07:00', end: '11:00' },
            products: [
                {
                    id: 'prod-001',
                    name: { tr: 'Serpme Kahvaltı', en: 'Turkish Breakfast Spread' },
                    description: {
                        tr: 'Zengin Türk kahvaltısı tabağı, peynir çeşitleri, zeytin, bal, kaymak ve taze ekmek ile',
                        en: 'Rich Turkish breakfast platter with cheese variety, olives, honey, cream and fresh bread',
                    },
                    price: 189.99,
                    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
                    is_available: true,
                    related_products: ['prod-006', 'prod-007'],
                },
                {
                    id: 'prod-002',
                    name: { tr: 'Menemen', en: 'Turkish Scrambled Eggs' },
                    description: {
                        tr: 'Geleneksel domates, biber ve yumurta karışımı',
                        en: 'Traditional tomato, pepper and egg mixture',
                    },
                    price: 79.99,
                    image: 'https://images.unsplash.com/photo-1482049016gy?w=400&h=300&fit=crop',
                    is_available: true,
                },
            ],
        },
        {
            id: 'cat-burgers',
            name: { tr: 'Burgerler', en: 'Burgers' },
            icon: '🍔',
            // No availability_hours = always available
            products: [
                {
                    id: 'prod-003',
                    name: { tr: 'Double Burger', en: 'Double Burger' },
                    description: {
                        tr: '200gr iki kat ızgara köfte, cheddar peyniri, özel sos, marul, domates',
                        en: '200gr double grilled patty, cheddar cheese, special sauce, lettuce, tomato',
                    },
                    price: 149.99,
                    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
                    is_available: true,
                    related_products: ['prod-005', 'prod-006'],
                },
                {
                    id: 'prod-004',
                    name: { tr: 'Special Steak Burger', en: 'Special Steak Burger' },
                    description: {
                        tr: 'Premium dana eti, truffle mayonez, karamelize soğan, özel ekmek',
                        en: 'Premium beef, truffle mayo, caramelized onion, artisan bun',
                    },
                    price: 229.99,
                    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop',
                    is_available: false, // SOLD OUT - for testing Phase 3 stock logic
                    related_products: ['prod-005', 'prod-006'],
                },
                {
                    id: 'prod-008',
                    name: { tr: 'Klasik Cheeseburger', en: 'Classic Cheeseburger' },
                    description: {
                        tr: '150gr ızgara köfte, cheddar, turşu, hardal, ketçap',
                        en: '150gr grilled patty, cheddar, pickles, mustard, ketchup',
                    },
                    price: 109.99,
                    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=300&fit=crop',
                    is_available: true,
                    related_products: ['prod-005', 'prod-006'],
                },
            ],
        },
        {
            id: 'cat-drinks',
            name: { tr: 'İçecekler', en: 'Drinks' },
            icon: '🥤',
            products: [
                {
                    id: 'prod-005',
                    name: { tr: 'Cola', en: 'Cola' },
                    description: {
                        tr: 'Soğuk kola 330ml',
                        en: 'Cold cola 330ml',
                    },
                    price: 29.99,
                    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop',
                    is_available: true,
                },
                {
                    id: 'prod-006',
                    name: { tr: 'Taze Portakal Suyu', en: 'Fresh Orange Juice' },
                    description: {
                        tr: 'Taze sıkılmış portakal suyu 300ml',
                        en: 'Freshly squeezed orange juice 300ml',
                    },
                    price: 49.99,
                    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
                    is_available: true,
                },
                {
                    id: 'prod-007',
                    name: { tr: 'Türk Çayı', en: 'Turkish Tea' },
                    description: {
                        tr: 'Geleneksel demlikten Türk çayı',
                        en: 'Traditional Turkish tea from teapot',
                    },
                    price: 19.99,
                    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop',
                    is_available: true,
                },
            ],
        },
        {
            id: 'cat-desserts',
            name: { tr: 'Tatlılar', en: 'Desserts' },
            icon: '🍰',
            products: [
                {
                    id: 'prod-009',
                    name: { tr: 'Künefe', en: 'Kunefe' },
                    description: {
                        tr: 'Geleneksel Antep usulü künefe, dondurma ile',
                        en: 'Traditional Antep style kunefe with ice cream',
                    },
                    price: 89.99,
                    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=300&fit=crop',
                    is_available: true,
                },
                {
                    id: 'prod-010',
                    name: { tr: 'Cheesecake', en: 'Cheesecake' },
                    description: {
                        tr: 'New York usulü cheesecake, meyveli sos ile',
                        en: 'New York style cheesecake with berry sauce',
                    },
                    price: 69.99,
                    image: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400&h=300&fit=crop',
                    is_available: true,
                    related_products: ['prod-006', 'prod-007'],
                },
            ],
        },
    ],
};

// Translation strings
export const translations = {
    tr: {
        menu: 'Menü',
        addToCart: 'Sepete Ekle',
        soldOut: 'Tükendi',
        callWaiter: 'Garson Çağır',
        cart: 'Sepet',
        total: 'Toplam',
        orderNow: 'Sipariş Ver',
        categories: 'Kategoriler',
        relatedProducts: 'Bunları da beğenebilirsiniz',
        close: 'Kapat',
        currency: '₺',
        unavailable: 'Bu saat diliminde servis dışı',
        reviewTitle: 'Deneyiminizi Değerlendirin',
        reviewSubtitle: 'Görüşleriniz bizim için çok değerli!',
        rateUs: 'Bizi Puanlayın',
        later: 'Daha Sonra',
    },
    en: {
        menu: 'Menu',
        addToCart: 'Add to Cart',
        soldOut: 'Sold Out',
        callWaiter: 'Call Waiter',
        cart: 'Cart',
        total: 'Total',
        orderNow: 'Order Now',
        categories: 'Categories',
        relatedProducts: 'You might also like',
        close: 'Close',
        currency: '₺',
        unavailable: 'Not available at this time',
        reviewTitle: 'Rate Your Experience',
        reviewSubtitle: 'Your feedback is valuable to us!',
        rateUs: 'Rate Us',
        later: 'Later',
    },
};

// Helper to get all products as a flat array
export const getAllProducts = () => {
    return mockRestaurant.categories.flatMap((cat) => cat.products);
};

// Helper to get product by ID
export const getProductById = (id: string) => {
    return getAllProducts().find((p) => p.id === id);
};
