import React from 'react';
import { Typography as MuiTypography, TypographyProps as MuiTypographyProps } from '@mui/material';

export interface TypographyProps extends Omit<MuiTypographyProps, 'variant'> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'subtitle1' | 'subtitle2';
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body1',
  color = 'textPrimary',
  sx,
  ...props 
}) => {
  return (
    <MuiTypography
      variant={variant}
      color={color}
      sx={{
        ...sx,
      }}
      {...props}
    />
  );
};
