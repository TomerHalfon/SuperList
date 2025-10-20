import React from 'react';
import { 
  Select as MuiSelect, 
  SelectProps as MuiSelectProps,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText
} from '@mui/material';

export interface SelectProps extends Omit<MuiSelectProps, 'variant'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  error = false,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  options = [],
  children,
  ...props
}) => {
  return (
    <FormControl 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth}
      error={error}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        label={label}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        {...props}
      >
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
        {children}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
