'use client';

import Image from "next/image";
import Link from 'next/link';
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Leaf } from "lucide-react";
import { HeroScene } from "@/components/3d/HeroScene";
import { IntroOverlay } from "@/components/ui/IntroOverlay";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { useState, useEffect } from "react";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  // Prevent scrolling while intro is playing
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showIntro]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AnimatePresence>
        {showIntro && (
          <IntroOverlay onIntroComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }} // Instant fade in
      >
        <Navbar />

        <section className="pt-32 pb-20 lg:pt-32 lg:pb-32 container-wide">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={!showIntro ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full"
            >
              <div className="relative w-full h-[70vh] min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6B8E6F]/10 to-transparent rounded-3xl -rotate-1 blur-3xl z-0"></div>
                <div className="relative z-10 w-full h-full">
                  <HeroScene />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* New Scrolling Product Carousel */}
        <ProductCarousel />

        {/* Story Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container-wide grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src="/fabric-texture.png"
                alt="Soft fabric texture"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div>
              <h2 className="leading-tight mb-8">
                Weaving Comfort into <br />
                Every Moment
              </h2>
              <div className="w-20 h-1 bg-[var(--primary)] mb-8"></div>
              <p className="text-lg mb-6">
                At Hanky Tales, we believe that the disposable should not feel disposable. Our journey began with a simple question: why can't everyday essentials be objects of luxury?
              </p>
              <p className="text-lg mb-8">
                Using a proprietary blend of organic cotton and sustainable wood pulp, we've created a fabric that caresses the skin. It's not just a tissue; it's a gentle gesture of self-care.
              </p>
              <Button variant="outline" className="group">
                Read full story <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* Collections Preview */}
        <section className="py-24 bg-[var(--background)]">
          <div className="container-wide">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[var(--primary)] font-bold tracking-widest text-xs uppercase block mb-3">Our Collection</span>
              <h2>Essentials for Every Room</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Facial Tissues", desc: "Infused with aloe vera for the sensitive touch.", icon: "/products/facial-tissue-pink.png", link: "/collection/facial-tissues" },
                { title: "Paper Towels", desc: "Superior absorption with diamond-weave technology.", icon: "/icon-paper-towels.png", link: "/collection/facial-tissues" }, // Placeholder link for now
                { title: "Dinner Napkins", desc: "Elegant, linen-feel disposables for fine dining.", icon: "/icon-dinner-napkins.png", link: "/collection/facial-tissues" } // Placeholder link for now
              ].map((item, i) => (
                <Link href={item.link} key={i} className="glass-card p-10 rounded-2xl hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col items-center text-center border-2 border-transparent hover:border-[#E76F51]/20">
                  <div className="w-48 h-48 mb-6 relative group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-serif">{item.title}</h3>
                  <p className="mb-6 text-[var(--muted-foreground)]">{item.desc}</p>
                  <div className="flex items-center text-[var(--primary)] font-bold text-sm group-hover:translate-x-2 transition-transform uppercase tracking-wider">
                    Shop {item.title} <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sustainability / Dark Section */}
        <section className="py-24 bg-[#1e1e1e] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--marketing-green)]/10 blur-[120px] rounded-full"></div>

          <div className="container-wide grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-medium tracking-wider uppercase mb-6">
                Earth First
              </div>
              <h2 className="text-white mb-6">
                Kind to You.<br />
                Kind to the Planet.
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-lg">
                Every Hanky Tales box is made from 100% recycled materials, and for every tree used in our virgin pulp products, we plant three more. We are committed to a zero-waste future.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "FSC Certified Pulp",
                  "Plastic-free Packaging",
                  "Carbon Neutral Shipping"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-black">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Button className="bg-white text-black hover:bg-white/90">Read Our Impact Report</Button>
            </div>

            <div className="relative h-[500px] w-full rounded-full overflow-hidden border-8 border-white/5">
              {/* Abstract circle or leaf imagery would go here */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--marketing-green)] to-[#1e1e1e] opacity-60"></div>
              {/* Leaf image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full scale-125 hover:scale-135 transition-transform duration-1000">
                  <Image
                    src="/sustainability-leaf.png"
                    alt="Sustainable Leaf"
                    fill
                    className="object-contain drop-shadow-2xl opacity-90"
                  />
                </div>
              </div>

              <div className="absolute bottom-10 right-10 bg-white text-black p-6 rounded-2xl max-w-[200px]">
                <div className="text-3xl font-bold mb-1">3x</div>
                <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">Trees Replanted</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Placeholder */}
        <footer className="py-20 border-t border-[var(--border)] bg-white">
          <div className="container-wide grid md:grid-cols-4 gap-12">
            <div>
              <div className="text-2xl font-serif font-bold tracking-tight mb-6">Hanky Tales</div>
              <p className="text-sm">Elevating the everyday since 2023. Premium disposables designed for modern living.</p>
            </div>
            {/* Columns would go here */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Shop</h4>
              <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
                <li>Facial Tissues</li>
                <li>Paper Towels</li>
                <li>Napkins</li>
                <li>Bundles</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
                <li>Our Story</li>
                <li>Sustainability</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Stay in touch</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="bg-[var(--muted)] px-4 py-2 rounded-l-md w-full text-sm focus:outline-none" />
                <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-r-md">→</button>
              </div>
            </div>
          </div>
          <div className="container-wide mt-20 pt-8 border-t border-[var(--border)] flex justify-between text-sm text-[var(--muted-foreground)]">
            <div>© 2023 Hanky Tales. All rights reserved.</div>
            <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
