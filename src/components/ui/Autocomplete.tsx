import React from 'react';
import { 
  Autocomplete as MuiAutocomplete, 
  AutocompleteProps as MuiAutocompleteProps,
  TextField,
  Chip,
  Box
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

export interface AutocompleteOption {
  label: string;
  value: string;
  type: 'item' | 'tag';
  emoji?: string;
}

export interface AutocompleteProps {
  placeholder?: string;
  showClearButton?: boolean;
  onClear?: () => void;
  freeSolo?: boolean;
  value?: AutocompleteOption | null;
  onChange?: (event: React.SyntheticEvent, value: AutocompleteOption | null) => void;
  onInputChange?: (event: React.SyntheticEvent, value: string) => void;
  options?: AutocompleteOption[];
  size?: 'small' | 'medium';
  noOptionsText?: string;
  loadingText?: string;
  disabled?: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  fullWidth?: boolean;
  sx?: any;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  placeholder = "Search items by name or tags...",
  showClearButton = false,
  onClear,
  freeSolo = false,
  value,
  options = [],
  onChange,
  onInputChange,
  size = 'medium',
  noOptionsText = 'No options',
  loadingText = 'Loading...',
  disabled = false,
  onKeyDown,
  fullWidth = false,
  sx,
  ...props
}) => {
  const hasValue = value && String(value).length > 0;

  if (freeSolo) {
    return (
      <MuiAutocomplete<AutocompleteOption, false, false, true>
        freeSolo={true}
        options={options}
        value={value}
        onChange={(event, value, reason, details) => {
          if (onChange && typeof value !== 'string') {
            onChange(event, value);
          }
        }}
        onInputChange={onInputChange}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option.label;
        }}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {option.type === 'item' && option.emoji && (
                  <span style={{ marginRight: 8, fontSize: '1.1em' }}>
                    {option.emoji}
                  </span>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                  <span>{option.label}</span>
                  <Chip 
                    label={option.type} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem',
                      backgroundColor: option.type === 'item' ? 'primary.50' : 'secondary.50',
                      color: option.type === 'item' ? 'primary.main' : 'secondary.main',
                      borderColor: option.type === 'item' ? 'primary.main' : 'secondary.main'
                    }}
                  />
                </Box>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
            onKeyDown={onKeyDown}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchIcon color="action" sx={{ mr: 1 }} />
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: showClearButton && onClear ? (
                <ClearIcon 
                  onClick={hasValue ? onClear : undefined}
                  sx={{ 
                    cursor: hasValue ? 'pointer' : 'default',
                    color: hasValue ? 'action.active' : 'transparent',
                    '&:hover': { 
                      color: hasValue ? 'action.hover' : 'transparent' 
                    },
                    transition: 'color 0.2s ease-in-out'
                  }}
                />
              ) : params.InputProps.endAdornment,
            }}
            sx={sx}
          />
        )}
        noOptionsText={noOptionsText}
        loadingText={loadingText}
        {...props}
      />
    );
  }

  return (
    <MuiAutocomplete<AutocompleteOption, false, false, false>
      freeSolo={false}
      options={options}
      value={value}
      onChange={onChange}
      onInputChange={onInputChange}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.label;
      }}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {option.type === 'item' && option.emoji && (
                <span style={{ marginRight: 8, fontSize: '1.1em' }}>
                  {option.emoji}
                </span>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                <span>{option.label}</span>
                <Chip 
                  label={option.type} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    height: 20, 
                    fontSize: '0.7rem',
                    backgroundColor: option.type === 'item' ? 'primary.50' : 'secondary.50',
                    color: option.type === 'item' ? 'primary.main' : 'secondary.main',
                    borderColor: option.type === 'item' ? 'primary.main' : 'secondary.main'
                  }}
                />
              </Box>
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          size={size}
          disabled={disabled}
          fullWidth={fullWidth}
          onKeyDown={onKeyDown}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <SearchIcon color="action" sx={{ mr: 1 }} />
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: showClearButton && onClear ? (
              <ClearIcon 
                onClick={hasValue ? onClear : undefined}
                sx={{ 
                  cursor: hasValue ? 'pointer' : 'default',
                  color: hasValue ? 'action.active' : 'transparent',
                  '&:hover': { 
                    color: hasValue ? 'action.hover' : 'transparent' 
                  },
                  transition: 'color 0.2s ease-in-out'
                }}
              />
            ) : params.InputProps.endAdornment,
          }}
          sx={sx}
        />
      )}
      noOptionsText={noOptionsText}
      loadingText={loadingText}
      {...props}
    />
  );
};
