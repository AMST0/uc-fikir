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
} else {
    console.error('.env file not found!');
    process.exit(1);
}

async function check() {
    console.log('Checking database...');
    let client;
    try {
        client = await db.connect();

        // Check Restaurants ID
        const restaurants = await client.sql`SELECT id, name FROM restaurants`;
        console.log('Restaurants:', restaurants.rows);

        // Check Categories is_active
        const categories = await client.sql`SELECT id, name_tr, is_active FROM categories`;
        console.log('Categories:', categories.rows);

    } catch (error) {
        console.error('Error checking database:', error);
    } finally {
        if (client) client.release();
    }
}

check();
