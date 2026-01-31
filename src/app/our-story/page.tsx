'use client';

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Leaf, Heart, Users } from "lucide-react";

export default function OurStory() {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 lg:pt-60 lg:pb-40 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white/90 z-10"></div>
                    {/* Subtle background texture or blurry image */}
                    <div className="w-full h-full opacity-5">
                        <Image src="/fabric-texture.png" alt="Texture" fill className="object-cover" />
                    </div>
                </div>

                <div className="container-wide relative z-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[var(--primary)] font-bold tracking-widest text-xs uppercase block mb-6">The Journey</span>
                        <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
                            From Small Town Dreams <br />
                            <span className="italic text-slate-400">to</span> Big City Comfort.
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            We started with a simple belief: softness shouldn't be a luxury reserved for special occasions. It should be the fabric of everyday life.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-24 bg-white relative">
                <div className="container-wide grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative aspect-[4/5] rounded-tl-[4rem] rounded-br-[4rem] overflow-hidden shadow-2xl">
                            {/* Concept image representing specificity/care - placeholder */}
                            <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400">
                                {/* Ideally an image of a generic rough tissue vs ours */}
                                <Image src="/sustainability-leaf.png" alt="Concept" fill className="object-cover opacity-50 scale-150" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="mb-6">The "Tissue Problem"</h2>
                        <p className="text-lg text-slate-600 mb-6 font-serif italic">
                            "Why does something that touches our face feel like sandpaper?"
                        </p>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Growing up, we noticed a disconnect. We lived in a world where technology was advancing, cars were getting faster, and phones smarter. Yet, the humble tissue—the thing we reach for when we cry, when we're sick, or when we just need a moment of clarity—remained stuck in the past.
                        </p>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            It was either cheap and scratchy or "premium" but filled with lotions and chemicals. We wanted something pure. We wanted a tissue that felt like a hug.
                        </p>

                        <div className="pl-6 border-l-4 border-[var(--primary)]">
                            <p className="font-medium text-slate-800">
                                So we decided to solve it. We moved from our small hometown, packed with ambition, to create a brand that redefines the standard of care.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* The Mission / Values */}
            <section className="py-24 bg-[#1e1e1e] text-white">
                <div className="container-wide text-center mb-16">
                    <span className="text-[var(--marketing-green)] font-bold tracking-widest text-xs uppercase block mb-3">Our Mission</span>
                    <h2 className="text-white">More Than Just a Tissue</h2>
                </div>

                <div className="container-wide grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Heart, title: "Emotional Comfort", desc: "We design for feelings, not just function. Softness is our love language." },
                        { icon: Leaf, title: "Uncompromisingly Eco", desc: "100% Bamboo & Sugarcane blend. No trees harmed, zero guilt." },
                        { icon: Users, title: "Community First", desc: "We grew from a small town community, and we treat every customer like a neighbor." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            className="bg-white/5 p-10 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <item.icon className="w-10 h-10 text-[var(--marketing-green)] mb-6" />
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-white/60">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Narrative Closing */}
            <section className="py-32 bg-[var(--background)] text-center">
                <div className="container-wide max-w-3xl">
                    <h2 className="font-serif italic mb-8 text-4xl">"Hanky Tales is our love letter to the details."</h2>
                    <p className="text-slate-600 mb-10 text-lg">
                        Today, we are proud to serve thousands of homes, bringing a touch of woven luxury to everyday moments. Thank you for being part of our story.
                    </p>
                    <Image src="/signature.png" alt="Signatures" width={200} height={80} className="mx-auto opacity-60 mb-10" />

                    <Button size="lg" className="rounded-full px-8">
                        Shop The Collection
                    </Button>
                </div>
            </section>

            <footer className="py-12 border-t border-slate-200 bg-white text-center text-slate-400 text-sm">
                <p>© 2023 Hanky Tales. Written with love.</p>
            </footer>
        </div>
    );
}
