'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

// Client-side singleton
let browserClient: SupabaseClient<Database> | null = null;

/**
 * Create a Supabase client for use in Client Components
 * This client persists sessions in browser storage
 * 
 * Note: NEXT_PUBLIC_SUPABASE_ANON_KEY should contain your Publishable API key
 * (labeled as "Publishable key" in newer Supabase dashboards)
 * Never use the Secret key in client-side code!
 */
export function createClientSupabaseClient(): SupabaseClient<Database> {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Publishable API key (safe for browsers)
  );

  return browserClient;
}

/**
 * Reset the Supabase client instance (useful for testing)
 */
export function resetSupabaseClient(): void {
  browserClient = null;
}

