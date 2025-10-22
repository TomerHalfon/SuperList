'use client';

import React, { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
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
import GoogleIcon from '@mui/icons-material/Google';

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('rememberMe', String(rememberMe));
    if (redirectTo) {
      formData.append('redirect', redirectTo);
    }

    startTransition(async () => {
      const result = await signInWithEmailAction(formData);
      if (result?.error) {
        setError(result.error);
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
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
            disabled={isPending || isOAuthLoading}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
            disabled={isPending || isOAuthLoading}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isPending || isOAuthLoading}
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Remember me
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isPending || isOAuthLoading}
            size="large"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
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
            {isOAuthLoading ? 'Redirecting...' : 'Sign in with Google'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

