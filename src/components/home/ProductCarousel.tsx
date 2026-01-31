'use client';

import { useMemo } from "react";
import Image from "next/image";
import Link from 'next/link';

const products = [
    { id: 1, name: "Royal Silk Touch", price: 32, tag: "Luxury", image: "/product-royal-silk.png" },
    { id: 2, name: "Daily Comfort", price: 18, tag: "Everyday", image: "/product-daily-comfort.png" },
    { id: 3, name: "Earth Wise Bamboo", price: 24, tag: "Eco-Friendly", image: "/product-earth-wise.png" },
    { id: 4, name: "Noir Cube", price: 28, tag: "Luxury", image: "/product-noir-cube.png" },
    { id: 5, name: "Family Floral", price: 20, tag: "Everyday", image: "/product-family-floral.png" },
    { id: 6, name: "Eco Pocket Packs", price: 15, tag: "Eco-Friendly", image: "/product-eco-pocket.png" },
];

export function ProductCarousel() {
    const items = useMemo(() => [...products, ...products, ...products], []);
    // 14 items for a nice ring
    const activeItems = items.slice(0, 14);
    const count = activeItems.length;
    const radius = 520;
    const angleStep = 360 / count;

    return (
        // Outer wrapper handles overflow and background
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            <style jsx>{`
                .perspective-wrapper {
                    width: 100%;
                    height: 500px;
                    perspective: 2000px; /* Reduced zoom intensity */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .carousel-scene {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    transform-style: preserve-3d;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .carousel-ring {
                    position: relative;
                    width: 0;
                    height: 0;
                    transform-style: preserve-3d;
                    /* Anti-clockwise rotation */
                    animation: spin 45s linear infinite;
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
                    
                    /* IMPORTANT: Backface hidden handles the "behind" logic */
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    
                    /* Reflection */
                    -webkit-box-reflect: below 15px linear-gradient(transparent, transparent 60%, rgba(0,0,0,0.15));
                }
                
                .perspective-wrapper:hover .carousel-ring {
                    animation-play-state: paused;
                }

                @keyframes spin {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(-360deg); }
                }
            `}</style>

            <div className="container-wide mb-12 text-center relative z-10">
                <span className="text-[var(--primary)] font-bold tracking-widest text-xs uppercase block mb-3">Shop The Collection</span>
                <h2 className="text-3xl font-serif font-bold">Favorites in Rotation</h2>
            </div>

            {/* Scale wrapper */}
            <div className="w-full flex justify-center transform scale-[0.6] md:scale-[0.8] lg:scale-100 transition-transform duration-500 origin-center">
                <div className="perspective-wrapper">
                    <div className="carousel-scene">
                        <div className="carousel-ring">
                            {activeItems.map((product, index) => {
                                const angle = index * angleStep;
                                return (
                                    <div
                                        key={`${product.id}-${index}`}
                                        className="carousel-item"
                                        style={{
                                            // Positive Radius = Convex (Bulging out)
                                            transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                                        }}
                                    >
                                        <Link href="/collection" className="block w-full h-full group">
                                            <div className="w-full h-full bg-white rounded-[2rem] shadow-2xl border border-slate-50 overflow-hidden relative transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.25)]">
                                                {/* Image Area */}
                                                <div className="absolute inset-0 p-8 bg-gradient-to-br from-slate-50/80 to-white flex items-center justify-center">
                                                    <div className="relative w-full h-full transform transition-transform duration-700 group-hover:scale-110">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-contain drop-shadow-xl"
                                                            priority // Ensure seamless loading
                                                        />
                                                    </div>
                                                </div>

                                                {/* Overlay */}
                                                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end bg-gradient-to-t from-white/90 via-white/50 to-transparent h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] mb-1 block">{product.tag}</span>
                                                        <h3 className="font-serif text-lg font-bold text-slate-800 leading-tight">{product.name}</h3>
                                                        <p className="font-medium text-slate-600 mt-1">${product.price}</p>
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
            </div>

            <div className="text-center mt-6 text-sm text-slate-400 font-medium tracking-wide opacity-60">
                DRAG TO EXPLORE
            </div>
        </section>
    );
}
