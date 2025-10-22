'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Stack } from '@/components/ui/Stack';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Alert } from '@/components/ui/Alert';
import { Divider } from '@/components/ui/Divider';
import { signUpWithEmailAction } from '@/actions/auth';
import { signInWithOAuth } from '@/lib/auth/auth-helpers';
import { useTranslations } from 'next-intl';
import GoogleIcon from '@mui/icons-material/Google';

export const SignupForm: React.FC = () => {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    startTransition(async () => {
      const result = await signUpWithEmailAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setIsOAuthLoading(true);

    try {
      await signInWithOAuth('google');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
      setIsOAuthLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            {t('createAccount')}
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TextField
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
            disabled={isPending || isOAuthLoading}
          />

          <TextField
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="new-password"
            disabled={isPending || isOAuthLoading}
            helperText={t('mustBeAtLeast6Chars')}
          />

          <TextField
            label={t('confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            autoComplete="new-password"
            disabled={isPending || isOAuthLoading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isPending || isOAuthLoading}
            size="large"
          >
            {isPending ? t('creatingAccount') : t('signUp')}
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            type="button"
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignUp}
            disabled={isPending || isOAuthLoading}
          >
            {isOAuthLoading ? t('redirecting') : t('signInWithGoogle')}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

