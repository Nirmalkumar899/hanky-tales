'use client';

import { Navbar } from "@/components/layout/navbar";
import { SustainabilityScene } from "@/components/3d/SustainabilityScene";
import { Canvas } from "@react-three/fiber";
import { Leaf, Recycle, Droplets, Sun, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function SustainabilityPage() {
    return (
        <div className="min-h-screen bg-[#F0FDF4]"> {/* Light green bg matches 3D scene */}
            <Navbar />

            {/* Hero Section with 3D Background */}
            <section className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                        <SustainabilityScene />
                    </Canvas>
                </div>

                {/* Overlay Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-8xl font-serif text-slate-800 mb-6 tracking-tight">
                            Nature First.
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                            We believe in packaging that returns to the earth.<br />
                            <span className="text-[var(--marketing-green)] font-medium">100% Biodegradable. Zero Waste.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission Grid */}
            <section className="py-32 bg-white relative z-20 rounded-t-[3rem] -mt-20 shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
                <div className="container-wide">
                    <div className="text-center mb-20">
                        <span className="text-xs font-bold tracking-[0.2em] text-[var(--marketing-green)] uppercase mb-3 block">Our Commitment</span>
                        <h2 className="text-4xl md:text-5xl font-serif mb-6">Designed for the Planet</h2>
                        <p className="max-w-2xl mx-auto text-slate-500 text-lg">
                            Every product we create is engineered to minimize environmental impact without compromising on quality or aesthetics.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        {/* Feature 1 */}
                        <div className="p-8 bg-green-50/50 rounded-3xl hover:bg-green-50 transition-colors duration-500 group">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[var(--marketing-green)] mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <Leaf className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Plant-Based Materials</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Our packaging is made from renewable sources like sugarcane fiber, cornstarch, and FSC-certified kraft paper.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 bg-green-50/50 rounded-3xl hover:bg-green-50 transition-colors duration-500 group">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[var(--marketing-green)] mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <Recycle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Fully Compostable</h3>
                            <p className="text-slate-600 leading-relaxed">
                                From bins to earth in 90 days. Our products break down naturally, enriching the soil instead of polluting it.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 bg-green-50/50 rounded-3xl hover:bg-green-50 transition-colors duration-500 group">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[var(--marketing-green)] mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <Droplets className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Non-Toxic & Safe</h3>
                            <p className="text-slate-600 leading-relaxed">
                                No PFAS, no bleach, and no harmful chemicals. Safe for your food, safe for your family, and safe for nature.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-20">
                    {/* Abstract BG pattern could go here */}
                </div>
                <div className="container-wide relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-serif mb-8">Measurable Impact</h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                We're not just making claims; we're making a difference. By choosing compostable over plastic, you are directly contributing to a cleaner future.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-green-400 font-medium">
                                    <Sun className="w-5 h-5" /> Renewable Energy
                                </div>
                                <div className="flex items-center gap-2 text-green-400 font-medium">
                                    <Heart className="w-5 h-5" /> Ethical Labor
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur p-8 rounded-2xl border border-white/10 text-center">
                                <div className="text-4xl md:text-5xl font-bold mb-2 text-green-400">50K+</div>
                                <div className="text-sm text-slate-300 uppercase tracking-wider">Plastic Bags Saved</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur p-8 rounded-2xl border border-white/10 text-center">
                                <div className="text-4xl md:text-5xl font-bold mb-2 text-green-400">100%</div>
                                <div className="text-sm text-slate-300 uppercase tracking-wider">Plastic Free</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur p-8 rounded-2xl border border-white/10 text-center col-span-2">
                                <div className="text-4xl md:text-5xl font-bold mb-2 text-green-400">Zero</div>
                                <div className="text-sm text-slate-300 uppercase tracking-wider">Carbon Footprint (Offset)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
