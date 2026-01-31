'use client';

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { PackagingScene } from "@/components/3d/PackagingScene";
import { ArrowRight, ChevronDown } from "lucide-react";

const packagingProducts = [
    { id: 1, name: "Premium Kraft Shopper", price: 0.45, tag: "Best Seller", image: "/pack_paper_bag_handle.png", desc: "Twisted handle kraft bag, robust and stylish." },
    { id: 2, name: "Double-Wall Cafe Cup", price: 0.12, tag: "Hot & Cold", image: "/pack_paper_cup.png", desc: "Insulated design keeps drinks hot and hands cool." },
    { id: 3, name: "Eco Burger Clamshell", price: 0.18, tag: "Biodegradable", image: "/pack_burger_box.png", desc: "Made from sugarcane pulp, fully compostable." },
    { id: 4, name: "Fresh Salad Bowl", price: 0.35, tag: "Leak Proof", image: "/pack_salad_box.png", desc: "Clear lid for visibility, moisture resistant coating." },
    { id: 5, name: "Sushi/Wrap Roll Box", price: 0.28, tag: "Window", image: "/pack_roll_box.png", desc: "Showcase your rolls with a crystal clear window." },
    { id: 6, name: "French Fry Scoop", price: 0.08, tag: "Classic", image: "/pack_fries_tray.png", desc: "Stand-up design for easy snacking." },
    { id: 7, name: "Heavy Duty Soup Bowl", price: 0.22, tag: "Microwavable", image: "/pack_paper_bowl.png", desc: "Thick walls prevent sogginess." },
    { id: 8, name: "Flat Pastry Bag", price: 0.05, tag: "Grease Proof", image: "/pack_flat_bag.png", desc: "Perfect for cookies, croissants, and treats." },
    { id: 9, name: "Takeout Food Box", price: 0.30, tag: "Foldable", image: "/pack_food_box.png", desc: "Secure locking mechanism for safe transport." },
    { id: 10, name: "Event Starter Set", price: 45.00, tag: "Bundle", image: "/pack_collection_set.png", desc: "Complete kit for 50 guests." },
];

export default function PackagingPage() {
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
                        <PackagingScene />
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

                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {packagingProducts.map((product) => (
                            <div key={product.id} className="group">
                                <div className="aspect-[4/5] relative bg-slate-50 rounded-2xl overflow-hidden mb-4">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {product.tag}
                                    </div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-2">{product.desc}</p>
                                    </div>
                                    <span className="font-medium">${product.price.toFixed(2)}</span>
                                </div>
                                <button className="text-sm font-bold text-[var(--primary)] mt-2 flex items-center group-hover:translate-x-1 transition-transform">
                                    Add to Cart <ArrowRight className="w-3 h-3 ml-1" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
