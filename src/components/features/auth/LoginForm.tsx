'use client';

import React, { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Stack } from '@/components/ui/Stack';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Checkbox } from '@/components/ui/Checkbox';
import { Alert } from '@/components/ui/Alert';
import { Divider } from '@/components/ui/Divider';
import { signInWithEmailAction } from '@/actions/auth';
import { signInWithOAuth } from '@/lib/auth/auth-helpers';
import { createSignInSchema } from '@/lib/validations/auth-schemas';
import { useTranslations } from 'next-intl';
import GoogleIcon from '@mui/icons-material/Google';

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const t = useTranslations('auth');
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  // Create localized validation schema
  const validationSchema = createSignInSchema({
    emailRequired: t('emailRequired'),
    invalidEmail: t('emailInvalid'),
    passwordRequired: t('passwordRequired'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: { email: string; password: string; rememberMe: boolean }) => {
    setError(null);

    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('rememberMe', String(data.rememberMe));
    if (redirectTo) {
      formData.append('redirect', redirectTo);
    }

    startTransition(async () => {
      const result = await signInWithEmailAction(formData);
      if (result?.error) {
        // Map server errors to user-friendly messages
        if (result.error.includes('Invalid login credentials') || 
            result.error.includes('Invalid email or password')) {
          setError(t('invalidCredentials'));
        } else {
          setError(result.error);
        }
      }
    });
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsOAuthLoading(true);

    try {
      const redirectUrl = redirectTo
        ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
        : `${window.location.origin}/auth/callback`;
      
      await signInWithOAuth('google', redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsOAuthLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            {t('signIn')}
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              data-testid="login-error-alert"
            >
              {error}
            </Alert>
          )}

          <TextField
            label={t('email')}
            type="email"
            fullWidth
            autoComplete="email"
            disabled={isPending || isOAuthLoading}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
          />

          <TextField
            label={t('password')}
            type="password"
            fullWidth
            autoComplete="current-password"
            disabled={isPending || isOAuthLoading}
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={rememberMe}
              disabled={isPending || isOAuthLoading}
              {...register('rememberMe')}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {t('rememberMe')}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isOAuthLoading}
            loading={isPending}
            size="large"
            data-testid="sign-in-button"
          >
            {t('signIn')}
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            type="button"
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={isPending || isOAuthLoading}
          >
            {isOAuthLoading ? t('redirecting') : t('signInWithGoogle')}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

