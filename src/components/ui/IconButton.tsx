import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';

export interface IconButtonProps extends Omit<MuiIconButtonProps, 'size'> {
  size?: 'small' | 'medium' | 'large';
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  size = 'medium',
  sx,
  ...props 
}) => {
  return (
    <MuiIconButton
      size={size}
      sx={{
        ...sx,
      }}
      {...props}
    />
  );
};
