
'use client'

import { Button } from "@/components/ui/button"
import { signup } from "@/app/auth/actions"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { useState } from "react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Submitting..." : "Apply for Account"}
        </Button>
    )
}

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        const result = await signup(formData);
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />
            <div className="container-wide pt-32 pb-20 flex justify-center items-center h-[80vh]">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[var(--border)]">
                    <h1 className="text-2xl font-serif font-bold mb-2 text-center">Wholesale Application</h1>
                    <p className="text-[var(--muted-foreground)] text-center mb-8">Create an account to view wholesale pricing.</p>

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
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
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

                        <div className="text-xs text-[var(--muted-foreground)] bg-blue-50 p-3 rounded-md">
                            Note: Your account will need approval from an administrator before you can access wholesale pricing.
                        </div>

                        <SubmitButton />
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-[var(--muted-foreground)]">Already have an account? </span>
                        <Link href="/login" className="font-medium text-[var(--primary)] hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
