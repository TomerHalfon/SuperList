import React from 'react';
import { Box } from '@/components/ui/Box';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          SuperList
        </Typography>
        {children}
      </Box>
    </Container>
  );
}

