import Link from 'next/link';
import { Button } from '../ui/button';
import { ShoppingBag, Search, Menu } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
            <div className="container-wide h-20 flex items-center justify-between">
                {/* Mobile Menu */}
                <button className="lg:hidden p-2">
                    <Menu className="w-6 h-6" />
                </button>

                {/* Logo */}
                <Link href="/" className="text-2xl font-serif font-bold tracking-tight">
                    Hanky Tales
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-8">
                    <Link href="/our-story" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
                        Our Story
                    </Link>
                    <Link href="/collection" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
                        Collection
                    </Link>
                    <Link href="/packaging" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
                        Packaging
                    </Link>
                    <Link href="/sustainability" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
                        Sustainability
                    </Link>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    <div className="hidden md:block">
                        <Button size="sm">Shop Now</Button>
                    </div>

                    <button className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors relative">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--primary)] rounded-full"></span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
