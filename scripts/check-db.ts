import { pool } from '../src/lib/db';

async function check() {
    const client = await pool.connect();
    try {
        console.log('Checking database...');

        // Check Products
        const products = await client.query('SELECT id, name, image_url FROM products');
        console.log(`Found ${products.rows.length} products:`);
        products.rows.forEach(p => console.log(`- ${p.id}: ${p.name} (Img: ${p.image_url})`));

        // Check Variants for one product
        if (products.rows.length > 0) {
            const pid = products.rows[0].id;
            const variants = await client.query('SELECT size, image_url FROM product_variants WHERE product_id = $1', [pid]);
            console.log(`\nVariants for ${pid}:`);
            variants.rows.forEach(v => console.log(`- ${v.size}: Img: ${v.image_url}`));
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        client.release();
        pool.end();
    }
}

check();
