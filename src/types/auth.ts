import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

/**
 * Re-export Supabase auth types for consistent usage
 */
export type User = SupabaseUser;
export type Session = SupabaseSession;

/**
 * Authentication error types
 */
export interface AuthError {
  message: string;
  status?: number;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

/**
 * Sign in credentials
 */
export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Sign up credentials
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * OAuth provider types
 * Using Supabase's built-in Provider type
 */
export type OAuthProvider = 'google';

