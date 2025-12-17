import { sql } from '@vercel/postgres';

// Ensure database tables exist
export async function initializeDatabase() {
  try {
    // Enable UUID extension if needed, though we generate random strings in JS
    // await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    // Restaurants table
    await sql`
      CREATE TABLE IF NOT EXISTS restaurants (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        logo TEXT,
        primary_color VARCHAR(50) DEFAULT '#e94560',
        accent_color VARCHAR(50) DEFAULT '#1a1a2e',
        default_phase INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        restaurant_id VARCHAR(50) NOT NULL,
        name_tr VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        icon VARCHAR(50),
        sort_order INTEGER DEFAULT 0,
        availability_start VARCHAR(10),
        availability_end VARCHAR(10),
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
      );
    `;

    // Products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        category_id VARCHAR(50) NOT NULL,
        name_tr VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        description_tr TEXT,
        description_en TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image TEXT,
        is_available INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `;

    // Related products
    await sql`
      CREATE TABLE IF NOT EXISTS related_products (
        product_id VARCHAR(50) NOT NULL,
        related_product_id VARCHAR(50) NOT NULL,
        PRIMARY KEY (product_id, related_product_id),
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (related_product_id) REFERENCES products(id)
      );
    `;

    // Orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        restaurant_id VARCHAR(50) NOT NULL,
        table_number VARCHAR(20),
        status VARCHAR(20) DEFAULT 'pending',
        total DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
      );
    `;

    // Order items
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `;

    // Product views
    await sql`
      CREATE TABLE IF NOT EXISTS product_views (
        id VARCHAR(50) PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL,
        category_id VARCHAR(50),
        session_id VARCHAR(100),
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `;

    // Category views
    await sql`
      CREATE TABLE IF NOT EXISTS category_views (
        id VARCHAR(50) PRIMARY KEY,
        category_id VARCHAR(50) NOT NULL,
        session_id VARCHAR(100),
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `;

    // Indexes
    // Note: Postgres creates indexes on primary keys automatically.
    // We add explicit indexes for foreign keys + commonly queried fields.
    await sql`CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON categories(restaurant_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_views_product ON product_views(product_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_product_views_date ON product_views(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_category_views_category ON category_views(category_id)`;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper to generate IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export { sql };
