import { NextResponse } from 'next/server';
import { seedDatabase, getCategoriesWithProducts } from '@/lib/db-operations';

// Seed database on first request
let isSeeded = false;

export async function GET() {
    try {
        // Seed database if not already seeded
        if (!isSeeded) {
            seedDatabase();
            isSeeded = true;
        }

        const categories = getCategoriesWithProducts();

        return NextResponse.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
