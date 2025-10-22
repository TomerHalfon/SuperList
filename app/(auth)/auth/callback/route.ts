import { createServerSupabaseClient } from '@/lib/storage/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth callback handler
 * This route handles the callback from OAuth providers (Google, etc.)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect');

  if (code) {
    const supabase = await createServerSupabaseClient();
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Validate redirect URL to prevent open redirect vulnerability
  let destination = '/';
  if (redirectTo) {
    try {
      const redirectUrl = new URL(redirectTo, requestUrl.origin);
      if (redirectUrl.origin === requestUrl.origin) {
        destination = redirectUrl.pathname + redirectUrl.search;
      }
    } catch {
      // Invalid URL, use default
    }
  }

  // Redirect to the destination
  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}

