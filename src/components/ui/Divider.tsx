import React from 'react';
import { Divider as MuiDivider, DividerProps as MuiDividerProps } from '@mui/material';

export interface DividerProps extends MuiDividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'inset' | 'middle';
  flexItem?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ 
  orientation = 'horizontal',
  variant = 'fullWidth',
  flexItem = false,
  ...props 
}) => {
  return (
    <MuiDivider 
      orientation={orientation}
      variant={variant}
      flexItem={flexItem}
      {...props}
    />
  );
};
