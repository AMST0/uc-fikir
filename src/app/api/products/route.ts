import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

// PATCH - Update product
export async function PATCH(request: NextRequest) {
    try {
        const db = getDatabase();
        const body = await request.json();
        const { productId, ...updates } = body;

        if (!productId) {
            return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
        }

        // Build update query dynamically
        const updateFields: string[] = [];
        const values: any[] = [];

        if (updates.is_available !== undefined) {
            updateFields.push('is_available = ?');
            values.push(updates.is_available ? 1 : 0);
        }

        if (updates.name_tr !== undefined) {
            updateFields.push('name_tr = ?');
            values.push(updates.name_tr);
        }

        if (updates.name_en !== undefined) {
            updateFields.push('name_en = ?');
            values.push(updates.name_en);
        }

        if (updates.description_tr !== undefined) {
            updateFields.push('description_tr = ?');
            values.push(updates.description_tr);
        }

        if (updates.description_en !== undefined) {
            updateFields.push('description_en = ?');
            values.push(updates.description_en);
        }

        if (updates.price !== undefined) {
            updateFields.push('price = ?');
            values.push(updates.price);
        }

        if (updates.image !== undefined) {
            updateFields.push('image = ?');
            values.push(updates.image);
        }

        if (updateFields.length === 0) {
            return NextResponse.json({ success: false, error: 'No updates provided' }, { status: 400 });
        }

        values.push(productId);

        const stmt = db.prepare(`
            UPDATE products 
            SET ${updateFields.join(', ')} 
            WHERE id = ?
        `);

        const result = stmt.run(...values);

        if (result.changes === 0) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product updated' });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }
}

// POST - Create new product
export async function POST(request: NextRequest) {
    try {
        const db = getDatabase();
        const body = await request.json();
        const { categoryId, name_tr, name_en, description_tr, description_en, price, image } = body;

        if (!categoryId || !name_tr || !price) {
            return NextResponse.json({ success: false, error: 'Category ID, name, and price required' }, { status: 400 });
        }

        const id = `prod-${Date.now()}`;

        const stmt = db.prepare(`
            INSERT INTO products (id, category_id, name_tr, name_en, description_tr, description_en, price, image, is_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `);

        stmt.run(id, categoryId, name_tr, name_en || name_tr, description_tr || '', description_en || '', price, image || '');

        return NextResponse.json({ success: true, productId: id });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
    }
}

// DELETE - Remove product
export async function DELETE(request: NextRequest) {
    try {
        const db = getDatabase();
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
        }

        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        const result = stmt.run(productId);

        if (result.changes === 0) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }
}
