import React from 'react';
import { 
  Autocomplete as MuiAutocomplete, 
  AutocompleteProps as MuiAutocompleteProps,
  TextField,
  Chip as MuiChip,
  Box
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { Chip } from './Chip';

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
  multiple?: boolean;
  value?: AutocompleteOption | AutocompleteOption[] | null;
  onChange?: (event: React.SyntheticEvent, value: AutocompleteOption | AutocompleteOption[] | null) => void;
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
  multiple = false,
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
  const hasValue = multiple 
    ? Array.isArray(value) && value.length > 0
    : value && String(value).length > 0;

  const renderOption = (props: any, option: AutocompleteOption) => {
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
            <MuiChip 
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
  };

  const renderInput = (params: any) => (
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
  );

  const renderTags = (tagValue: AutocompleteOption[], getTagProps: any) => {
    return tagValue.map((option, index) => (
      <Chip
        {...getTagProps({ index })}
        key={option.value}
        label={option.label}
        size="small"
        variant="outlined"
        color="primary"
      />
    ));
  };

  if (freeSolo) {
    if (multiple) {
      return (
        <MuiAutocomplete<AutocompleteOption, true, false, true>
          freeSolo={true}
          multiple={true}
          options={options}
          value={value as AutocompleteOption[]}
          onChange={(event, value, reason, details) => {
            if (onChange && Array.isArray(value)) {
              onChange(event, value as AutocompleteOption[]);
            }
          }}
          onInputChange={onInputChange}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option;
            return option.label;
          }}
          renderOption={renderOption}
          renderInput={renderInput}
          renderTags={renderTags}
          noOptionsText={noOptionsText}
          loadingText={loadingText}
          {...props}
        />
      );
    } else {
      return (
        <MuiAutocomplete<AutocompleteOption, false, false, true>
          freeSolo={true}
          multiple={false}
          options={options}
          value={value as AutocompleteOption}
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
          renderOption={renderOption}
          renderInput={renderInput}
          noOptionsText={noOptionsText}
          loadingText={loadingText}
          {...props}
        />
      );
    }
  }

  if (multiple) {
    return (
      <MuiAutocomplete<AutocompleteOption, true, false, false>
        freeSolo={false}
        multiple={true}
        options={options}
        value={value as AutocompleteOption[]}
        onChange={(event, value, reason, details) => {
          if (onChange && Array.isArray(value)) {
            onChange(event, value as AutocompleteOption[]);
          }
        }}
        onInputChange={onInputChange}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option.label;
        }}
        renderOption={renderOption}
        renderInput={renderInput}
        renderTags={renderTags}
        noOptionsText={noOptionsText}
        loadingText={loadingText}
        {...props}
      />
    );
  }

  return (
    <MuiAutocomplete<AutocompleteOption, false, false, false>
      freeSolo={false}
      multiple={false}
      options={options}
      value={value as AutocompleteOption}
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
      renderOption={renderOption}
      renderInput={renderInput}
      noOptionsText={noOptionsText}
      loadingText={loadingText}
      {...props}
    />
  );
};
