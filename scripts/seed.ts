import { pool } from '../src/lib/db';
import { products } from '../src/lib/product-data';

async function seed() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting seed...');

    // 1. Create Tables
    console.log('Creating tables...');
    await client.query(`
      DROP TABLE IF EXISTS product_variants;
      DROP TABLE IF EXISTS products;

      CREATE TABLE products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tag TEXT,
        base_price NUMERIC NOT NULL,
        currency TEXT DEFAULT '₹',
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        seo_keywords TEXT[]
      );

      CREATE TABLE product_variants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id TEXT REFERENCES products(id),
        size TEXT,
        price NUMERIC NOT NULL,
        image_url TEXT,
        type TEXT,
        stock INTEGER DEFAULT 100
      );
    `);

    // 2. Insert Data
    console.log('Inserting data...');

    for (const product of products) {
      // Insert Product
      await client.query(`
        INSERT INTO products (id, name, tag, base_price, currency, description, image_url, seo_keywords)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        product.id,
        product.name,
        product.tag,
        product.basePrice,
        product.currency,
        product.description,
        product.image,
        product.seoKeywords
      ]);

      // Insert Variants
      for (const variant of product.variants) {
        await client.query(`
          INSERT INTO product_variants (product_id, size, price, image_url, type)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          product.id,
          variant.size,
          variant.price,
          variant.image,
          variant.type
        ]);
      }
    }

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Errors seeding database:', error);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
