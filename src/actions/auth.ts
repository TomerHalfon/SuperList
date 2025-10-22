'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/storage/supabase/server';
import { signInSchema, signUpSchema } from '@/lib/validations/auth-schemas';

/**
 * Sign in with email and password (Server Action)
 */
export async function signInWithEmailAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirect') as string | null;

  // Validate input
  const validation = signInSchema.safeParse({ email, password });
  
  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  const supabase = await createServerSupabaseClient();

  // Sign in
  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  // Revalidate the layout to update auth state
  revalidatePath('/', 'layout');

  // Redirect to the original page or home
  const destination = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/';
  redirect(destination);
}

/**
 * Sign up with email and password (Server Action)
 */
export async function signUpWithEmailAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validate input
  const validation = signUpSchema.safeParse({ email, password, confirmPassword });
  
  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  const supabase = await createServerSupabaseClient();

  // Sign up
  const { error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  // Revalidate the layout to update auth state
  revalidatePath('/', 'layout');

  // Redirect to home page
  redirect('/');
}

/**
 * Sign out (Server Action)
 */
export async function signOutAction() {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: error.message,
    };
  }

  // Revalidate the layout to update auth state
  revalidatePath('/', 'layout');

  // Redirect to login page
  redirect('/login');
}

