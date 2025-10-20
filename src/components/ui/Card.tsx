import React from 'react';
import { Card as MuiCard, CardContent as MuiCardContent, CardActions as MuiCardActions, CardProps as MuiCardProps } from '@mui/material';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'elevation' | 'outlined';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'elevation', 
  hover = false,
  sx,
  ...props 
}) => {
  return (
    <MuiCard
      variant={variant}
      sx={{
        cursor: hover ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': hover ? {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        } : {},
        ...sx,
      }}
      {...props}
    />
  );
};

export interface CardContentProps {
  children: React.ReactNode;
  sx?: MuiCardProps['sx'];
}

export const CardContent: React.FC<CardContentProps> = ({ children, sx, ...props }) => {
  return (
    <MuiCardContent sx={{ ...sx }} {...props}>
      {children}
    </MuiCardContent>
  );
};

export interface CardActionsProps {
  children: React.ReactNode;
  sx?: MuiCardProps['sx'];
}

export const CardActions: React.FC<CardActionsProps> = ({ children, sx, ...props }) => {
  return (
    <MuiCardActions sx={{ ...sx }} {...props}>
      {children}
    </MuiCardActions>
  );
};
