import React from 'react';
import { Box } from '@/components/ui/Box';
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/features/LanguageSwitcher';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('app');
  
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
        {/* Language switcher in top right */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <LanguageSwitcher size="small" />
        </Box>
        
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {t('title')}
        </Typography>
        {children}
      </Box>
    </Container>
  );
}

