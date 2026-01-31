import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
// Remove direct import
// import { PackagingScene } from "@/components/3d/PackagingScene"; 
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/actions/products";
import { Suspense } from "react";
import dynamicLoader from "next/dynamic";

// Dynamic import with SSR disabled
const PackagingScene = dynamicLoader(() => import("@/components/3d/PackagingScene").then(mod => mod.PackagingScene), {
    ssr: false,
    loading: () => null
});

export const dynamic = 'force-dynamic';

export default async function PackagingPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            {/* Hero Section with 3D Scene */}
            <section className="pt-32 pb-12 lg:pt-48 lg:pb-24 container-wide grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-[var(--marketing-green)] font-bold tracking-widest text-xs uppercase block mb-4">Sustainable Solutions</span>
                    <h1 className="mb-6">Packaging that Speaks Volumes.</h1>
                    <p className="text-xl text-[var(--muted-foreground)] mb-8 max-w-lg">
                        Elevate your brand with our eco-conscious food packaging. Durable, beautiful, and responsible.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg">Shop Wholesale</Button>
                        <Button size="lg" variant="outline">Request Sample</Button>
                    </div>
                </div>
                <div className="h-[400px] w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--marketing-green)]/10 to-transparent rounded-full blur-3xl"></div>
                    <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                        <Suspense fallback={null}>
                            <PackagingScene />
                        </Suspense>
                    </Canvas>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-24 bg-white">
                <div className="container-wide">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-3xl font-serif">Packaging Collection</h2>
                        <div className="flex items-center gap-2 text-sm font-medium border px-4 py-2 rounded-full cursor-pointer hover:bg-slate-50">
                            Sort by: Popular <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>

                    <Suspense fallback={<div>Loading products...</div>}>
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {products.map((product) => (
                                <Link href={`/products/${product.id}`} key={product.id} className="group block">
                                    <div className="aspect-[4/5] relative bg-slate-50 rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            src={product.image_url || "/placeholder.png"}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {product.tag && (
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                                {product.tag}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-[var(--primary)] transition-colors">{product.name}</h3>
                                            <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-2">{product.description}</p>
                                        </div>
                                        <span className="font-medium text-[var(--primary)]">{product.currency}{Number(product.base_price).toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm font-bold text-[var(--primary)] mt-2 flex items-center group-hover:translate-x-1 transition-transform">
                                        View Options <ArrowRight className="w-3 h-3 ml-1" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Suspense>
                </div>
            </section>
        </div>
    );
}
