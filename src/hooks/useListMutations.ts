'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingList, ShoppingListItem } from '@/types/shopping-list';
import { 
  addItemToListAction,
  addItemToListWithAutoCreateAction,
  removeItemFromListAction,
  toggleItemCollectedAction,
  updateListItemAction,
} from '@/actions/lists';
import { listKeys } from './useLists';

/**
 * Hook to add an item to a list
 */
export function useAddItemToList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      listId, 
      itemId, 
      quantity = 1 
    }: { 
      listId: string; 
      itemId: string; 
      quantity?: number; 
    }) => {
      const formData = new FormData();
      formData.append('itemId', itemId);
      formData.append('quantity', quantity.toString());
      formData.append('collected', 'false');
      
      const result = await addItemToListAction(listId, formData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add item to list');
      }
      return result.data as ShoppingList;
    },
    onMutate: async ({ listId, itemId, quantity = 1 }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listKeys.detail(listId) });

      // Snapshot the previous value
      const previousList = queryClient.getQueryData<ShoppingList>(listKeys.detail(listId));

      // Optimistically add the item
      if (previousList) {
        const newItem: ShoppingListItem = {
          itemId,
          quantity,
          collected: false,
        };
        
        queryClient.setQueryData<ShoppingList>(listKeys.detail(listId), {
          ...previousList,
          items: [...previousList.items, newItem],
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousList };
    },
    onError: (err, { listId }, context) => {
      // Rollback on error
      if (context?.previousList) {
        queryClient.setQueryData(listKeys.detail(listId), context.previousList);
      }
    },
    onSettled: (data, error, { listId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: listKeys.detail(listId) });
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

/**
 * Hook to add an item to a list with auto-creation if it doesn't exist
 */
export function useAddItemToListWithAutoCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, itemName }: { listId: string; itemName: string }) => {
      const result = await addItemToListWithAutoCreateAction(listId, itemName);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add item to list');
      }
      return { data: result.data as ShoppingList, warning: result.warning };
    },
    onSettled: (data, error, { listId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: listKeys.detail(listId) });
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

/**
 * Hook to remove an item from a list
 */
export function useRemoveItemFromList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, itemId }: { listId: string; itemId: string }) => {
      const result = await removeItemFromListAction(listId, itemId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove item from list');
      }
      return result.data as ShoppingList;
    },
    onMutate: async ({ listId, itemId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listKeys.detail(listId) });

      // Snapshot the previous value
      const previousList = queryClient.getQueryData<ShoppingList>(listKeys.detail(listId));

      // Optimistically remove the item
      if (previousList) {
        queryClient.setQueryData<ShoppingList>(listKeys.detail(listId), {
          ...previousList,
          items: previousList.items.filter(item => item.itemId !== itemId),
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousList };
    },
    onError: (err, { listId }, context) => {
      // Rollback on error
      if (context?.previousList) {
        queryClient.setQueryData(listKeys.detail(listId), context.previousList);
      }
    },
    onSettled: (data, error, { listId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: listKeys.detail(listId) });
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

/**
 * Hook to toggle item collected status - MOST FREQUENTLY USED
 */
export function useToggleItemCollected() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, itemId }: { listId: string; itemId: string }) => {
      const result = await toggleItemCollectedAction(listId, itemId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to toggle item');
      }
      return result.data as ShoppingList;
    },
    onMutate: async ({ listId, itemId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listKeys.detail(listId) });

      // Snapshot the previous value
      const previousList = queryClient.getQueryData<ShoppingList>(listKeys.detail(listId));

      // Optimistically toggle the item
      if (previousList) {
        queryClient.setQueryData<ShoppingList>(listKeys.detail(listId), {
          ...previousList,
          items: previousList.items.map(item => 
            item.itemId === itemId 
              ? { ...item, collected: !item.collected }
              : item
          ),
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousList };
    },
    onError: (err, { listId }, context) => {
      // Rollback on error
      if (context?.previousList) {
        queryClient.setQueryData(listKeys.detail(listId), context.previousList);
      }
    },
    onSettled: (data, error, { listId }) => {
      // Refetch in background to ensure consistency
      queryClient.invalidateQueries({ queryKey: listKeys.detail(listId) });
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

/**
 * Hook to update item quantity in a list
 */
export function useUpdateListItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      listId, 
      itemId, 
      quantity 
    }: { 
      listId: string; 
      itemId: string; 
      quantity: number; 
    }) => {
      const formData = new FormData();
      formData.append('quantity', quantity.toString());
      
      const result = await updateListItemAction(listId, itemId, formData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update quantity');
      }
      return result.data as ShoppingList;
    },
    onMutate: async ({ listId, itemId, quantity }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listKeys.detail(listId) });

      // Snapshot the previous value
      const previousList = queryClient.getQueryData<ShoppingList>(listKeys.detail(listId));

      // Optimistically update the quantity
      if (previousList) {
        queryClient.setQueryData<ShoppingList>(listKeys.detail(listId), {
          ...previousList,
          items: previousList.items.map(item => 
            item.itemId === itemId 
              ? { ...item, quantity }
              : item
          ),
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousList };
    },
    onError: (err, { listId }, context) => {
      // Rollback on error
      if (context?.previousList) {
        queryClient.setQueryData(listKeys.detail(listId), context.previousList);
      }
    },
    onSettled: (data, error, { listId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: listKeys.detail(listId) });
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

