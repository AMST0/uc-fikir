import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db-operations';

// POST to seed/reset database
export async function POST() {
    try {
        // Force reseed by dropping existing data first
        const { getDatabase } = await import('@/lib/database');
        const db = getDatabase();

        // Clear existing data
        db.exec(`
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM related_products;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM restaurants;
    `);

        // Reseed
        seedDatabase();

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully'
        });
    } catch (error) {
        console.error('Error seeding database:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed database' },
            { status: 500 }
        );
    }
}
