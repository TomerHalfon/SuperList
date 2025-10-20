import React from 'react';
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps } from '@mui/material';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'size'> {
  size?: 'small' | 'medium';
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  size = 'medium',
  label,
  sx,
  ...props 
}) => {
  return (
    <MuiCheckbox
      size={size}
      sx={{
        ...sx,
      }}
      {...props}
    />
  );
};
