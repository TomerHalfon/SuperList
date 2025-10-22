'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingList } from '@/types/shopping-list';
import { 
  getAllListsAction, 
  getListByIdAction,
  createListAction,
  deleteListAction,
  updateListNameAction,
  duplicateListAction,
  clearCompletedItemsAction
} from '@/actions/lists';
import { useRouter } from 'next/navigation';

// Query keys for consistency
export const listKeys = {
  all: ['lists'] as const,
  detail: (id: string) => ['lists', id] as const,
};

/**
 * Hook to fetch all shopping lists
 */
export function useLists() {
  return useQuery({
    queryKey: listKeys.all,
    queryFn: async () => {
      const result = await getAllListsAction();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch lists');
      }
      return result.data as ShoppingList[];
    },
  });
}

/**
 * Hook to fetch a single shopping list by ID
 */
export function useList(id: string) {
  return useQuery({
    queryKey: listKeys.detail(id),
    queryFn: async () => {
      const result = await getListByIdAction(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch list');
      }
      return result.data as ShoppingList;
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new shopping list
 */
export function useCreateList() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (name: string = 'New List') => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('items', JSON.stringify([]));
      
      const result = await createListAction(formData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create list');
      }
      return result.data as ShoppingList;
    },
    onSuccess: (newList) => {
      // Invalidate lists query to refetch
      queryClient.invalidateQueries({ queryKey: listKeys.all });
      // Navigate to the new list
      router.push(`/lists/${newList.id}`);
    },
  });
}

/**
 * Hook to delete a shopping list
 */
export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listId: string) => {
      const result = await deleteListAction(listId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete list');
      }
      return listId;
    },
    onMutate: async (listId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listKeys.all });

      // Snapshot the previous value
      const previousLists = queryClient.getQueryData<ShoppingList[]>(listKeys.all);

      // Optimistically remove the list
      if (previousLists) {
        queryClient.setQueryData<ShoppingList[]>(
          listKeys.all,
          previousLists.filter(list => list.id !== listId)
        );
      }

      return { previousLists };
    },
    onError: (err, listId, context) => {
      // Rollback on error
      if (context?.previousLists) {
        queryClient.setQueryData(listKeys.all, context.previousLists);
      }
    },
    onSuccess: (listId) => {
      // Remove the detail query for this list
      queryClient.removeQueries({ queryKey: listKeys.detail(listId) });
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

/**
 * Hook to update a list name
 */
export function useUpdateListName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, newName }: { listId: string; newName: string }) => {
      const result = await updateListNameAction(listId, newName);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update list name');
      }
      return result.data as ShoppingList;
    },
    onMutate: async ({ listId, newName }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listKeys.detail(listId) });

      // Snapshot the previous value
      const previousList = queryClient.getQueryData<ShoppingList>(listKeys.detail(listId));

      // Optimistically update
      if (previousList) {
        queryClient.setQueryData<ShoppingList>(listKeys.detail(listId), {
          ...previousList,
          name: newName,
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
 * Hook to duplicate a shopping list
 */
export function useDuplicateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, newName }: { listId: string; newName?: string }) => {
      const result = await duplicateListAction(listId, newName);
      if (!result.success) {
        throw new Error(result.error || 'Failed to duplicate list');
      }
      return result.data as ShoppingList;
    },
    onSuccess: () => {
      // Invalidate lists query to show the new duplicate
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

/**
 * Hook to clear completed items from a list
 */
export function useClearCompletedItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listId: string) => {
      const result = await clearCompletedItemsAction(listId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to clear completed items');
      }
      return result.data as ShoppingList;
    },
    onMutate: async (listId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: listKeys.detail(listId) });

      // Snapshot the previous value
      const previousList = queryClient.getQueryData<ShoppingList>(listKeys.detail(listId));

      // Optimistically remove collected items
      if (previousList) {
        queryClient.setQueryData<ShoppingList>(listKeys.detail(listId), {
          ...previousList,
          items: previousList.items.filter(item => !item.collected),
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousList };
    },
    onError: (err, listId, context) => {
      // Rollback on error
      if (context?.previousList) {
        queryClient.setQueryData(listKeys.detail(listId), context.previousList);
      }
    },
    onSettled: (data, error, listId) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: listKeys.detail(listId) });
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
  });
}

