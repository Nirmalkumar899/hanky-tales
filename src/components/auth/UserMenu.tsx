
'use client';

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/auth/actions";
import { User as UserIcon, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function UserMenu() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        // Get initial user
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="w-8 h-8 animate-pulse bg-slate-100 rounded-full"></div>;
    }

    if (!user) {
        return (
            <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-2 md:gap-4">
            <span className="text-xs font-medium text-[var(--muted-foreground)] hidden md:block">
                {user.email}
            </span>
            <form action={signout}>
                <Button variant="ghost" size="icon" title="Logout">
                    <LogOut className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
