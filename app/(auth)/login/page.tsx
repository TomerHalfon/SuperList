import React from 'react';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Link } from '@/components/ui/Link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');
  
  return (
    <>
      <LoginForm />
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {t('dontHaveAccount')}{' '}
          <Link href="/signup" underline="hover">
            {t('signUp')}
          </Link>
        </Typography>
      </Box>
    </>
  );
}

