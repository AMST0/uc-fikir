import { NextRequest, NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

// PATCH - Update product
export async function PATCH(request: NextRequest) {
    let client;
    try {
        client = await db.connect();
        const body = await request.json();
        const { productId, ...updates } = body;

        if (!productId) {
            return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
        }

        // Build update query dynamically
        const updateFields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updates.is_available !== undefined) {
            updateFields.push(`is_available = $${paramIndex++}`);
            values.push(updates.is_available ? 1 : 0);
        }

        if (updates.name_tr !== undefined) {
            updateFields.push(`name_tr = $${paramIndex++}`);
            values.push(updates.name_tr);
        }

        if (updates.name_en !== undefined) {
            updateFields.push(`name_en = $${paramIndex++}`);
            values.push(updates.name_en);
        }

        if (updates.description_tr !== undefined) {
            updateFields.push(`description_tr = $${paramIndex++}`);
            values.push(updates.description_tr);
        }

        if (updates.description_en !== undefined) {
            updateFields.push(`description_en = $${paramIndex++}`);
            values.push(updates.description_en);
        }

        if (updates.price !== undefined) {
            updateFields.push(`price = $${paramIndex++}`);
            values.push(updates.price);
        }

        if (updates.image !== undefined) {
            updateFields.push(`image = $${paramIndex++}`);
            values.push(updates.image);
        }

        if (updateFields.length === 0) {
            return NextResponse.json({ success: false, error: 'No updates provided' }, { status: 400 });
        }

        values.push(productId);
        const query = `
            UPDATE products 
            SET ${updateFields.join(', ')} 
            WHERE id = $${paramIndex}
        `;

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product updated' });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}

// POST - Create new product
export async function POST(request: NextRequest) {
    let client;
    try {
        client = await db.connect();
        const body = await request.json();
        const { categoryId, name_tr, name_en, description_tr, description_en, price, image } = body;

        if (!categoryId || !name_tr || !price) {
            return NextResponse.json({ success: false, error: 'Category ID, name, and price required' }, { status: 400 });
        }

        const id = `prod-${Date.now()}`;

        await client.sql`
            INSERT INTO products (id, category_id, name_tr, name_en, description_tr, description_en, price, image, is_available)
            VALUES (${id}, ${categoryId}, ${name_tr}, ${name_en || name_tr}, ${description_tr || ''}, ${description_en || ''}, ${price}, ${image || ''}, 1)
        `;

        return NextResponse.json({ success: true, productId: id });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}

// DELETE - Remove product
export async function DELETE(request: NextRequest) {
    let client;
    try {
        client = await db.connect();
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
        }

        const result = await client.sql`DELETE FROM products WHERE id = ${productId}`;

        if (result.rowCount === 0) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    } finally {
        if (client) client.release();
    }
}
