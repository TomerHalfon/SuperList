'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Container } from '@/components/ui/Container';
import { Box } from '@/components/ui/Box';
import { Divider } from '@/components/ui/Divider';
import { Typography } from '@/components/ui/Typography';
import { Autocomplete, AutocompleteOption } from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { ShoppingListHeader } from '@/components/features/ShoppingListHeader';
import { ShoppingListItem } from '@/components/features/ShoppingListItem';
import { AddItemToList } from '@/components/features/AddItemToList';
import { ShoppingListDetailSkeleton } from '@/components/features/ShoppingListDetailSkeleton';
import { DeleteListDialog } from '@/components/features/DeleteListDialog';
import { EditItemQuantityDialog } from '@/components/features/EditItemQuantityDialog';
import { ShoppingListItem as ShoppingListItemType, Item } from '@/types/shopping-list';
import { getItemDetails } from '@/lib/utils/list-helpers';
import { filterItemsBySearch } from '@/lib/utils/search-helpers';
import { filterSuggestions, generateSearchSuggestions } from '@/lib/utils/search-suggestions';
import { useDebounce } from '@/hooks/useDebounce';
import { useList, useUpdateListName, useDeleteList } from '@/hooks/useLists';
import { useItems } from '@/hooks/useItems';
import { useToggleItemCollected, useUpdateListItemQuantity } from '@/hooks/useListMutations';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useTranslations } from 'next-intl';

interface ListDetailClientProps {
  listId: string;
}

export function ListDetailClient({ listId }: ListDetailClientProps) {
  const router = useRouter();
  const t = useTranslations('items');
  const tLists = useTranslations('lists');
  const tNavigation = useTranslations('navigation');
  const tErrors = useTranslations('errors');
  const tEmptyStates = useTranslations('emptyStates');
  const [searchInput, setSearchInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: Item; currentQuantity: number } | null>(null);
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const { showSuccess, showError } = useSnackbar();
  
  // Use React Query hooks
  const { data: list, isLoading: listLoading, error: listError } = useList(listId);
  const { data: items = [], isLoading: itemsLoading } = useItems();
  const updateListNameMutation = useUpdateListName();
  const deleteListMutation = useDeleteList();
  const toggleItemMutation = useToggleItemCollected();
  const updateQuantityMutation = useUpdateListItemQuantity();

  // Generate search suggestions from items in this list (must be before early returns)
  const allSuggestions = useMemo(() => {
    if (!list) return [];
    const listItemIds = new Set(list.items.map((item: ShoppingListItemType) => item.itemId));
    const listItems = items.filter((item: Item) => listItemIds.has(item.id));
    return generateSearchSuggestions(listItems);
  }, [list, items]);

  const filteredSuggestions = useMemo(() => {
    return filterSuggestions(allSuggestions, searchInput);
  }, [allSuggestions, searchInput]);

  // Filter items based on search (must be before early returns)
  const filteredItems = useMemo(() => {
    if (!list) return { uncollected: [], collected: [] };
    
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
  }, [list, items, debouncedSearchInput]);

  const handleBack = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleToggleItem = useCallback(async (itemId: string) => {
    try {
      await toggleItemMutation.mutateAsync({ listId, itemId });
      // Optimistic update already handled by the mutation hook
    } catch (error) {
      console.error('Error toggling item:', error);
      showError(error instanceof Error ? error.message : t('failedToUpdateItem'));
    }
  }, [listId, toggleItemMutation, showError]);

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
      await updateListNameMutation.mutateAsync({ listId, newName });
      showSuccess(tLists('listNameUpdated'));
    } catch (error) {
      console.error('Error updating list name:', error);
      showError(error instanceof Error ? error.message : tLists('failedToUpdateListName'));
    }
  }, [listId, updateListNameMutation, showSuccess, showError, tLists]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteListMutation.mutateAsync(listId);
      showSuccess(tLists('listDeletedSuccessfully'));
      setDeleteDialogOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error deleting list:', error);
      showError(error instanceof Error ? error.message : tLists('failedToDeleteList'));
    }
  }, [listId, deleteListMutation, showSuccess, showError, router, tLists]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const handleQuantityChange = useCallback(async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantityMutation.mutateAsync({ listId, itemId, quantity: newQuantity });
      // Optimistic update already handled by the mutation hook
    } catch (error) {
      console.error('Error updating quantity:', error);
      showError(error instanceof Error ? error.message : t('failedToUpdateQuantity'));
    }
  }, [listId, updateQuantityMutation, showError, t]);

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
      await updateQuantityMutation.mutateAsync({ 
        listId, 
        itemId: editingItem.item.id, 
        quantity: newQuantity 
      });
      showSuccess(t('quantityUpdated'));
      setEditDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating quantity:', error);
      showError(error instanceof Error ? error.message : t('failedToUpdateQuantity'));
    }
  }, [listId, editingItem, updateQuantityMutation, showSuccess, showError]);

  // Loading state
  if (listLoading || itemsLoading) {
    return <ShoppingListDetailSkeleton />;
  }

  // Error state
  if (listError) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error">
            {tErrors('failedToLoadShoppingList')}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {listError instanceof Error ? listError.message : tErrors('anErrorOccurred')}
          </Typography>
          <Button onClick={() => router.push('/')} sx={{ mt: 2 }}>
            {tNavigation('backToLists')}
          </Button>
        </Box>
      </Container>
    );
  }

  // Not found
  if (!list) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            {tErrors('shoppingListNotFound')}
          </Typography>
          <Button onClick={() => router.push('/')} sx={{ mt: 2 }}>
            {tNavigation('backToLists')}
          </Button>
        </Box>
      </Container>
    );
  }

  // Use filtered items (list is guaranteed to exist here)
  const uncollectedItems = filteredItems.uncollected;
  const collectedItems = filteredItems.collected;

  return (
    <Container maxWidth="lg">
      <ShoppingListHeader list={list} onBack={handleBack} onNameUpdate={handleNameUpdate} />

      {/* Search Field */}
      <Box sx={{ mb: 3 }}>
        <Autocomplete
          fullWidth
          placeholder={t('searchItems')}
          value={selectedOption}
          onChange={handleSearchChange}
          onInputChange={handleInputChange}
          options={filteredSuggestions}
          showClearButton
          onClear={handleClearSearch}
          size="small"
          noOptionsText={t('noSuggestionsFound')}
          loadingText={t('loadingSuggestions')}
        />
      </Box>

      <Box>
        {/* Add Item Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {t('itemsToCollect')} ({uncollectedItems.length})
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
              {t('collectedItems')} ({collectedItems.length})
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
                  tEmptyStates('timeToFillUp'),
                  tEmptyStates('emptierThanFridge'),
                  tEmptyStates('addSomeItems'),
                  tEmptyStates('channelShoppingNinja'),
                  tEmptyStates('futureSelfWillThank'),
                  tEmptyStates('shoppingCartLonely')
                ];
                return funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
              })()}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {t('useAddItemField')}
            </Typography>
          </Box>
        )}

        {/* No search results */}
        {list.items.length > 0 && uncollectedItems.length === 0 && collectedItems.length === 0 && debouncedSearchInput && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary">
              {t('noItemsFound')}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {t('tryDifferentTerms')}
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
          {tNavigation('deleteList')}
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
