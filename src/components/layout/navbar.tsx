'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { ShoppingBag, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const pathname = usePathname();
    const router = useRouter();

    // Close menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/collection?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
                <div className="container-wide h-20 flex items-center justify-between">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="text-2xl font-serif font-bold tracking-tight">
                        Hanky Tales
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        <NavLink href="/our-story">Our Story</NavLink>
                        <NavLink href="/collection">Collection</NavLink>
                        <NavLink href="/packaging">Packaging</NavLink>
                        <NavLink href="/sustainability">Sustainability</NavLink>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <div className="hidden md:block">
                            <Button size="sm" onClick={() => router.push('/collection')}>Shop Now</Button>
                        </div>

                        <button className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--primary)] rounded-full"></span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col"
                    >
                        <div className="container-wide h-20 flex items-center justify-between border-b border-[var(--border)]">
                            <span className="text-xl font-serif font-bold">Menu</span>
                            <button
                                className="p-2 hover:bg-slate-100 rounded-full"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex flex-col p-8 gap-6 text-2xl font-serif">
                            <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
                            <MobileNavLink href="/our-story" onClick={() => setIsMobileMenuOpen(false)}>Our Story</MobileNavLink>
                            <MobileNavLink href="/collection" onClick={() => setIsMobileMenuOpen(false)}>Collection</MobileNavLink>
                            <MobileNavLink href="/packaging" onClick={() => setIsMobileMenuOpen(false)}>Packaging</MobileNavLink>
                            <MobileNavLink href="/sustainability" onClick={() => setIsMobileMenuOpen(false)}>Sustainability</MobileNavLink>
                        </div>
                        <div className="mt-auto p-8 border-t border-[var(--border)]">
                            <Button className="w-full text-lg py-6" onClick={() => router.push('/collection')}>Shop All</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-0 right-0 z-40 bg-white border-b border-[var(--border)] shadow-xl p-6"
                    >
                        <div className="container-wide max-w-2xl">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search for tissues, boxes, packaging..."
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--primary)] rounded-full outline-none transition-all text-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--primary)] text-white rounded-full hover:bg-[var(--primary)]/90 transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`text-sm font-medium transition-colors relative py-1 ${isActive ? 'text-[var(--primary)]' : 'hover:text-[var(--primary)]'}`}
        >
            {children}
            {isActive && (
                <motion.span
                    layoutId="underline"
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-[var(--primary)]"
                />
            )}
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center justify-between group hover:text-[var(--primary)] transition-colors"
        >
            {children}
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>
    );
}
