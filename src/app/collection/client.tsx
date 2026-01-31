'use client';

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, ChevronDown, Facebook, Instagram } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Canvas } from "@react-three/fiber";
import { PackagingScene } from "@/components/3d/PackagingScene";
import { useSearchParams, useRouter } from 'next/navigation';
import type { Product } from "@/actions/products";

export function CollectionClient({ products }: { products: Product[] }) {
    const [activeCategory, setActiveCategory] = useState("All Products");
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchQuery = searchParams.get('search')?.toLowerCase() || "";

    // Reset category to "All Products" when a new search is performed to ensure results are visible
    useEffect(() => {
        if (searchQuery) {
            setActiveCategory("All Products");
        }
    }, [searchQuery]);

    const resetFilters = () => {
        setActiveCategory("All Products");
        router.push('/collection'); // Clear search params
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === "All Products" || product.tag === activeCategory || (activeCategory === "Luxury Collection" && product.tag === "Luxury");

        // Safety check for text fields
        const name = product.name?.toLowerCase() || "";
        const desc = product.description?.toLowerCase() || "";
        const keywords = product.seo_keywords || [];

        const matchesSearch = name.includes(searchQuery) ||
            desc.includes(searchQuery) ||
            keywords.some(k => k.toLowerCase().includes(searchQuery));

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            {/* Header */}
            <header className="pt-32 pb-16 text-center container-wide">
                <h1 className="mb-4">Our Collection</h1>
                {searchQuery ? (
                    <p className="text-[var(--muted-foreground)]">
                        Showing results for <span className="font-semibold text-slate-800">"{searchQuery}"</span>
                    </p>
                ) : (
                    <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
                        Discover the perfect blend of softness and strength. From everyday essentials to eco-friendly innovations and luxurious textures.
                    </p>
                )}
            </header>

            <main className="container-wide grid grid-cols-1 md:grid-cols-12 gap-12 pb-24">
                {/* Sidebar Filters */}
                <aside className="md:col-span-3 space-y-10">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold font-serif">Filters</h3>
                            <ChevronDown className="w-4 h-4" />
                        </div>

                        <div className="space-y-4">
                            <p className="font-medium text-xs tracking-wider uppercase text-[var(--muted-foreground)] mb-3">Categories</p>
                            {["All Products", "Everyday Essentials", "Luxury Collection", "Eco-Friendly"].map(cat => (
                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeCategory === cat ? 'border-[var(--primary)] bg-[var(--primary)] text-white' : 'border-[var(--muted-foreground)]'}`}>
                                        {activeCategory === cat && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    <span className={`text-sm ${activeCategory === cat ? 'font-medium text-[var(--foreground)]' : 'text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]'}`}>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className="space-y-4 mt-8">
                            <p className="font-medium text-xs tracking-wider uppercase text-[var(--muted-foreground)] mb-3">Thickness</p>
                            {["2-Ply Standard", "3-Ply Premium", "4-Ply Ultra"].map(item => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer">
                                    <div className="w-4 h-4 rounded-full border border-[var(--muted-foreground)]"></div>
                                    <span className="text-sm text-[var(--muted-foreground)]">{item}</span>
                                </label>
                            ))}
                        </div>

                        <div className="space-y-4 mt-8">
                            <p className="font-medium text-xs tracking-wider uppercase text-[var(--muted-foreground)] mb-3">Pack Size</p>
                            <div className="flex flex-wrap gap-2">
                                {["Box of 100", "Box of 200", "Cube"].map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full border border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:border-[var(--foreground)] cursor-pointer transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full mt-8 text-xs h-10"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="md:col-span-9">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border)]">
                        <span className="text-sm text-[var(--muted-foreground)]">Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products</span>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-[var(--muted-foreground)]">Sort by:</span>
                            <span className="font-medium flex items-center gap-1 cursor-pointer">Best Sellers <ChevronDown className="w-3 h-3" /></span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div key={product.id} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[var(--border)]">
                                    <div className="aspect-square relative mb-6 bg-[var(--background)] rounded-xl overflow-hidden flex items-center justify-center">
                                        <span className={`absolute top-3 right-3 px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full z-10 
                                            ${product.tag === 'Luxury' ? 'bg-[#C6A87C] text-white' :
                                                product.tag === 'Eco-Friendly' ? 'bg-[#D4E8D4] text-[#4A704A]' :
                                                    'bg-[#E6F0FF] text-[#4A6491]'}`}>
                                            {product.tag}
                                        </span>
                                        <div className="w-48 h-48 relative transform group-hover:scale-105 transition-transform duration-500">
                                            {/* DB uses image_url, fallback to local path if needed */}
                                            <Image src={product.image_url || "/placeholder.png"} alt={product.name} fill className="object-contain" />
                                        </div>
                                    </div>

                                    <h3 className="font-serif text-xl font-bold mb-2">{product.name}</h3>
                                    <p className="text-sm text-[var(--muted-foreground)] mb-6 line-clamp-2 min-h-[40px]">{product.description}</p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                                            {product.variants?.[0]?.size || "Standard"}
                                        </span>
                                        <div className="flex items-center gap-1 text-[var(--foreground)] text-sm font-medium hover:text-[var(--primary)] cursor-pointer group/link">
                                            Details <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <h3 className="text-xl font-serif font-bold mb-2">No products found</h3>
                                <p className="text-[var(--muted-foreground)]">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 flex justify-center gap-2">
                        <button className="h-10 px-4 rounded-md border border-[var(--border)] text-sm disabled:opacity-50">Previous</button>
                        <button className="w-10 h-10 rounded-md bg-[var(--foreground)] text-white text-sm font-medium">1</button>
                        <button className="w-10 h-10 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] text-sm font-medium transition-colors">2</button>
                        <button className="w-10 h-10 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] text-sm font-medium transition-colors">3</button>
                        <button className="h-10 px-4 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--muted)] transition-colors">Next</button>
                    </div>
                </div>
            </main>

            {/* New: Sustainability / Packaging Section */}
            <section className="py-24 bg-[#FAF9F6] relative overflow-hidden">
                <div className="container-wide grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative h-[500px]">
                        {/* 3D Scene Injection */}
                        <div className="absolute inset-0">
                            <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }}>
                                <PackagingScene />
                            </Canvas>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-block px-3 py-1 rounded-full border border-[var(--primary)] text-[var(--primary)] text-xs font-bold tracking-wider uppercase mb-6 bg-white">
                            New Arrival
                        </div>
                        <h2 className="mb-6">The Future of Food Packaging.</h2>
                        <p className="text-lg text-[var(--muted-foreground)] mb-8">
                            Sustainable, durable, and designed for the modern culinary experience. Our new range of biodegradable packaging elevates every meal, from takeout to table.
                        </p>

                        <div className="space-y-4 mb-8">
                            {["Sugarcane Pulp Boxes", "Double-Wall Insulated Cups", "Kraft Paper Solutions"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[var(--marketing-green)] rounded-full"></div>
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/packaging">
                            <Button size="lg" className="bg-[#1e1e1e] text-white hover:bg-black">
                                Shop Packaging
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-[var(--border)] bg-white">
                <div className="container-wide grid md:grid-cols-4 gap-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            {/* Small Logo Placeholder */}
                            <div className="w-8 h-8 bg-[var(--muted)] rounded-md flex items-center justify-center font-serif font-bold text-[var(--muted-foreground)]">H</div>
                            <div className="text-2xl font-serif font-bold tracking-tight">Hanky Tales</div>
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] mb-6">
                            Manufacturing premium tissue products with care for quality and the environment since 1995.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Products</h4>
                        <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
                            <li>Everyday Tissues</li>
                            <li>Luxury Collection</li>
                            <li>Eco-Friendly</li>
                            <li>Bulk Orders</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
                            <li>About Us</li>
                            <li>Sustainability</li>
                            <li>Careers</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Connect</h4>
                        <div className="flex gap-4">
                            <Facebook className="w-5 h-5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer transition-colors" />
                            <Instagram className="w-5 h-5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
                <div className="container-wide mt-20 pt-8 border-t border-[var(--border)] flex justify-between text-sm text-[var(--muted-foreground)]">
                    <div>© 2023 Hanky Tales. All rights reserved.</div>
                    <div className="flex gap-6">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
