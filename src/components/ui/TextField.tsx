import React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  showClearButton?: boolean;
  onClear?: () => void;
}

export const TextField: React.FC<TextFieldProps> = ({ 
  variant = 'outlined',
  showClearButton = false,
  onClear,
  value,
  ...props 
}) => {
  const hasValue = value && String(value).length > 0;

  return (
    <MuiTextField
      variant={variant}
      value={value}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: showClearButton && hasValue && onClear ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="clear search"
              onClick={onClear}
              edge="end"
              size="small"
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : undefined,
        ...props.InputProps,
      }}
      {...props}
    />
  );
};
