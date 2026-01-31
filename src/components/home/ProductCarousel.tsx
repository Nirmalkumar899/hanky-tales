'use client';

import { useMemo } from "react";
import Image from "next/image";
import Link from 'next/link';

// Mock Data
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

export function ProductCarousel() {
    // 14 items creates a perfect dense ring for this width
    const items = useMemo(() => [...products, ...products, products[0], products[1]], []);
    const count = items.length; // 14

    // Tighter radius for more curvature
    const radius = 600;
    const angleStep = 360 / count;

    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden perspective-container">
            <style jsx>{`
                .perspective-container {
                    /* Lower perspective = stronger 3D distortion (more "pop") */
                    perspective: 1000px;
                }
                .carousel-scene {
                    width: 100%;
                    height: 500px;
                    position: relative;
                    transform-style: preserve-3d;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    /* Tilt the whole scene slightly down for better view */
                    transform: rotateX(5deg);
                }
                .carousel-ring {
                    position: relative;
                    width: 0;
                    height: 0;
                    transform-style: preserve-3d;
                    animation: spin 50s linear infinite;
                }
                .carousel-item {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 260px;
                    height: 400px;
                    transform-origin: center center; 
                    transform-style: preserve-3d;
                    margin-left: -130px; 
                    margin-top: -200px;
                    /* Backface hidden makes them disappear when looping behind */
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    
                    /* Reflection effect */
                    -webkit-box-reflect: below 10px linear-gradient(transparent, transparent 70%, rgba(0,0,0,0.2));
                }
                
                .carousel-scene:hover .carousel-ring {
                    animation-play-state: paused;
                }

                @keyframes spin {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                }
            `}</style>

            <div className="container-wide mb-12 text-center relative z-10">
                <span className="text-[var(--primary)] font-bold tracking-widest text-xs uppercase block mb-3">Shop The Collection</span>
                <h2 className="text-3xl font-serif font-bold">Favorites in Rotation</h2>
            </div>

            <div className="w-full flex justify-center transform scale-[0.6] md:scale-[0.8] lg:scale-100 transition-transform duration-500 origin-center">
                <div className="carousel-scene">
                    <div className="carousel-ring">
                        {items.map((product, index) => {
                            const angle = index * angleStep;
                            return (
                                <div
                                    key={`${product.id}-${index}`}
                                    className="carousel-item"
                                    style={{
                                        // Rotate then push out to radius
                                        transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                                    }}
                                >
                                    <Link href="/collection" className="block w-full h-full group">
                                        <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                                            {/* Image Area */}
                                            <div className="absolute inset-0 p-8 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
                                                <div className="relative w-full h-full transform transition-transform duration-700 group-hover:scale-110">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain drop-shadow-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Minimal Overlay */}
                                            <div className="absolute top-0 left-0 w-full h-full p-6 flex flex-col justify-end">
                                                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                    <h3 className="font-serif text-lg font-bold text-slate-800 leading-tight mb-1">{product.name}</h3>
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-medium text-slate-600 text-sm">${product.price}</p>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">{product.tag}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
