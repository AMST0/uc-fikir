import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, updateOrderStatus } from '@/lib/db-operations';

// GET orders
export async function GET() {
    try {
        const orders = await getOrders();

        return NextResponse.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

// POST new order
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tableNumber, items, notes } = body;

        if (!tableNumber || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid order data' },
                { status: 400 }
            );
        }

        const result = await createOrder('rest-cemil', tableNumber, items, notes);

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        );
    }
}

// PATCH update order status
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json(
                { success: false, error: 'Order ID and status required' },
                { status: 400 }
            );
        }

        await updateOrderStatus(orderId, status);

        return NextResponse.json({
            success: true,
            message: 'Order status updated'
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
