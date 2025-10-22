'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { ThemeSwitcher } from '@/components/features/ThemeSwitcher';
import { UserMenu } from '@/components/features/auth/UserMenu';
import { onAuthStateChange } from '@/lib/auth/auth-helpers';
import type { User } from '@/types/auth';

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to auth state changes to get user
    // This also immediately fires with the current session
    const subscription = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      
      <Box sx={{ 
        flexShrink: 0,
        alignSelf: 'flex-start',
        pt: { xs: 0.5, sm: 0 },
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        {showThemeSwitcher && <ThemeSwitcher />}
        {user && <UserMenu user={user} />}
      </Box>
    </Box>
  );
};
