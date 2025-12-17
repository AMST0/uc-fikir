import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, generateId } from '@/lib/database';

// POST - Record a view
export async function POST(request: NextRequest) {
    try {
        const { productId, categoryId, type } = await request.json();
        const db = getDatabase();
        const viewId = generateId();

        // Get session/IP info from headers
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const sessionId = request.cookies.get('session_id')?.value || generateId();

        if (type === 'product' && productId) {
            db.prepare(`
        INSERT INTO product_views (id, product_id, category_id, session_id, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(viewId, productId, categoryId || null, sessionId, ip, userAgent);
        } else if (type === 'category' && categoryId) {
            db.prepare(`
        INSERT INTO category_views (id, category_id, session_id, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
      `).run(viewId, categoryId, sessionId, ip, userAgent);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error recording view:', error);
        return NextResponse.json({ success: false, error: 'Failed to record view' }, { status: 500 });
    }
}

// GET - Get view statistics
export async function GET(request: NextRequest) {
    try {
        const db = getDatabase();
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || '7d';

        // Calculate date filter
        let dateFilter = '';
        if (period === '24h') {
            dateFilter = "AND created_at >= datetime('now', '-1 day')";
        } else if (period === '7d') {
            dateFilter = "AND created_at >= datetime('now', '-7 days')";
        } else if (period === '30d') {
            dateFilter = "AND created_at >= datetime('now', '-30 days')";
        }

        // Get most viewed products
        const topProducts = db.prepare(`
      SELECT 
        p.id,
        p.name_tr,
        p.name_en,
        p.image,
        p.price,
        c.name_tr as category_name,
        COUNT(pv.id) as view_count
      FROM products p
      LEFT JOIN product_views pv ON p.id = pv.product_id ${dateFilter.replace('created_at', 'pv.created_at')}
      LEFT JOIN categories c ON p.category_id = c.id
      GROUP BY p.id
      ORDER BY view_count DESC
      LIMIT 10
    `).all();

        // Get most viewed categories
        const topCategories = db.prepare(`
      SELECT 
        c.id,
        c.name_tr,
        c.name_en,
        c.icon,
        COUNT(cv.id) as view_count
      FROM categories c
      LEFT JOIN category_views cv ON c.id = cv.category_id ${dateFilter.replace('created_at', 'cv.created_at')}
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY view_count DESC
      LIMIT 10
    `).all();

        // Get total views
        const totalProductViews = db.prepare(`
      SELECT COUNT(*) as count FROM product_views WHERE 1=1 ${dateFilter}
    `).get() as { count: number };

        const totalCategoryViews = db.prepare(`
      SELECT COUNT(*) as count FROM category_views WHERE 1=1 ${dateFilter}
    `).get() as { count: number };

        // Get unique visitors (by session)
        const uniqueVisitors = db.prepare(`
      SELECT COUNT(DISTINCT session_id) as count FROM (
        SELECT session_id FROM product_views WHERE 1=1 ${dateFilter}
        UNION
        SELECT session_id FROM category_views WHERE 1=1 ${dateFilter}
      )
    `).get() as { count: number };

        return NextResponse.json({
            success: true,
            data: {
                topProducts,
                topCategories,
                stats: {
                    totalProductViews: totalProductViews.count,
                    totalCategoryViews: totalCategoryViews.count,
                    uniqueVisitors: uniqueVisitors.count
                }
            }
        });
    } catch (error) {
        console.error('Error getting views:', error);
        return NextResponse.json({ success: false, error: 'Failed to get views' }, { status: 500 });
    }
}
