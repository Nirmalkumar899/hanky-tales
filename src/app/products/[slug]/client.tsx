'use client';

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Check, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import type { Product } from "@/actions/products";

export function ProductClient({ product }: { product: Product }) {
    // Default to first variant if available
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
    const [quantity, setQuantity] = useState(100); // Wholesale default

    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    if (!selectedVariant) {
        return <div>No variants available</div>;
    }

    const price = selectedVariant.price || product.base_price;
    const totalPrice = (price * quantity).toFixed(2);

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <Navbar />

            <div className="pt-32 pb-24 container-wide">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Image Section */}
                    <div className="space-y-6">
                        <div className="aspect-[4/5] relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                            <Image
                                src={selectedVariant.image_url || product.image_url}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.variants?.slice(0, 4).map((v, i) => (
                                <div
                                    key={i}
                                    className={`aspect-square relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedVariant.size === v.size ? 'border-[var(--primary)]' : 'border-transparent'}`}
                                    onClick={() => setSelectedVariant(v)}
                                >
                                    <Image src={v.image_url || product.image_url} alt={v.size} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-8">
                            <span className="text-[var(--marketing-green)] font-bold tracking-widest text-xs uppercase mb-2 block">{product.tag}</span>
                            <h1 className="text-4xl lg:text-5xl font-serif mb-4">{product.name}</h1>
                            <p className="text-lg text-[var(--muted-foreground)]">{product.description}</p>
                        </div>

                        {/* Variant Selector */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-400">Select Size (Inches)</h3>
                            <div className="flex flex-wrap gap-3 mb-8">
                                {product.variants?.map((v) => (
                                    <button
                                        key={v.size}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${selectedVariant.size === v.size
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                            }`}
                                    >
                                        {v.size}
                                    </button>
                                ))}
                            </div>

                            <div className="h-px bg-slate-100 my-8"></div>

                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Price per unit (excl. GST)</p>
                                    <div className="text-3xl font-bold font-serif">
                                        {product.currency}{price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500 mb-1">Total (100 units)</p>
                                    <div className="text-xl font-bold text-[var(--primary)]">
                                        {product.currency}{totalPrice}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button size="lg" className="flex-1 h-14 text-lg">
                                    <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                                </Button>
                                <Button size="lg" variant="outline" className="h-14 aspect-square p-0">
                                    <ShieldCheck className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[var(--marketing-green)] shrink-0">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Fast Shipping</h4>
                                    <p className="text-xs text-[var(--muted-foreground)]">Ships within 24 hours.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <Check className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Certified Eco</h4>
                                    <p className="text-xs text-[var(--muted-foreground)]">100% Biodegradable.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
