import { Suspense } from 'react';
import { getProducts } from '@/actions/products';
import { CollectionClient } from './client';

export const dynamic = 'force-dynamic';

const collections = [
    { title: "Facial Tissues", image: "/products/facial-tissue-pink.png", link: "/collection/facial-tissues", count: "5 Items" },
    { title: "Event Starter Set", image: "/products/event-plate-dinner.png", link: "/collection/event-starter-set", count: "10+ Items" },
    { title: "Packaging Solutions", image: "/pack_paper_bag_handle.png", link: "/packaging", count: "15 Items" },
];

export default async function Catalog() {
    const products = await getProducts();

    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center">Loading...</div>}>
            <CollectionClient products={products} collections={collections} />
        </Suspense>
    );
}
