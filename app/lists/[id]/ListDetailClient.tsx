'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Box } from '@/components/ui/Box';
import { Divider } from '@/components/ui/Divider';
import { ShoppingListHeader } from '@/components/features/ShoppingListHeader';
import { ShoppingListItem } from '@/components/features/ShoppingListItem';
import { AppHeader } from '@/components/layout/AppHeader';
import { Typography } from '@/components/ui/Typography';
import { Autocomplete, AutocompleteOption } from '@/components/ui/Autocomplete';
import { ShoppingList, ShoppingListItem as ShoppingListItemType, Item } from '@/types/shopping-list';
import { getItemDetails } from '@/lib/utils/list-helpers';
import { filterItemsBySearch } from '@/lib/utils/search-helpers';
import { filterSuggestions } from '@/lib/utils/search-suggestions';
import { useDebounce } from '@/hooks/useDebounce';
import { toggleItemCollectedAction } from '@/actions/lists';

interface ListDetailClientProps {
  list: ShoppingList;
  items: Item[];
  allSuggestions: AutocompleteOption[];
}

export function ListDetailClient({ list, items, allSuggestions }: ListDetailClientProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);
  const debouncedSearchInput = useDebounce(searchInput, 300);

  const filteredSuggestions = useMemo(() => {
    return filterSuggestions(allSuggestions, searchInput);
  }, [allSuggestions, searchInput]);

  const handleBack = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleToggleItem = useCallback(async (itemId: string) => {
    try {
      const result = await toggleItemCollectedAction(list.id, itemId);
      if (result.success) {
        // The page will be revalidated automatically by the Server Action
        // No need to update local state
      } else {
        console.error('Failed to toggle item:', result.error);
        // TODO: Show error toast/notification
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      // TODO: Show error toast/notification
    }
  }, [list.id]);

  const handleSearchChange = useCallback((event: React.SyntheticEvent, newValue: AutocompleteOption | null) => {
    setSelectedOption(newValue);
    if (newValue && typeof newValue === 'object') {
      setSearchInput(newValue.label);
    } else {
      setSearchInput('');
    }
  }, []);

  const handleInputChange = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setSearchInput(newValue);
    // Clear selected option when typing manually
    if (selectedOption && selectedOption.label !== newValue) {
      setSelectedOption(null);
    }
  }, [selectedOption]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSelectedOption(null);
  }, []);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    const allItems = list.items.map(item => {
      const itemDetails = getItemDetails(item.itemId, items);
      return itemDetails ? { ...item, itemDetails } : null;
    }).filter(Boolean) as Array<ShoppingListItemType & { itemDetails: Item }>;

    const filtered = allItems.filter(item => 
      filterItemsBySearch([item.itemDetails], debouncedSearchInput).length > 0
    );

    return {
      uncollected: filtered.filter(item => !item.collected),
      collected: filtered.filter(item => item.collected),
    };
  }, [list.items, items, debouncedSearchInput]);

  // Use filtered items
  const uncollectedItems = filteredItems.uncollected;
  const collectedItems = filteredItems.collected;

  return (
    <Container maxWidth="lg">
      <ShoppingListHeader list={list} onBack={handleBack} />

      {/* Search Field */}
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          fullWidth
          placeholder="Search items by name or tags (e.g., dairy, breakfast)..."
          value={selectedOption}
          onChange={handleSearchChange}
          onInputChange={handleInputChange}
          options={filteredSuggestions}
          showClearButton
          onClear={handleClearSearch}
          size="small"
          noOptionsText="No suggestions found"
          loadingText="Loading suggestions..."
        />
      </Box>

      <Box>
        {/* Uncollected items */}
        {uncollectedItems.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Items to collect ({uncollectedItems.length})
            </Typography>
            {uncollectedItems.map((item) => {
              return (
                <ShoppingListItem
                  key={item.itemId}
                  item={item.itemDetails}
                  quantity={item.quantity}
                  collected={item.collected}
                  onToggle={handleToggleItem}
                />
              );
            })}
          </Box>
        )}

        {/* Collected items */}
        {collectedItems.length > 0 && (
          <Box>
            {uncollectedItems.length > 0 && <Divider sx={{ my: 3 }} />}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
              Collected items ({collectedItems.length})
            </Typography>
            {collectedItems.map((item) => {
              return (
                <ShoppingListItem
                  key={item.itemId}
                  item={item.itemDetails}
                  quantity={item.quantity}
                  collected={item.collected}
                  onToggle={handleToggleItem}
                />
              );
            })}
          </Box>
        )}

        {/* Empty state */}
        {list.items.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary">
              No items in this list
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Add some items to get started!
            </Typography>
          </Box>
        )}

        {/* No search results */}
        {list.items.length > 0 && uncollectedItems.length === 0 && collectedItems.length === 0 && debouncedSearchInput && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary">
              No items found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Try searching with different terms or clear the search to see all items.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
