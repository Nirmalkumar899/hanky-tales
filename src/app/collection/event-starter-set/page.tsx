'use client';

import { Navbar } from "@/components/layout/navbar";
import { products } from "@/lib/product-data";
import { motion } from "framer-motion";
import { ChevronRight, Filter, Sparkles, PartyPopper, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EventStarterSetPage() {
    // Filter products tagged with 'Event Starter'
    const categoryProducts = products.filter(p => p.tag === 'Event Starter' || p.id === 'event-starter-set');

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C3E50]">
            <Navbar />

            {/* Hero Section */}
            <div className="pt-32 pb-16 px-6 lg:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E0FCE5]/30 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-[#2C3E50]/60 mb-8 font-medium">
                        <Link href="/" className="hover:text-[#D4A373] transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/collection" className="hover:text-[#D4A373] transition-colors">Collection</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#2C3E50]">Event Starter Set</span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="inline-block px-4 py-1.5 rounded-full bg-[#E0FCE5] text-[#2F5E3E] text-xs font-bold tracking-widest uppercase mb-4">
                                    Premium Party Essentials
                                </span>
                                <h1 className="text-5xl lg:text-7xl font-serif leading-[1.1] mb-6">
                                    The Event <br /> <span className="text-[#D4A373] italic">Starter Set</span>
                                </h1>
                                <p className="text-lg text-[#2C3E50]/70 leading-relaxed max-w-lg">
                                    Everything you need to host effortlessly. From eco-chic plates to signature cups, curated for unforgettable gatherings.
                                </p>
                            </motion.div>
                        </div>

                        <div className="hidden md:flex gap-4">
                            <div className="flex -space-x-4">
                                <div className="w-12 h-12 rounded-full border-2 border-[#FDFBF7] bg-[#D4A373] flex items-center justify-center text-white text-xs font-bold">50+</div>
                                <div className="w-12 h-12 rounded-full border-2 border-[#FDFBF7] bg-[#2C3E50] flex items-center justify-center text-white text-xs font-bold">Eco</div>
                                <div className="w-12 h-12 rounded-full border-2 border-[#FDFBF7] bg-[#E0FCE5] flex items-center justify-center text-[#2F5E3E]">
                                    <PartyPopper className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Grid */}
                    <div className="flex items-center justify-between mb-8 border-b border-[#2C3E50]/10 pb-4">
                        <p className="text-sm font-medium opacity-60">{categoryProducts.length} Products</p>
                        <button className="flex items-center gap-2 text-sm font-medium hover:text-[#D4A373] transition-colors">
                            <Filter className="w-4 h-4" /> Filter & Sort
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categoryProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={`/products/${product.id}`} className="group relative bg-white rounded-3xl p-6 hover:shadow-xl transition-all duration-500 border border-transparent hover:border-[#D4A373]/20 block h-full">
                                    {/* Discount/Tag Badge */}
                                    {product.tag && (
                                        <span className="absolute top-6 left-6 z-10 bg-[#2C3E50] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                                            {product.tag}
                                        </span>
                                    )}

                                    {/* Image Container */}
                                    <div className="aspect-square relative mb-6 overflow-hidden rounded-2xl bg-[#F8F9FA]">
                                        <Image
                                            src={product.image || '/placeholder.png'}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-serif text-[#2C3E50] group-hover:text-[#E76F51] transition-colors line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <span className="text-lg font-bold text-[#2C3E50]">{product.currency}{product.basePrice}</span>
                                            <span className="text-xs font-medium text-[#D4A373] group-hover:translate-x-1 transition-transform flex items-center">
                                                View <ArrowRight className="w-3 h-3 ml-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Collection Footer */}
            <div className="py-24 border-t border-[#2C3E50]/5 bg-white/50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <Sparkles className="w-8 h-8 text-[#D4A373] mx-auto mb-6" />
                    <h2 className="text-3xl font-serif mb-4">Complete the Look</h2>
                    <p className="opacity-60 max-w-lg mx-auto mb-8">Pair your event essentials with our premium facial tissues for a truly cohesive experience.</p>
                    <Link href="/collection/facial-tissues" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#2C3E50] text-white font-medium hover:bg-[#D4A373] transition-colors">
                        View Facial Tissues
                    </Link>
                </div>
            </div>
        </div>
    );
}
