import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium',
  loading = false,
  children,
  disabled,
  ...props 
}) => {
  const isDisabled = disabled || loading;
  
  return (
    <MuiButton 
      variant={variant} 
      color={color} 
      size={size} 
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <CircularProgress 
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
          color="inherit"
          sx={{ mr: 1 }}
        />
      )}
      {children}
    </MuiButton>
  );
};
