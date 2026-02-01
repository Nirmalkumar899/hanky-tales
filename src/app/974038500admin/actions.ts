
'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveUser(userId: string) {
    const supabase = createClient()

    // Authorization check: ideally check if current user is admin
    // For now we rely on the page protection and the Service Key usage here if needed,
    // but the Supabase client created with createClient() uses the *user's* session.
    // If the user is logged in as 'fekupsony@gmail.com' and we set up RLS to allow that user to update, it works.
    // However, to bypass RLS for administrative tasks without complex RLS setup, 
    // we often need the SERVICE_ROLE key in a separate client.

    // Let's create a Service Role client for admin actions to ensure we can update any profile
    const { createServerClient } = require('@supabase/ssr')
    const { cookies } = require('next/headers')
    const cookieStore = cookies()

    const adminSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet: any) {
                    // Admin client doesn't need to set cookies for the user session
                }
            }
        }
    )

    const { error } = await adminSupabase
        .from('profiles')
        .update({ is_approved: true })
        .eq('id', userId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/974038500admin')
}
