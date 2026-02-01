'use client';

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Check, ShoppingCart, Truck, ShieldCheck, ArrowLeft, Star } from "lucide-react";
import type { Product } from "@/actions/products";
import Link from "next/link";

// Theme map for product-specific styling
const productThemes: Record<string, { bg: string, text: string, accent: string, secondary: string }> = {
    'velvet-touch-blush-pink': { bg: '#FFF0F5', text: '#8B4E63', accent: '#D68DA6', secondary: '#FDE2E8' },
    'velvet-touch-mint-breeze': { bg: '#F0FFF4', text: '#2F5E3E', accent: '#68B082', secondary: '#E0FCE5' },
    'velvet-touch-sky-blue': { bg: '#F0F8FF', text: '#2C4F6B', accent: '#7AA0C2', secondary: '#E1EEF8' },
    'velvet-touch-classic-white': { bg: '#FAFAFA', text: '#5D5D5D', accent: '#C6A87C', secondary: '#EAEAEA' },
    'velvet-touch-lavender-mist': { bg: '#F3E6FF', text: '#5D3F6A', accent: '#9D7BB0', secondary: '#EBD9FD' },
};

// Video map for specific products
const productVideos: Record<string, string> = {
    'velvet-touch-blush-pink': 'https://res.cloudinary.com/deyprglur/video/upload/v1769943516/Create_an_add_1080p_202602011620_vzmkel.mov',
    'velvet-touch-mint-breeze': 'https://res.cloudinary.com/deyprglur/video/upload/v1769944648/Create_an_adv_1080p_202602011641_1_psmgom.mov',
    'velvet-touch-sky-blue': 'https://res.cloudinary.com/deyprglur/video/upload/v1769944652/Create_an_adv_1080p_202602011641_a1trie.mov',
    'velvet-touch-classic-white': 'https://res.cloudinary.com/deyprglur/video/upload/v1769944665/Create_an_adv_1080p_202602011642_1_plx0uh.mov',
    'velvet-touch-lavender-mist': 'https://res.cloudinary.com/deyprglur/video/upload/v1769944651/Create_an_adv_1080p_202602011642_oslj0n.mov'
};

