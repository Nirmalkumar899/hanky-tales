import { getProduct } from "@/actions/products";
import { ProductClient } from "./client";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);
    console.log(`[ProductPage] Fetched product for slug "${params.slug}":`, JSON.stringify(product, null, 2));

    if (!product) {
        notFound();
    }

    return <ProductClient product={product} />;
}
