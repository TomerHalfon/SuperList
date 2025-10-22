import React from 'react';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Link } from '@/components/ui/Link';

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Don't have an account?{' '}
          <Link href="/signup" underline="hover">
            Sign up
          </Link>
        </Typography>
      </Box>
    </>
  );
}

