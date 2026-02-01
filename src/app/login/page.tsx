
'use client'

import { Button } from "@/components/ui/button"
import { login } from "@/app/auth/actions"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { useState } from "react"
import { useRouter } from "next/navigation"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Logging in..." : "Log In"}
        </Button>
    )
}

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />
            <div className="container-wide pt-32 pb-20 flex justify-center items-center h-[80vh]">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[var(--border)]">
                    <h1 className="text-2xl font-serif font-bold mb-2 text-center">Welcome Back</h1>
                    <p className="text-[var(--muted-foreground)] text-center mb-8">Login to your wholesale account.</p>

                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                                {error}
                            </div>
                        )}

                        <SubmitButton />
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-[var(--muted-foreground)]">Don't have an account? </span>
                        <Link href="/signup" className="font-medium text-[var(--primary)] hover:underline">
                            Apply for Wholesale
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
