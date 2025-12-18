const { db } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

async function analyzeOrders() {
    console.log('Analyzing orders...');
    let client;
    try {
        client = await db.connect();

        // Count
        const countRes = await client.sql`SELECT COUNT(*) FROM orders`;
        console.log('Total Orders:', countRes.rows[0].count);

        // Date range
        const dateRes = await client.sql`SELECT MIN(created_at) as first, MAX(created_at) as last FROM orders`;
        console.log('Date Range:', dateRes.rows[0]);

        // Status distribution
        const statusRes = await client.sql`SELECT status, COUNT(*) FROM orders GROUP BY status`;
        console.log('Status Distribution:', statusRes.rows);

        // Average total
        const avgRes = await client.sql`SELECT AVG(total) as avg_total, MIN(total) as min_total, MAX(total) as max_total FROM orders`;
        console.log('Amounts:', avgRes.rows[0]);

        // Validating if table numbers look fake (e.g. all "Table 1")
        const tableRes = await client.sql`SELECT table_number, COUNT(*) FROM orders GROUP BY table_number ORDER BY count DESC LIMIT 5`;
        console.log('Top Tables:', tableRes.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (client) client.release();
    }
}

analyzeOrders();
