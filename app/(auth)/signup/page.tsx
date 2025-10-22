import React from 'react';
import { SignupForm } from '@/components/features/auth/SignupForm';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Link } from '@/components/ui/Link';
import { useTranslations } from 'next-intl';

export default function SignupPage() {
  const t = useTranslations('auth');
  
  return (
    <>
      <SignupForm />
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login" underline="hover">
            {t('signIn')}
          </Link>
        </Typography>
      </Box>
    </>
  );
}

