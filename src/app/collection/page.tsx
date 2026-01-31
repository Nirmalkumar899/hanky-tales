import { Suspense } from 'react';
import { getProducts } from '@/actions/products';
import { CollectionClient } from './client';

export const dynamic = 'force-dynamic';

export default async function Catalog() {
    const products = await getProducts();

    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center">Loading...</div>}>
            <CollectionClient products={products} />
        </Suspense>
    );
}
