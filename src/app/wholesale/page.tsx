
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { redirect } from "next/navigation";

export default async function WholesalePage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is approved
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', user.id)
        .single();

    if (!profile?.is_approved) {
        return (
            <div className="min-h-screen bg-[var(--background)]">
                <Navbar />
                <div className="container-wide pt-32 pb-20 text-center">
                    <h1 className="text-3xl font-serif font-bold mb-4">Account Pending Approval</h1>
                    <p className="text-[var(--muted-foreground)] max-w-lg mx-auto">
                        Thank you for your application. An administrator will review your account shortly.
                        Once approved, you will have access to wholesale pricing and bulk ordering options.
                    </p>
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg inline-block text-sm text-yellow-800">
                        Status: <span className="font-bold">Pending Review</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />
            <div className="container-wide pt-32 pb-20">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <span className="text-[var(--primary)] font-bold tracking-widest text-xs uppercase block mb-2">Wholesale Portal</span>
                        <h1 className="text-4xl font-serif font-bold">Bulk Ordering</h1>
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                        Welcome back, <span className="font-medium text-[var(--foreground)]">{user.email}</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Placeholder Wholesale Products */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="bg-white rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
                            <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-400">
                                Product Image
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-1">Premium Kraft Shopper - Case</h3>
                                <p className="text-sm text-[var(--muted-foreground)] mb-4">Box of 500 • High Durability</p>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <div>
                                        <p className="text-xs text-[var(--muted-foreground)] line-through">Retail: $150.00</p>
                                        <p className="font-bold text-[var(--primary)] text-lg">$85.00</p>
                                    </div>
                                    <button className="px-4 py-2 bg-[var(--foreground)] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors">
                                        Add to Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
