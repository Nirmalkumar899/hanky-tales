
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

async function getFacialTissues() {
    const supabase = createClient();
    // Fetch products that are 'Velvet Touch' series or tagged 'facial-tissues' if we added a category column, 
    // but based on our seed, we rely on IDs or tags. 
    // Actually, looking at the seed, we didn't add a 'category' column to the table schema explicitly in the seed script shown,
    // but the `products` array in product-data.ts doesn't have a category field either, just ID/Name/Desc.
    // Wait, the seed script inserted: `VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
    // And product-data had: id, name, tag, basePrice, currency, description, image, seoKeywords.
    // The previous 'facial-tissues' string in the manual seed attempt was a 'category' value, but likely our schema doesn't support it 
    // or checks `product-data.ts`.
    // Let's verify schema from seed.ts output: `products (id, name, tag, base_price, currency, description, image_url, seo_keywords)`
    // So there is NO category column. We must filter by ID or name.

    // We'll filter by IDs starting with 'velvet-touch'
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .ilike('id', 'velvet-touch%');

    return products || [];
}

export default async function FacialTissuesPage() {
    const products = await getFacialTissues();

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="text-[#D4A373] font-bold tracking-[0.2em] text-xs uppercase block mb-6">Premium Collection</span>
                    <h1 className="text-5xl lg:text-7xl font-serif text-[#2C3E50] mb-8 leading-tight">
                        Velvet Touch <br />
                        <span className="text-[#E76F51] italic text-4xl lg:text-6xl">Facial Tissues</span>
                    </h1>
                    <p className="text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed mb-12">
                        Indulge in the softness of Hanky Tales. Our premium 5-color collection brings elegance to any room.
                        Infused with gentle care, designed for luxury.
                    </p>
                </div>
            </section>

            {/* Product Showcase Grid */}
            <section className="pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <Link href={`/products/${product.id}`} key={product.id} className="group relative bg-white rounded-3xl p-6 hover:shadow-xl transition-all duration-500 border border-transparent hover:border-[#D4A373]/20">
                                {/* Discount/Tag Badge */}
                                {product.tag && (
                                    <span className="absolute top-6 left-6 z-10 bg-[#2C3E50] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                                        {product.tag}
                                    </span>
                                )}

                                {/* Image Container */}
                                <div className="aspect-square relative mb-8 overflow-hidden rounded-2xl bg-[#F8F9FA]">
                                    <Image
                                        src={product.image_url || '/placeholder.png'}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-serif text-[#2C3E50] group-hover:text-[#E76F51] transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex flex-col items-end">
                                            <span className="text-lg font-bold text-[#2C3E50]">{product.currency}{product.base_price}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-[#6B7280] line-clamp-2 leading-relaxed h-10">
                                        {product.description}
                                    </p>

                                    <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className="w-3 h-3 fill-[#E76F51] text-[#E76F51]" />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-2">(Fixed Rating)</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#E76F51] flex items-center group-hover:translate-x-2 transition-transform">
                                            Shop Now <ArrowRight className="w-4 h-4 ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
