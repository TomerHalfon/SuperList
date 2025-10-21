import React from 'react';
import { 
  Chip as MuiChip, 
  ChipProps as MuiChipProps 
} from '@mui/material';

export interface ChipProps extends MuiChipProps {
  label: string;
  onDelete?: () => void;
  variant?: 'filled' | 'outlined';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium';
}

export const Chip: React.FC<ChipProps> = ({ 
  label, 
  onDelete, 
  variant = 'outlined', 
  color = 'default', 
  size = 'small',
  ...props 
}) => {
  return (
    <MuiChip
      label={label}
      onDelete={onDelete}
      variant={variant}
      color={color}
      size={size}
      {...props}
    />
  );
};
