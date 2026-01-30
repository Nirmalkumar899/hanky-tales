'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';
import { useRef, useEffect, useState } from "react";

// Product Data (Mirrored from Collection)
const products = [
    {
        id: 1,
        name: "Royal Silk Touch",
        price: 32,
        tag: "Luxury",
        image: "/product-royal-silk.png",
    },
    {
        id: 2,
        name: "Daily Comfort",
        price: 18,
        tag: "Everyday",
        image: "/product-daily-comfort.png",
    },
    {
        id: 3,
        name: "Earth Wise Bamboo",
        price: 24,
        tag: "Eco-Friendly",
        image: "/product-earth-wise.png",
    },
    {
        id: 4,
        name: "Noir Cube",
        price: 28,
        tag: "Luxury",
        image: "/product-noir-cube.png",
    },
    {
        id: 5,
        name: "Family Floral",
        price: 20,
        tag: "Everyday",
        image: "/product-family-floral.png",
    },
    {
        id: 6,
        name: "Eco Pocket Packs",
        price: 15,
        tag: "Eco-Friendly",
        image: "/product-eco-pocket.png",
    },
];

const Card = ({ product }: { product: typeof products[0] }) => {
    return (
        <Link href={`/collection`} className="block group relative mx-4">
            <div className="w-[280px] h-[400px] bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                {/* Image Background */}
                <div className="absolute inset-0 bg-slate-50 flex items-center justify-center p-6 group-hover:bg-slate-100 transition-colors duration-500">
                    <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-700">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain drop-shadow-md"
                        />
                    </div>
                </div>

                {/* Overlay Content */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent p-6 flex flex-col justify-end h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-black self-start mb-2">
                        {product.tag}
                    </span>
                    <h3 className="text-white font-serif text-xl font-medium">{product.name}</h3>
                    <p className="text-white/80 font-medium">${product.price}</p>
                </div>
            </div>
        </Link>
    );
};

export function ProductCarousel() {
    // We duplicate the list to ensure seamless looping
    const carouselItems = [...products, ...products, ...products];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden border-b border-slate-100">
            <div className="container-wide mb-10 flex items-end justify-between px-6">
                <div>
                    <h2 className="text-3xl font-serif font-bold mb-2">Shop The Collection</h2>
                    <p className="text-slate-500 max-w-md">Browse our premium range of comfort essentials, designed for every moment.</p>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden mask-linear-fade">
                {/* CSS Mask for left/right fade handled by CSS class or inline style if needed */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

                <motion.div
                    className="flex w-max py-8"
                    animate={{
                        x: ["0%", "-33.33%"] // Move exactly one set of items
                    }}
                    transition={{
                        duration: 30, // Speed of scroll
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {carouselItems.map((product, index) => (
                        <Card key={`${product.id}-${index}`} product={product} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
