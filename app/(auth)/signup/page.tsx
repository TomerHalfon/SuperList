import React from 'react';
import { SignupForm } from '@/components/features/auth/SignupForm';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Link } from '@/components/ui/Link';

export default function SignupPage() {
  return (
    <>
      <SignupForm />
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Already have an account?{' '}
          <Link href="/login" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Box>
    </>
  );
}

