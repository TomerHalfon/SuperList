'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { Box } from '@/components/ui/Box';
import { Divider } from '@/components/ui/Divider';
import { ShoppingListHeader } from '@/components/features/ShoppingListHeader';
import { ShoppingListItem } from '@/components/features/ShoppingListItem';
import { AddItemToList } from '@/components/features/AddItemToList';
import { DeleteListDialog } from '@/components/features/DeleteListDialog';
import { EditItemQuantityDialog } from '@/components/features/EditItemQuantityDialog';
import { AppHeader } from '@/components/layout/AppHeader';
import { Typography } from '@/components/ui/Typography';
import { Autocomplete, AutocompleteOption } from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { ShoppingList, ShoppingListItem as ShoppingListItemType, Item } from '@/types/shopping-list';
import { getItemDetails } from '@/lib/utils/list-helpers';
import { filterItemsBySearch } from '@/lib/utils/search-helpers';
import { filterSuggestions } from '@/lib/utils/search-suggestions';
import { useDebounce } from '@/hooks/useDebounce';
import { toggleItemCollectedAction, updateListNameAction, deleteListAction, updateListItemAction } from '@/actions/lists';
import { useSnackbar } from '@/components/providers/SnackbarProvider';

interface ListDetailClientProps {
  list: ShoppingList;
  items: Item[];
  allSuggestions: AutocompleteOption[];
}

export function ListDetailClient({ list, items, allSuggestions }: ListDetailClientProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: Item; currentQuantity: number } | null>(null);
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const { showSuccess, showError } = useSnackbar();

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
        showSuccess('Item status updated');
        // The page will be revalidated automatically by the Server Action
        // No need to update local state
      } else {
        console.error('Failed to toggle item:', result.error);
        showError(result.error || 'Failed to update item status');
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      showError('Failed to update item status');
    }
  }, [list.id, showSuccess, showError]);

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

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSelectedOption(null);
  }, []);

  const handleNameUpdate = useCallback(async (newName: string) => {
    try {
      const result = await updateListNameAction(list.id, newName);
      if (result.success) {
        showSuccess('List name updated');
        // The page will be revalidated automatically by the Server Action
      } else {
        console.error('Failed to update list name:', result.error);
        showError(result.error || 'Failed to update list name');
      }
    } catch (error) {
      console.error('Error updating list name:', error);
      showError('Failed to update list name');
    }
  }, [list.id, showSuccess, showError]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      const result = await deleteListAction(list.id);
      if (result.success) {
        showSuccess('Shopping list deleted successfully');
        setDeleteDialogOpen(false);
        router.push('/');
      } else {
        console.error('Failed to delete list:', result.error);
        showError(result.error || 'Failed to delete shopping list');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      showError('Failed to delete shopping list');
    }
  }, [list.id, showSuccess, showError, router]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const handleQuantityChange = useCallback(async (itemId: string, newQuantity: number) => {
    try {
      const formData = new FormData();
      formData.append('quantity', newQuantity.toString());
      
      const result = await updateListItemAction(list.id, itemId, formData);
      if (result.success) {
        showSuccess('Quantity updated');
        // The page will be revalidated automatically by the Server Action
      } else {
        console.error('Failed to update quantity:', result.error);
        showError(result.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showError('Failed to update quantity');
    }
  }, [list.id, showSuccess, showError]);

  const handleEditClick = useCallback((itemId: string, currentQuantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setEditingItem({ item, currentQuantity });
      setEditDialogOpen(true);
    }
  }, [items]);

  const handleEditDialogClose = useCallback(() => {
    setEditDialogOpen(false);
    setEditingItem(null);
  }, []);

  const handleEditDialogSave = useCallback(async (newQuantity: number) => {
    if (!editingItem) return;

    try {
      const formData = new FormData();
      formData.append('quantity', newQuantity.toString());
      
      const result = await updateListItemAction(list.id, editingItem.item.id, formData);
      if (result.success) {
        showSuccess('Quantity updated');
        setEditDialogOpen(false);
        setEditingItem(null);
        // The page will be revalidated automatically by the Server Action
      } else {
        console.error('Failed to update quantity:', result.error);
        showError(result.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showError('Failed to update quantity');
    }
  }, [list.id, editingItem, showSuccess, showError]);

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
      <ShoppingListHeader list={list} onBack={handleBack} onNameUpdate={handleNameUpdate} />

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
        {/* Add Item Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Items to collect ({uncollectedItems.length})
          </Typography>
          <AddItemToList
            listId={list.id}
            allItems={items}
            onItemAdded={() => {
              // The page will be revalidated automatically by the Server Action
              // No need to update local state
            }}
          />
        </Box>

        {/* Uncollected items */}
        {uncollectedItems.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {uncollectedItems.map((item) => {
              return (
                <ShoppingListItem
                  key={item.itemId}
                  item={item.itemDetails}
                  quantity={item.quantity}
                  collected={item.collected}
                  onToggle={handleToggleItem}
                  onQuantityChange={handleQuantityChange}
                  onEditClick={handleEditClick}
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
                  onQuantityChange={handleQuantityChange}
                  onEditClick={handleEditClick}
                />
              );
            })}
          </Box>
        )}

        {/* Empty state - only show when no items and no search */}
        {list.items.length === 0 && !debouncedSearchInput && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary">
              {(() => {
                const funnyMessages = [
                  "Time to fill this up! Your wallet is safe... for now 🛒",
                  "This list is emptier than my fridge on Monday morning 🤷",
                  "Go ahead, add some items! Your shopping cart is feeling lonely 🛍️",
                  "Empty list detected! Time to channel your inner shopping ninja 🥷",
                  "Nothing here yet! Your future self will thank you for adding items 📝",
                  "This list is so empty, even the shopping cart is lonely 🛒💔"
                ];
                return funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
              })()}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Use the add item field above to get started!
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

      {/* Delete button at the bottom */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
        <Button
          onClick={handleDeleteClick}
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{
            minWidth: 200,
            py: 1.5,
          }}
        >
          Delete List
        </Button>
      </Box>

      {/* Delete confirmation dialog */}
      <DeleteListDialog
        open={deleteDialogOpen}
        listName={list.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Edit quantity dialog */}
      <EditItemQuantityDialog
        open={editDialogOpen}
        item={editingItem?.item || null}
        currentQuantity={editingItem?.currentQuantity || 1}
        onClose={handleEditDialogClose}
        onSave={handleEditDialogSave}
      />
    </Container>
  );
}
