'use client';

import { createClientSupabaseClient } from '@/lib/storage/supabase/client';
import type { OAuthProvider } from '@/types/auth';

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClientSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClientSupabaseClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign in with OAuth provider (Google, etc.)
 */
export async function signInWithOAuth(provider: OAuthProvider, redirectTo?: string) {
  const supabase = createClientSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClientSupabaseClient();
  
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Get the current user (client-side)
 */
export async function getCurrentUser() {
  const supabase = createClientSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    // Silently handle missing session errors (occurs after logout)
    if (error.message === 'Auth session missing!' || error.name === 'AuthSessionMissingError') {
      return null;
    }
    console.error('Error fetching user:', error);
    return null;
  }

  return user;
}

/**
 * Get the current session (client-side)
 */
export async function getCurrentSession() {
  const supabase = createClientSupabaseClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    // Silently handle missing session errors (occurs after logout)
    if (error.message === 'Auth session missing!' || error.name === 'AuthSessionMissingError') {
      return null;
    }
    console.error('Error fetching session:', error);
    return null;
  }

  return session;
}

/**
 * Subscribe to authentication state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createClientSupabaseClient();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);

  return subscription;
}

