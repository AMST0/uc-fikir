import { getDatabase, generateId } from './database';

// Product images from Unsplash (direct CDN URLs that work)
const productImages: Record<string, string> = {
    // Kahvaltı - Turkish Breakfast
    'Serpme Kahvaltı': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    'Sahanda Yumurta': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    'Menemen': 'https://images.unsplash.com/photo-1482049016gy-16a87f7f7e?w=400&h=300&fit=crop',
    'Omlet': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=300&fit=crop',

    // Aperatifler - Appetizers  
    'Patates Kızartması': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    'Soğan Halkası': 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop',
    'Tavuk Kanat': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
    'Nachos': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop',
    'Cheese Sticks': 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&h=300&fit=crop',
    'Karışık Meze': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop',

    // Burgerler - Burgers
    'Klasik Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    'Double Burger': 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
    'Cheese Burger': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop',
    'BBQ Burger': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
    'Chicken Burger': 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop',
    'Veggie Burger': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop',

    // Pizzalar - Pizzas
    'Margherita': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    'Karışık Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    'Sucuklu Pizza': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
    'Tavuklu Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    'Ton Balıklı Pizza': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop',

    // Ana Yemekler - Main Courses
    'Izgara Köfte': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop',
    'Tavuk Şiş': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop',
    'Adana Kebap': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    'Biftek': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    'Somon Izgara': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',

    // Salatalar - Salads
    'Sezar Salata': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    'Akdeniz Salata': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    'Ton Balıklı Salata': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    'Tavuklu Salata': 'https://images.unsplash.com/photo-1604497181015-45f0c4928c83?w=400&h=300&fit=crop',

    // İçecekler - Drinks
    'Cola': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop',
    'Fanta': 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400&h=300&fit=crop',
    'Sprite': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=300&fit=crop',
    'Ayran': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    'Maden Suyu': 'https://images.unsplash.com/photo-1560023907-5f339617ea55?w=400&h=300&fit=crop',
    'Limonata': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop',
    'Ice Tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    'Türk Kahvesi': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
    'Filtre Kahve': 'https://images.unsplash.com/photo-1497515114583-f1d3c7349b22?w=400&h=300&fit=crop',
    'Cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    'Latte': 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop',
    'Çay': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop',

    // Tatlılar - Desserts
    'Cheesecake': 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop',
    'Brownie': 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop',
    'Tiramisu': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    'Sütlaç': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    'Künefe': 'https://images.unsplash.com/photo-1579954115545-a95c988ab6df?w=400&h=300&fit=crop',
    'Profiterol': 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=400&h=300&fit=crop',

    // Biralar - Beers
    'Efes Pilsen': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
    'Efes Draft': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop',
    'Tuborg Gold': 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9?w=400&h=300&fit=crop',
    'Miller': 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400&h=300&fit=crop',
    'Corona': 'https://images.unsplash.com/photo-1613063067224-8a7e68f5f2e9?w=400&h=300&fit=crop',
    'Heineken': 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400&h=300&fit=crop',

    // Kokteyller - Cocktails
    'Mojito': 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop',
    'Margarita': 'https://images.unsplash.com/photo-1556855810-ac404aa91e85?w=400&h=300&fit=crop',
    'Cosmopolitan': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
    'Long Island': 'https://images.unsplash.com/photo-1582837403819-fe9f7e185e18?w=400&h=300&fit=crop',
    'Pina Colada': 'https://images.unsplash.com/photo-1587223962930-cb7b74a6d1a8?w=400&h=300&fit=crop',
    'Sex on the Beach': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=300&fit=crop',
};

// Helper function to get image URL
function getProductImage(name: string): string {
    return productImages[name] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
}

