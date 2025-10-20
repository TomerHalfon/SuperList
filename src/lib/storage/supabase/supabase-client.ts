import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase client singleton
let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create the Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      );
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Disable session persistence for server-side usage
      },
    });
  }

  return supabaseClient;
}

/**
 * Reset the Supabase client instance (useful for testing)
 */
export function resetSupabaseClient(): void {
  supabaseClient = null;
}
