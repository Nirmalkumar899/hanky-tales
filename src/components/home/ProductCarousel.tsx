'use client';

import { useRef, useMemo } from "react";
import Image from "next/image";
import Link from 'next/link';

// Mock Data (consistent with collection page)
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
    // Duplicate items to form a complete ring (18 items total)
    const items = useMemo(() => [...products, ...products, ...products], []);
    const count = items.length; // 18
    const radius = 800; // Radius of the carousel cylinder
    const angleStep = 360 / count;

    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden perspective-container">
            <style jsx>{`
                .perspective-container {
                    perspective: 2000px;
                }
                .carousel-scene {
                    width: 100%;
                    height: 500px; /* Adjust based on card height */
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
                    animation: spin 60s linear infinite;
                }
                .carousel-item {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 260px;
                    height: 400px;
                    transform-origin: center center; 
                    transform-style: preserve-3d;
                    /* Using margin to center the item on its origin pivot */
                    margin-left: -130px; 
                    margin-top: -200px;
                    backface-visibility: hidden;
                }
                
                /* Pause on hover */
                .carousel-scene:hover .carousel-ring {
                    animation-play-state: paused;
                }

                @keyframes spin {
                    from { transform: rotateY(0deg); }
                    to { transform: rotateY(360deg); }
                }

                /* Hides the back-facing items for a cleaner loop effect */
                .backface-hidden {
                    backface-visibility: hidden; 
                    -webkit-backface-visibility: hidden;
                }
            `}</style>

            <div className="container-wide mb-12 text-center">
                <span className="text-[var(--primary)] font-bold tracking-widest text-xs uppercase block mb-3">Shop The Collection</span>
                <h2 className="text-3xl font-serif font-bold">Favorites in Rotation</h2>
            </div>

            {/* Scale wrapper for responsiveness */}
            <div className="w-full flex justify-center transform scale-[0.45] md:scale-[0.65] lg:scale-[0.85] xl:scale-100 transition-transform duration-500 origin-center">
                <div className="carousel-scene">
                    <div className="carousel-ring">
                        {items.map((product, index) => {
                            const angle = index * angleStep;
                            return (
                                <div
                                    key={`${product.id}-${index}`}
                                    className="carousel-item backface-hidden"
                                    style={{
                                        transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                                    }}
                                >
                                    <Link href="/collection" className="block w-full h-full group">
                                        <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative transition-transform duration-300 hover:scale-105">
                                            {/* Image Area */}
                                            <div className="absolute inset-0 p-6 bg-slate-50/50 flex items-center justify-center">
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                            </div>

                                            {/* Content Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full w-fit font-bold uppercase tracking-wider mb-2">{product.tag}</span>
                                                <h3 className="font-serif text-xl font-medium leading-tight mb-1">{product.name}</h3>
                                                <p className="font-medium opacity-90">${product.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="text-center mt-4 text-sm text-slate-400 italic animate-pulse">
                Hover to minimize • Click to shop
            </div>
        </section>
    );
}
