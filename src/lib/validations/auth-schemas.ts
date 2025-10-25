import { z } from 'zod';

// Helper function to create localized validation messages
const createLocalizedSchema = (messages: Record<string, string>) => {
  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired || 'Email is required')
      .email(messages.invalidEmail || 'Invalid email address'),
    password: z
      .string()
      .min(1, messages.passwordRequired || 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
  });
};

/**
 * Sign in schema
 */
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type SignInSchema = z.infer<typeof signInSchema>;

/**
 * Sign up schema
 */
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be less than 72 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

/**
 * Create localized schemas
 */
export const createSignInSchema = (messages: Record<string, string>) => {
  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired || 'Email is required')
      .email(messages.invalidEmail || 'Invalid email address'),
    password: z
      .string()
      .min(1, messages.passwordRequired || 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
  });
};

export const createSignUpSchema = (messages: Record<string, string>) => {
  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired || 'Email is required')
      .email(messages.invalidEmail || 'Invalid email address'),
    password: z
      .string()
      .min(1, messages.passwordRequired || 'Password is required')
      .min(6, messages.passwordMinLength || 'Password must be at least 6 characters')
      .max(72, messages.passwordMaxLength || 'Password must be less than 72 characters'),
    confirmPassword: z
      .string()
      .min(1, messages.confirmPasswordRequired || 'Please confirm your password'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: messages.passwordsDontMatch || "Passwords don't match",
    path: ['confirmPassword'],
  });
};

