'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Autocomplete, AutocompleteOption } from '@/components/ui/Autocomplete';
import { Item } from '@/types/shopping-list';
import { useAddItemToListWithAutoCreate } from '@/hooks/useListMutations';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useTranslations } from 'next-intl';

export interface AddItemToListProps {
  listId: string;
  allItems: Item[];
  onItemAdded?: () => void;
}

export const AddItemToList: React.FC<AddItemToListProps> = ({
  listId,
  allItems,
  onItemAdded,
}) => {
  const t = useTranslations('items');
  const [searchInput, setSearchInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);
  const { showSuccess, showError, showWarning } = useSnackbar();
  const addItemMutation = useAddItemToListWithAutoCreate();

  // Convert items to autocomplete options
  const itemOptions = useMemo(() => {
    return allItems.map(item => ({
      label: item.name,
      value: item.name,
      type: 'item' as const,
      emoji: item.emoji,
    }));
  }, [allItems]);

  // Filter options based on search input
  const filteredOptions = useMemo(() => {
    if (!searchInput.trim()) {
      return itemOptions;
    }
    
    const searchTerm = searchInput.toLowerCase();
    return itemOptions.filter(option => 
      option.label.toLowerCase().includes(searchTerm)
    );
  }, [itemOptions, searchInput]);

  const handleSearchChange = useCallback((event: React.SyntheticEvent, newValue: AutocompleteOption | AutocompleteOption[] | null) => {
    // Handle single selection (not multiple)
    if (Array.isArray(newValue)) {
      // This shouldn't happen in single mode, but handle gracefully
      setSelectedOption(null);
      setSearchInput('');
    } else {
      setSelectedOption(newValue);
      if (newValue && typeof newValue === 'object') {
        setSearchInput(newValue.label);
      } else {
        setSearchInput('');
      }
    }
  }, []);

  const handleInputChange = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setSearchInput(newValue);
    // Clear selected option when typing manually
    if (selectedOption && selectedOption.label !== newValue) {
      setSelectedOption(null);
    }
  }, [selectedOption]);

  const handleSubmit = useCallback(async () => {
    if (!searchInput.trim() || addItemMutation.isPending) {
      return;
    }
    
    try {
      const result = await addItemMutation.mutateAsync({ listId, itemName: searchInput.trim() });
      
      // Clear the input
      setSearchInput('');
      setSelectedOption(null);
      
      // Show appropriate message
      if (result.warning) {
        showWarning(result.warning);
      } else {
        showSuccess(`${searchInput.trim()} ${t('itemAddedToList')}`);
      }
      
      // Notify parent component
      onItemAdded?.();
    } catch (error) {
      console.error('Error adding item to list:', error);
      showError(error instanceof Error ? error.message : t('failedToAddItem'));
    }
  }, [listId, searchInput, addItemMutation, showSuccess, showError, showWarning, onItemAdded]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !addItemMutation.isPending) {
      event.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit, addItemMutation.isPending]);

  return (
    <Box
      data-testid="add-item-to-list"
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: 1,
        border: '2px dashed',
        borderColor: 'primary.main',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderColor: 'primary.dark',
        },
        '&:focus-within': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderColor: 'primary.dark',
          borderStyle: 'solid',
        },
      }}
    >
      <AddIcon 
        sx={{ 
          mr: 1, 
          color: 'primary.main',
          fontSize: '1.2em'
        }} 
      />
      
      <Box sx={{ flexGrow: 1 }}>
        <Autocomplete
          fullWidth
          placeholder={t('addItemToList')}
          value={selectedOption}
          onChange={handleSearchChange}
          onInputChange={handleInputChange}
          options={filteredOptions}
          size="small"
          noOptionsText={t('typeToSearch')}
          loadingText={t('loading')}
          disabled={addItemMutation.isPending}
          onKeyDown={handleKeyPress}
          freeSolo={true}
          data-testid="add-item-input"
          sx={{
            '& .MuiOutlinedInput-root': {
              border: 'none',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};