// Seed data based on Cemil Pub style menu
export function seedDatabase() {
    const db = getDatabase();

    // Check if already seeded
    const existingRestaurant = db.prepare('SELECT id FROM restaurants WHERE slug = ?').get('cemil-pub');
    if (existingRestaurant) {
        console.log('Database already seeded');
        return;
    }

    console.log('Seeding database...');

    // Insert restaurant
    const restaurantId = 'rest-cemil';
    db.prepare(`
    INSERT INTO restaurants (id, name, slug, logo, primary_color, default_phase)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(restaurantId, 'Cemil Pub', 'cemil-pub', '/logo.png', '#e94560', 1);

    // Categories with products (based on typical pub menu)
    const categories = [
        {
            id: 'cat-kahvalti',
            name_tr: 'Kahvaltı',
            name_en: 'Breakfast',
            icon: '🍳',
            availability_start: '07:00',
            availability_end: '12:00',
            products: [
                { name_tr: 'Serpme Kahvaltı', name_en: 'Turkish Breakfast', desc_tr: 'Zengin kahvaltı tabağı, peynir çeşitleri, zeytin, reçel, bal, tereyağı, domates, salatalık', price: 350 },
                { name_tr: 'Sahanda Yumurta', name_en: 'Fried Eggs', desc_tr: 'Tereyağında sahanda yumurta, yanında ekmek', price: 85 },
                { name_tr: 'Menemen', name_en: 'Menemen', desc_tr: 'Geleneksel domates, biber ve yumurta karışımı', price: 95 },
                { name_tr: 'Omlet', name_en: 'Omelette', desc_tr: 'Kaşarlı veya karışık omlet', price: 90 },
            ]
        },
        {
            id: 'cat-aperatifler',
            name_tr: 'Aperatifler',
            name_en: 'Appetizers',
            icon: '🍟',
            products: [
                { name_tr: 'Patates Kızartması', name_en: 'French Fries', desc_tr: 'Çıtır patates kızartması, özel baharat', price: 65 },
                { name_tr: 'Soğan Halkası', name_en: 'Onion Rings', desc_tr: 'Çıtır soğan halkası, ranch sos ile', price: 75 },
                { name_tr: 'Tavuk Kanat', name_en: 'Chicken Wings', desc_tr: '8 adet baharatlı tavuk kanat, BBQ sos', price: 145 },
                { name_tr: 'Nachos', name_en: 'Nachos', desc_tr: 'Meksika usulü nachos, peynir sos, jalapeno', price: 120 },
                { name_tr: 'Cheese Sticks', name_en: 'Cheese Sticks', desc_tr: 'Çıtır peynir çubukları, tatlı biber sos', price: 95 },
                { name_tr: 'Karışık Meze', name_en: 'Mixed Meze', desc_tr: 'Humus, babaganuş, atom, acılı ezme', price: 180 },
            ]
        },
        {
            id: 'cat-burgerler',
            name_tr: 'Burgerler',
            name_en: 'Burgers',
            icon: '🍔',
            products: [
                { name_tr: 'Klasik Burger', name_en: 'Classic Burger', desc_tr: '150gr dana köfte, marul, domates, turşu, cheddar', price: 165 },
                { name_tr: 'Double Burger', name_en: 'Double Burger', desc_tr: '2x150gr dana köfte, double cheddar, özel sos', price: 225 },
                { name_tr: 'Cheese Burger', name_en: 'Cheese Burger', desc_tr: '150gr dana köfte, double cheddar, karamelize soğan', price: 175 },
                { name_tr: 'BBQ Burger', name_en: 'BBQ Burger', desc_tr: '150gr dana köfte, bacon, BBQ sos, cheddar', price: 195 },
                { name_tr: 'Chicken Burger', name_en: 'Chicken Burger', desc_tr: 'Izgara tavuk göğsü, marul, domates, mayo', price: 155 },
                { name_tr: 'Veggie Burger', name_en: 'Veggie Burger', desc_tr: 'Sebze köftesi, avokado, taze sebzeler', price: 145, available: false },
            ]
        },
        {
            id: 'cat-pizzalar',
            name_tr: 'Pizzalar',
            name_en: 'Pizzas',
            icon: '🍕',
            products: [
                { name_tr: 'Margherita', name_en: 'Margherita', desc_tr: 'Domates sos, mozzarella, fesleğen', price: 145 },
                { name_tr: 'Karışık Pizza', name_en: 'Mixed Pizza', desc_tr: 'Sucuk, sosis, mantar, biber, zeytin', price: 185 },
                { name_tr: 'Sucuklu Pizza', name_en: 'Sucuk Pizza', desc_tr: 'Bol sucuk, kaşar peyniri', price: 175 },
                { name_tr: 'Tavuklu Pizza', name_en: 'Chicken Pizza', desc_tr: 'Izgara tavuk, mısır, mantar', price: 180 },
                { name_tr: 'Ton Balıklı Pizza', name_en: 'Tuna Pizza', desc_tr: 'Ton balığı, soğan, mısır', price: 175 },
            ]
        },
        {
            id: 'cat-anaYemekler',
            name_tr: 'Ana Yemekler',
            name_en: 'Main Courses',
            icon: '🍽️',
            products: [
                { name_tr: 'Izgara Köfte', name_en: 'Grilled Meatballs', desc_tr: '200gr ızgara köfte, pilav, salata', price: 195 },
                { name_tr: 'Tavuk Şiş', name_en: 'Chicken Skewer', desc_tr: 'Marine tavuk şiş, pilav, közlenmiş sebze', price: 175 },
                { name_tr: 'Adana Kebap', name_en: 'Adana Kebab', desc_tr: 'Acılı Adana kebap, lavaş, közlenmiş domates', price: 220 },
                { name_tr: 'Biftek', name_en: 'Steak', desc_tr: '250gr dana biftek, patates püresi, mantar sos', price: 320, available: false },
                { name_tr: 'Somon Izgara', name_en: 'Grilled Salmon', desc_tr: 'Izgara somon fileto, sebzeli pilav', price: 280 },
            ]
        },
        {
            id: 'cat-salatalar',
            name_tr: 'Salatalar',
            name_en: 'Salads',
            icon: '🥗',
            products: [
                { name_tr: 'Sezar Salata', name_en: 'Caesar Salad', desc_tr: 'Marul, parmesan, kruton, sezar sos', price: 95 },
                { name_tr: 'Akdeniz Salata', name_en: 'Mediterranean Salad', desc_tr: 'Roka, cherry domates, beyaz peynir, ceviz', price: 85 },
                { name_tr: 'Ton Balıklı Salata', name_en: 'Tuna Salad', desc_tr: 'Yeşillik, ton balığı, mısır, zeytin', price: 110 },
                { name_tr: 'Tavuklu Salata', name_en: 'Chicken Salad', desc_tr: 'Izgara tavuk, yeşillik, avokado', price: 120 },
            ]
        },
        {
            id: 'cat-icecekler',
            name_tr: 'İçecekler',
            name_en: 'Drinks',
            icon: '🥤',
            products: [
                { name_tr: 'Cola', name_en: 'Cola', desc_tr: '330ml kutu', price: 35 },
                { name_tr: 'Fanta', name_en: 'Fanta', desc_tr: '330ml kutu', price: 35 },
                { name_tr: 'Sprite', name_en: 'Sprite', desc_tr: '330ml kutu', price: 35 },
                { name_tr: 'Ayran', name_en: 'Ayran', desc_tr: 'Taze ayran', price: 25 },
                { name_tr: 'Maden Suyu', name_en: 'Mineral Water', desc_tr: 'Sade veya limonlu', price: 20 },
                { name_tr: 'Limonata', name_en: 'Lemonade', desc_tr: 'Ev yapımı taze limonata', price: 45 },
                { name_tr: 'Ice Tea', name_en: 'Ice Tea', desc_tr: 'Şeftali veya limon', price: 40 },
                { name_tr: 'Türk Kahvesi', name_en: 'Turkish Coffee', desc_tr: 'Geleneksel Türk kahvesi', price: 45 },
                { name_tr: 'Filtre Kahve', name_en: 'Filter Coffee', desc_tr: 'Taze demlenmiş filtre kahve', price: 50 },
                { name_tr: 'Cappuccino', name_en: 'Cappuccino', desc_tr: 'Espresso, süt köpüğü', price: 60 },
                { name_tr: 'Latte', name_en: 'Latte', desc_tr: 'Espresso, sıcak süt', price: 60 },
                { name_tr: 'Çay', name_en: 'Tea', desc_tr: 'Demlik çay', price: 15 },
            ]
        },
        {
            id: 'cat-tatlilar',
            name_tr: 'Tatlılar',
            name_en: 'Desserts',
            icon: '🍰',
            products: [
                { name_tr: 'Cheesecake', name_en: 'Cheesecake', desc_tr: 'New York usulü cheesecake, meyveli sos', price: 85 },
                { name_tr: 'Brownie', name_en: 'Brownie', desc_tr: 'Sıcak çikolatalı brownie, dondurma ile', price: 75 },
                { name_tr: 'Tiramisu', name_en: 'Tiramisu', desc_tr: 'İtalyan usulü tiramisu', price: 80 },
                { name_tr: 'Sütlaç', name_en: 'Rice Pudding', desc_tr: 'Fırında sütlaç', price: 55 },
                { name_tr: 'Künefe', name_en: 'Kunefe', desc_tr: 'Antep usulü künefe, dondurma ile', price: 95 },
                { name_tr: 'Profiterol', name_en: 'Profiterole', desc_tr: 'Çikolata soslu profiterol', price: 70 },
            ]
        },
        {
            id: 'cat-biralar',
            name_tr: 'Biralar',
            name_en: 'Beers',
            icon: '🍺',
            products: [
                { name_tr: 'Efes Pilsen', name_en: 'Efes Pilsen', desc_tr: '500ml şişe', price: 85 },
                { name_tr: 'Efes Draft', name_en: 'Efes Draft', desc_tr: '400ml fıçı bira', price: 75 },
                { name_tr: 'Tuborg Gold', name_en: 'Tuborg Gold', desc_tr: '500ml şişe', price: 85 },
                { name_tr: 'Miller', name_en: 'Miller', desc_tr: '500ml şişe', price: 95 },
                { name_tr: 'Corona', name_en: 'Corona', desc_tr: '355ml şişe', price: 120 },
                { name_tr: 'Heineken', name_en: 'Heineken', desc_tr: '500ml şişe', price: 110 },
            ]
        },
        {
            id: 'cat-kokteyller',
            name_tr: 'Kokteyller',
            name_en: 'Cocktails',
            icon: '🍹',
            products: [
                { name_tr: 'Mojito', name_en: 'Mojito', desc_tr: 'Rom, nane, lime, soda', price: 145 },
                { name_tr: 'Margarita', name_en: 'Margarita', desc_tr: 'Tekila, triple sec, lime', price: 155 },
                { name_tr: 'Cosmopolitan', name_en: 'Cosmopolitan', desc_tr: 'Vodka, triple sec, cranberry', price: 150 },
                { name_tr: 'Long Island', name_en: 'Long Island', desc_tr: 'Vodka, rom, cin, tekila, triple sec', price: 175 },
                { name_tr: 'Pina Colada', name_en: 'Pina Colada', desc_tr: 'Rom, hindistan cevizi, ananas', price: 145 },
                { name_tr: 'Sex on the Beach', name_en: 'Sex on the Beach', desc_tr: 'Vodka, şeftali likörü, portakal, cranberry', price: 150 },
            ]
        },
    ];

    // Insert categories and products
    const insertCategory = db.prepare(`
    INSERT INTO categories (id, restaurant_id, name_tr, name_en, icon, sort_order, availability_start, availability_end)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const insertProduct = db.prepare(`
    INSERT INTO products (id, category_id, name_tr, name_en, description_tr, description_en, price, image, is_available, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    categories.forEach((cat, catIndex) => {
        insertCategory.run(
            cat.id,
            restaurantId,
            cat.name_tr,
            cat.name_en,
            cat.icon,
            catIndex,
            cat.availability_start || null,
            cat.availability_end || null
        );

        cat.products.forEach((prod, prodIndex) => {
            const productId = `prod-${cat.id.replace('cat-', '')}-${prodIndex}`;
            insertProduct.run(
                productId,
                cat.id,
                prod.name_tr,
                prod.name_en,
                prod.desc_tr,
                prod.desc_tr,
                prod.price,
                getProductImage(prod.name_tr),
                (prod as any).available !== false ? 1 : 0,
                prodIndex
            );
        });
    });

    console.log('Database seeded successfully!');
}

// Get all categories with products
export function getCategoriesWithProducts(restaurantId: string = 'rest-cemil') {
    const db = getDatabase();

    const categories = db.prepare(`
    SELECT * FROM categories 
    WHERE restaurant_id = ? AND is_active = 1 
    ORDER BY sort_order
  `).all(restaurantId) as {
        id: string;
        name_tr: string;
        name_en: string;
        icon: string;
        availability_start: string | null;
        availability_end: string | null;
    }[];

    return categories.map(cat => {
        const products = db.prepare(`
      SELECT * FROM products 
      WHERE category_id = ? 
      ORDER BY sort_order
    `).all(cat.id) as {
            id: string;
            name_tr: string;
            name_en: string;
            description_tr: string;
            description_en: string;
            price: number;
            image: string;
            is_available: number;
        }[];

        return {
            id: cat.id,
            name: { tr: cat.name_tr, en: cat.name_en || cat.name_tr },
            icon: cat.icon,
            availability_hours: cat.availability_start && cat.availability_end
                ? { start: cat.availability_start, end: cat.availability_end }
                : undefined,
            products: products.map(p => ({
                id: p.id,
                name: { tr: p.name_tr, en: p.name_en || p.name_tr },
                description: { tr: p.description_tr, en: p.description_en || p.description_tr },
                price: p.price,
                image: p.image,
                is_available: p.is_available === 1,
            }))
        };
    });
}

// Create order
export function createOrder(
    restaurantId: string,
    tableNumber: string,
    items: { productId: string; quantity: number; unitPrice: number }[],
    notes?: string
) {
    const db = getDatabase();
    const orderId = generateId();
    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    db.prepare(`
    INSERT INTO orders (id, restaurant_id, table_number, total, notes)
    VALUES (?, ?, ?, ?, ?)
  `).run(orderId, restaurantId, tableNumber, total, notes || null);

    const insertItem = db.prepare(`
    INSERT INTO order_items (id, order_id, product_id, quantity, unit_price)
    VALUES (?, ?, ?, ?, ?)
  `);

    items.forEach(item => {
        insertItem.run(generateId(), orderId, item.productId, item.quantity, item.unitPrice);
    });

    return { orderId, total };
}

// Get orders
export function getOrders(restaurantId: string = 'rest-cemil') {
    const db = getDatabase();

    const orders = db.prepare(`
    SELECT o.*, 
           (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
    FROM orders o
    WHERE o.restaurant_id = ?
    ORDER BY o.created_at DESC
    LIMIT 50
  `).all(restaurantId);

    return orders;
}

// Update order status
export function updateOrderStatus(orderId: string, status: string) {
    const db = getDatabase();
    db.prepare(`
    UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).run(status, orderId);
}
