'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Item } from '@/types/shopping-list';
import { 
  getAllItemsAction,
  getItemByIdAction,
  createItemAction,
  updateItemAction,
  deleteItemAction,
  searchItemsAction,
} from '@/actions/items';

// Query keys for consistency
export const itemKeys = {
  all: ['items'] as const,
  detail: (id: string) => ['items', id] as const,
  search: (query: string) => ['items', 'search', query] as const,
};

/**
 * Hook to fetch all items
 */
export function useItems() {
  return useQuery({
    queryKey: itemKeys.all,
    queryFn: async () => {
      const result = await getAllItemsAction();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch items');
      }
      return result.data as Item[];
    },
  });
}

/**
 * Hook to fetch a single item by ID
 */
export function useItem(id: string) {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: async () => {
      const result = await getItemByIdAction(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch item');
      }
      return result.data as Item;
    },
    enabled: !!id,
  });
}

/**
 * Hook to search items
 */
export function useSearchItems(query: string) {
  return useQuery({
    queryKey: itemKeys.search(query),
    queryFn: async () => {
      const result = await searchItemsAction(query);
      if (!result.success) {
        throw new Error(result.error || 'Failed to search items');
      }
      return result.data as Item[];
    },
    enabled: query.length > 0,
  });
}

/**
 * Hook to create a new item
 */
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; emoji?: string; tags?: string[] }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('emoji', data.emoji || '🛒');
      formData.append('tags', JSON.stringify(data.tags || []));
      
      const result = await createItemAction(formData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create item');
      }
      return result.data as Item;
    },
    onSuccess: (newItem) => {
      // Add to cache optimistically
      queryClient.setQueryData<Item[]>(itemKeys.all, (old) => {
        if (!old) return [newItem];
        return [...old, newItem];
      });
      
      // Invalidate to refetch and ensure consistency
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

/**
 * Hook to update an item
 */
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: { name?: string; emoji?: string; tags?: string[] } 
    }) => {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.emoji) formData.append('emoji', data.emoji);
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));
      
      const result = await updateItemAction(id, formData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update item');
      }
      return result.data as Item;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: itemKeys.detail(id) });

      // Snapshot the previous value
      const previousItem = queryClient.getQueryData<Item>(itemKeys.detail(id));

      // Optimistically update
      if (previousItem) {
        const updatedItem = {
          ...previousItem,
          ...data,
        };
        queryClient.setQueryData<Item>(itemKeys.detail(id), updatedItem);
        
        // Also update in the all items list
        queryClient.setQueryData<Item[]>(itemKeys.all, (old) => {
          if (!old) return old;
          return old.map(item => item.id === id ? updatedItem : item);
        });
      }

      return { previousItem };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousItem) {
        queryClient.setQueryData(itemKeys.detail(id), context.previousItem);
      }
    },
    onSettled: (data, error, { id }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

/**
 * Hook to delete an item
 */
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const result = await deleteItemAction(itemId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete item');
      }
      return itemId;
    },
    onMutate: async (itemId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: itemKeys.all });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData<Item[]>(itemKeys.all);

      // Optimistically remove the item
      if (previousItems) {
        queryClient.setQueryData<Item[]>(
          itemKeys.all,
          previousItems.filter(item => item.id !== itemId)
        );
      }

      return { previousItems };
    },
    onError: (err, itemId, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(itemKeys.all, context.previousItems);
      }
    },
    onSuccess: (itemId) => {
      // Remove the detail query for this item
      queryClient.removeQueries({ queryKey: itemKeys.detail(itemId) });
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