export function ProductClient({ product }: { product: Product }) {
    // Default to first variant if available
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
    const [quantity, setQuantity] = useState(100); // Wholesale default

    // Media logic
    const videoUrl = productVideos[product.id];
    const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video', url: string }>({
        type: videoUrl ? 'video' : 'image',
        url: videoUrl || product.image_url || '/placeholder.png'
    });

    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
        // Check for video on mount (or product change) and defaulting to it
        const vUrl = productVideos[product.id];
        if (vUrl) {
            setActiveMedia({ type: 'video', url: vUrl });
        } else {
            setActiveMedia({ type: 'image', url: product.image_url || '/placeholder.png' });
        }
    }, [product]);

    // Default theme if no specific match
    const theme = productThemes[product.id] || { bg: '#FDFBF7', text: '#2C3E50', accent: '#D4A373', secondary: '#FFFFFF' };

    if (!selectedVariant && product.variants && product.variants.length > 0) {
        return <div className="p-12 text-center text-gray-500">Loading options...</div>;
    }

    // Fallback if no variants
    const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.base_price);
    const totalPrice = (currentPrice * quantity).toFixed(2);
    const displayPrice = currentPrice.toFixed(2);

    // Aggregate distinct images for thumbnails
    const baseImage = product.image_url || '/placeholder.png';
    const variantImages = product.variants?.map(v => v.image_url).filter(Boolean) as string[] || [];
    const allImages = Array.from(new Set([baseImage, ...variantImages]));

    return (
        <div className="min-h-screen transition-colors duration-700" style={{ backgroundColor: theme.bg, color: theme.text }}>
            <Navbar />

            <div className="pt-32 pb-24 container-wide">
                <Link href="/collection/facial-tissues" className="inline-flex items-center text-sm font-medium mb-8 hover:opacity-75 transition-opacity" style={{ color: theme.text }}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collection
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 relative">
                    {/* Image Section */}
                    <div className="space-y-6 sticky top-32 self-start">
                        <div className="aspect-square relative rounded-[3rem] overflow-hidden shadow-xl transition-all duration-700 bg-white" style={{ backgroundColor: theme.secondary }}>
                            {activeMedia.type === 'video' ? (
                                <video
                                    src={activeMedia.url}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <Image
                                    src={activeMedia.url}
                                    alt={product.name}
                                    fill
                                    className="object-cover p-2"
                                />
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-5 gap-4">
                            {/* Video Thumbnail */}
                            {videoUrl && (
                                <div
                                    className={`aspect-square relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all flex items-center justify-center bg-black/5 ${activeMedia.type === 'video' ? 'scale-105 shadow-md ring-2 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                                    style={{ borderColor: activeMedia.type === 'video' ? theme.accent : 'transparent' }}
                                    onClick={() => setActiveMedia({ type: 'video', url: videoUrl })}
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center backdrop-blur-md shadow-lg group-hover:bg-white/60 transition-colors">
                                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            )}

                            {/* Image Thumbnails */}
                            {allImages.slice(0, 4).map((img, i) => (
                                <div
                                    key={i}
                                    className={`aspect-square relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${activeMedia.type === 'image' && activeMedia.url === img ? 'scale-105 shadow-md ring-2 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                                    style={{
                                        borderColor: activeMedia.type === 'image' && activeMedia.url === img ? theme.accent : 'transparent',
                                        backgroundColor: theme.secondary
                                    }}
                                    onClick={() => setActiveMedia({ type: 'image', url: img })}
                                >
                                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div>
                        <div className="mb-8">
                            {product.tag && (
                                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
                                    style={{ backgroundColor: theme.text, color: theme.bg }}>
                                    {product.tag}
                                </span>
                            )}
                            <h1 className="text-4xl lg:text-6xl font-serif mb-6 leading-tight">{product.name}</h1>
                            <p className="text-xl opacity-80 leading-relaxed border-l-4 pl-6" style={{ borderColor: theme.accent }}>
                                {product.description}
                            </p>
                        </div>

                        {/* Variant Selector */}
                        <div className="p-8 rounded-3xl shadow-sm mb-8 transition-colors duration-700 backdrop-blur-sm bg-white/40 border border-white/50">
                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-bold text-xs uppercase tracking-wider mb-4 opacity-60">Select Size / Pack</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants.map((v) => (
                                            <button
                                                key={v.size}
                                                onClick={() => setSelectedVariant(v)}
                                                className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all ${selectedVariant?.size === v.size
                                                    ? 'shadow-lg transform -translate-y-1'
                                                    : 'hover:-translate-y-0.5'
                                                    }`}
                                                style={{
                                                    backgroundColor: selectedVariant?.size === v.size ? theme.text : 'transparent',
                                                    color: selectedVariant?.size === v.size ? theme.bg : theme.text,
                                                    borderColor: theme.text
                                                }}
                                            >
                                                {v.size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="h-px w-full bg-current opacity-10 my-8"></div>

                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <p className="text-sm opacity-60 mb-1">Price per unit</p>
                                    <div className="text-3xl font-bold font-serif">
                                        {product.currency}{displayPrice}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-60 mb-1">Total (100 units)</p>
                                    <div className="text-xl font-bold" style={{ color: theme.accent }}>
                                        {product.currency}{totalPrice}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    size="lg"
                                    className="flex-1 h-16 text-lg rounded-2xl border-none shadow-xl hover:brightness-110 transition-all"
                                    style={{ backgroundColor: theme.accent, color: '#FFF' }}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-3" /> Add to Cart
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-16 w-16 p-0 rounded-2xl border-2"
                                    style={{ borderColor: theme.accent, color: theme.accent }}
                                >
                                    <Star className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-6 opacity-80">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/30">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.secondary, color: theme.text }}>
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Fast Shipping</h4>
                                    <p className="text-xs opacity-70">Dispatched within 24h.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/30">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.secondary, color: theme.text }}>
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Eco Certified</h4>
                                    <p className="text-xs opacity-70">100% Sustainable.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
