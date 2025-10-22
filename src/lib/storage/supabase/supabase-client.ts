/**
 * @deprecated This file is deprecated. Import from specific files instead:
 * - For client components: import from './client'
 * - For server components: import from './server'
 */

// Re-export client functions
export { createClientSupabaseClient, resetSupabaseClient } from './client';

// Re-export server functions  
export { createServerSupabaseClient } from './server';

// Legacy function for backward compatibility
export function getSupabaseClient() {
  if (typeof window !== 'undefined') {
    const { createClientSupabaseClient } = require('./client');
    return createClientSupabaseClient();
  }
  throw new Error(
    'getSupabaseClient() called on server-side. Use createServerSupabaseClient() instead.'
  );
}
