import { NextRequest, NextResponse } from 'next/server';
import { sql, generateId } from '@/lib/database';

// POST - Record a view
export async function POST(request: NextRequest) {
  try {
    const { productId, categoryId, type } = await request.json();
    const viewId = generateId();

    // Get session/IP info from headers
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const sessionId = request.cookies.get('session_id')?.value || generateId();

    if (type === 'product' && productId) {
      await sql`
        INSERT INTO product_views (id, product_id, category_id, session_id, ip_address, user_agent)
        VALUES (${viewId}, ${productId}, ${categoryId || null}, ${sessionId}, ${ip}, ${userAgent})
      `;
    } else if (type === 'category' && categoryId) {
      await sql`
        INSERT INTO category_views (id, category_id, session_id, ip_address, user_agent)
        VALUES (${viewId}, ${categoryId}, ${sessionId}, ${ip}, ${userAgent})
      `;
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
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    // Calculate date filter logic for Postgres
    let interval = '7 days'; // Default
    if (period === '24h') interval = '1 day';
    else if (period === '30d') interval = '30 days';

    // Using raw SQL fragments is risky with template literals if not careful.
    // But since we use static strings based on conditioned variable, it's safe.
    // Postgres INTERVAL syntax is cleaner.

    // Get most viewed products
    // Note: For complex dynamic queries, we might need a query builder, 
    // but here we can rely on the fact that created_at is indexed and filter effectively.
    // Since sql tagged template literals sanitize inputs, we can't easily inject partial SQL string directly 
    // without helper utilities, so we'll construct the query carefully or use conditional logic.

    // However, for this simple case, we can put the interval filter directly in the SQL using Postgres syntax.
    // We'll use a hack to inject the interval string safely since it's controlled by us.

    // Actually, Vercel Postgres doesn't support dynamic table names/fragments easily without tools.
    // Let's write separate queries or use a common CTE logic if possible, 
    // OR just pass the interval string as a parameter if we construct the interval syntax right:
    // created_at >= NOW() - $1::interval

    const topProducts = await sql`
      SELECT 
        p.id,
        p.name_tr,
        p.name_en,
        p.image,
        p.price,
        c.name_tr as category_name,
        COUNT(pv.id) as view_count
      FROM products p
      LEFT JOIN product_views pv ON p.id = pv.product_id AND pv.created_at >= NOW() - ${interval}::interval
      LEFT JOIN categories c ON p.category_id = c.id
      GROUP BY p.id, p.name_tr, p.name_en, p.image, p.price, c.name_tr
      ORDER BY view_count DESC
      LIMIT 10
    `;

    // Get most viewed categories
    const topCategories = await sql`
      SELECT 
        c.id,
        c.name_tr,
        c.name_en,
        c.icon,
        COUNT(cv.id) as view_count
      FROM categories c
      LEFT JOIN category_views cv ON c.id = cv.category_id AND cv.created_at >= NOW() - ${interval}::interval
      WHERE c.is_active = 1
      GROUP BY c.id, c.name_tr, c.name_en, c.icon
      ORDER BY view_count DESC
      LIMIT 10
    `;

    // Get total views
    const totalProductViews = await sql`
      SELECT COUNT(*) as count FROM product_views WHERE created_at >= NOW() - ${interval}::interval
    `;

    const totalCategoryViews = await sql`
      SELECT COUNT(*) as count FROM category_views WHERE created_at >= NOW() - ${interval}::interval
    `;

    // Get unique visitors (by session)
    const uniqueVisitors = await sql`
      SELECT COUNT(DISTINCT session_id) as count FROM (
        SELECT session_id FROM product_views WHERE created_at >= NOW() - ${interval}::interval
        UNION
        SELECT session_id FROM category_views WHERE created_at >= NOW() - ${interval}::interval
      ) as combined_views
    `;

    return NextResponse.json({
      success: true,
      data: {
        topProducts: topProducts.rows,
        topCategories: topCategories.rows,
        stats: {
          totalProductViews: Number(totalProductViews.rows[0].count),
          totalCategoryViews: Number(totalCategoryViews.rows[0].count),
          uniqueVisitors: Number(uniqueVisitors.rows[0].count)
        }
      }
    });
  } catch (error) {
    console.error('Error getting views:', error);
    return NextResponse.json({ success: false, error: 'Failed to get views' }, { status: 500 });
  }
}
