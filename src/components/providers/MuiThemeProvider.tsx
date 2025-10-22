'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { useTheme } from '@/hooks/useTheme';
import { getTheme } from '@/lib/theme/themes';
import { useLocale } from 'next-intl';

interface MuiThemeProviderProps {
  children: React.ReactNode;
}

export const MuiThemeProvider: React.FC<MuiThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  const locale = useLocale();
  const isRTL = locale === 'he';
  
  const muiTheme = getTheme(theme, isRTL);

  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
