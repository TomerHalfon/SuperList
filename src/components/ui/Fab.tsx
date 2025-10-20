import React from 'react';
import { Fab as MuiFab, FabProps as MuiFabProps } from '@mui/material';

export interface FabProps extends Omit<MuiFabProps, 'color'> {
  color?: 'primary' | 'secondary' | 'inherit' | 'default';
  size?: 'small' | 'medium' | 'large';
}

export const Fab: React.FC<FabProps> = ({ 
  color = 'primary', 
  size = 'large',
  sx,
  ...props 
}) => {
  return (
    <MuiFab
      color={color}
      size={size}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        ...sx,
      }}
      {...props}
    />
  );
};
