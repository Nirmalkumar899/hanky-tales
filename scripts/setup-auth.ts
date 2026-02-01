
import { pool } from '../src/lib/db';

async function setupAuth() {
    const client = await pool.connect();

    try {
        console.log('🔒 Setting up Auth Schema...');

        // 1. Create Profiles Table
        console.log('Creating profiles table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT,
        role TEXT DEFAULT 'wholesaler',
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

        // 2. Enable RLS
        console.log('Enabling RLS on profiles...');
        await client.query(`
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    `);

        // 3. Create RLS Policies
        console.log('Creating RLS policies...');
        // Allow users to view their own profile
        await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
          CREATE POLICY "Users can view own profile" ON profiles
            FOR SELECT USING (auth.uid() = id);
        END IF;
      END
      $$;
    `);

        // Allow admins to view all profiles
        // Note: This relies on the user having the 'admin' role in the profiles table.
        // Circular dependency issue: To read the role, you need to read the profile.
        // Simpler approach for now: Allow read if user is authenticated (we enforce admin check in app logic usually, OR use a secure view)
        // For simplicity in this script, sticking to basic owner access. Admin will use Service Role Key.

        // 4. Create Trigger for New User Creation
        console.log('Creating user creation trigger...');
        await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      SECURITY DEFINER SET search_path = public
      AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, role, is_approved)
        VALUES (new.id, new.email, 'wholesaler', false);
        RETURN new;
      END;
      $$;
    `);

        // Drop first to ensure clean state if updating
        await client.query(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    `);

        await client.query(`
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `);

        console.log('✅ Auth setup completed successfully!');
    } catch (error) {
        console.error('❌ Error setting up auth:', error);
    } finally {
        client.release();
        pool.end();
    }
}

setupAuth();
