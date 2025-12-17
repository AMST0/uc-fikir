import { NextResponse } from 'next/server';
import { seedDatabase, getCategoriesWithProducts } from '@/lib/db-operations';
import fs from 'fs';
import path from 'path';

// Seed database on first request
let isSeeded = false;

export async function GET() {
    const logPath = path.join(process.cwd(), 'api-debug.log');
    const log = (msg: string) => {
        try {
            fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
        } catch (e) { console.error(e); }
    };

    try {
        log('API /api/menu called');

        // Seed database if not already seeded
        if (!isSeeded) {
            log('Checking seed status...');
            await seedDatabase();
            isSeeded = true;
            log('Seed check passed');
        }

        log('Calling getCategoriesWithProducts...');
        const categories = await getCategoriesWithProducts();
        log(`Categories fetched: ${JSON.stringify(categories, null, 2)}`); // Detaylı log

        return NextResponse.json({
            success: true,
            data: categories
        });
    } catch (error) {
        log(`Error fetching categories: ${error}`);
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
