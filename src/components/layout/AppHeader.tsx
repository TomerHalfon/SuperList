'use client';

import React from 'react';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { ThemeSwitcher } from '@/components/features/ThemeSwitcher';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showThemeSwitcher?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'SuperList',
  subtitle = 'Your Shopping Lists Dashboard',
  showThemeSwitcher = true,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 4,
        gap: 2,
      }}
    >
      <Box sx={{ 
        flex: 1, 
        minWidth: 0,
        pr: { xs: 1, sm: 2 } // Add padding to prevent overlap
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 1, 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '2.125rem', md: '3rem' },
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h6" 
          color="textSecondary"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1.25rem' },
            lineHeight: 1.3,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      
      {showThemeSwitcher && (
        <Box sx={{ 
          flexShrink: 0,
          alignSelf: 'flex-start',
          pt: { xs: 0.5, sm: 0 } // Small top padding on mobile
        }}>
          <ThemeSwitcher />
        </Box>
      )}
    </Box>
  );
};
