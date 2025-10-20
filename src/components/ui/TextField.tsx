import React, { forwardRef } from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  showClearButton?: boolean;
  showSearchIcon?: boolean;
  onClear?: () => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ 
  variant = 'outlined',
  showClearButton = false,
  showSearchIcon = false,
  onClear,
  value,
  InputProps,
  ...props 
}, ref) => {
  const hasValue = value && String(value).length > 0;

  const startAdornment = showSearchIcon ? (
    <InputAdornment position="start">
      <SearchIcon color="action" />
    </InputAdornment>
  ) : undefined;

  const endAdornment = showClearButton && hasValue && onClear ? (
    <InputAdornment position="end">
      <IconButton
        aria-label="clear"
        onClick={onClear}
        edge="end"
        size="small"
      >
        <ClearIcon />
      </IconButton>
    </InputAdornment>
  ) : undefined;

  return (
    <MuiTextField
      variant={variant}
      value={value}
      inputRef={ref}
      InputProps={{
        startAdornment,
        endAdornment,
        ...InputProps,
      }}
      {...props}
    />
  );
});

TextField.displayName = 'TextField';
