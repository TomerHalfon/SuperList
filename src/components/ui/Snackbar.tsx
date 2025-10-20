'use client';

import React from 'react';
import { Snackbar as MuiSnackbar, SnackbarProps as MuiSnackbarProps } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';

export interface SnackbarProps extends Omit<MuiSnackbarProps, 'anchorOrigin'> {
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  responsive?: boolean;
}

export const Snackbar: React.FC<SnackbarProps> = ({ 
  responsive = true,
  anchorOrigin,
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Default responsive positioning
  const defaultAnchorOrigin = responsive 
    ? {
        vertical: (isMobile ? 'bottom' : 'top') as 'top' | 'bottom',
        horizontal: (isMobile ? 'center' : 'right') as 'left' | 'center' | 'right',
      }
    : {
        vertical: 'bottom' as const,
        horizontal: 'center' as const,
      };

  return (
    <MuiSnackbar 
      anchorOrigin={anchorOrigin || defaultAnchorOrigin}
      {...props} 
    />
  );
};
