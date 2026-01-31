'use server';

import { pool } from '@/lib/db';

export type ProductVariant = {
    id: string;
    product_id: string;
    size: string;
    price: number;
    image_url: string;
    type?: string;
    stock?: number;
};

export type Product = {
    id: string;
    name: string;
    tag?: string;
    base_price: number;
    currency: string;
    description?: string;
    image_url: string;
    variants?: ProductVariant[];
};

export async function getProducts(): Promise<Product[]> {
    const client = await pool.connect();
    try {
        const res = await client.query(`
      SELECT 
        p.*,
        json_agg(
          json_build_object(
            'id', v.id,
            'size', v.size,
            'price', v.price,
            'image_url', v.image_url,
            'type', v.type
          )
        ) as variants
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.product_id
      GROUP BY p.id
    `);
        return res.rows;
    } finally {
        client.release();
    }
}

export async function getProduct(slug: string): Promise<Product | null> {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM products WHERE id = $1', [slug]);
        if (res.rows.length === 0) return null;

        const product = res.rows[0];
        const variantsRes = await client.query('SELECT * FROM product_variants WHERE product_id = $1', [slug]);

        return {
            ...product,
            variants: variantsRes.rows
        };
    } finally {
        client.release();
    }
}
