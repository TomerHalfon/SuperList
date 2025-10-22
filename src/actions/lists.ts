'use server';

import { getListRepository, getItemRepository } from '@/lib/storage';
import { validateCreateList, validateUpdateList } from '@/lib/validations/list-schemas';
import { StorageError, ValidationError } from '@/lib/storage/interfaces';

// Action result types
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
  warning?: string;
}

/**
 * Get all shopping lists
 */
export async function getAllListsAction(): Promise<ActionResult> {
  try {
    const repository = await getListRepository();
    const lists = await repository.getAll();
    
    return {
      success: true,
      data: lists,
    };
  } catch (error) {
    console.error('Get all lists error:', error);
    return {
      success: false,
      error: 'Failed to fetch shopping lists',
    };
  }
}

/**
 * Get shopping list by ID
 */
export async function getListByIdAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'List ID is required',
      };
    }

    const repository = await getListRepository();
    const list = await repository.getById(id);
    
    if (!list) {
      return {
        success: false,
        error: 'Shopping list not found',
      };
    }
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Get list by ID error:', error);
    return {
      success: false,
      error: 'Failed to fetch shopping list',
    };
  }
}

/**
 * Create a new shopping list
 */
export async function createListAction(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      name: formData.get('name'),
      items: formData.get('items') ? JSON.parse(formData.get('items') as string) : [],
    };

    const validatedData = validateCreateList(rawData);
    const repository = await getListRepository();
    const list = await repository.create(validatedData);

    // Note: React Query handles cache invalidation, no need for revalidatePath
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Create list error:', error);
    
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: error.message,
        details: error.details,
      };
    }
    
    return {
      success: false,
      error: 'Failed to create shopping list',
    };
  }
}

/**
 * Update an existing shopping list
 */
export async function updateListAction(id: string, formData: FormData): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'List ID is required',
      };
    }

    const rawData: any = {};
    const name = formData.get('name');
    const items = formData.get('items');

    if (name) rawData.name = name;
    if (items) rawData.items = JSON.parse(items as string);

    const validatedData = validateUpdateList(rawData);
    const repository = await getListRepository();
    const list = await repository.update(id, validatedData);

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Update list error:', error);
    
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: error.message,
        details: error.details,
      };
    }
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to update shopping list',
    };
  }
}

/**
 * Delete a shopping list
 */
export async function deleteListAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'List ID is required',
      };
    }

    const repository = await getListRepository();
    await repository.delete(id);

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete list error:', error);
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to delete shopping list',
    };
  }
}

/**
 * Add an item to a shopping list
 */
export async function addItemToListAction(listId: string, formData: FormData): Promise<ActionResult> {
  try {
    if (!listId) {
      return {
        success: false,
        error: 'List ID is required',
      };
    }

    const itemId = formData.get('itemId') as string;
    const quantity = parseInt(formData.get('quantity') as string);
    const collected = formData.get('collected') === 'true';

    if (!itemId) {
      return {
        success: false,
        error: 'Item ID is required',
      };
    }

    const rawData = {
      itemId,
      quantity,
      collected,
    };

    const repository = await getListRepository();
    const list = await repository.addItem(listId, rawData);

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Add item to list error:', error);
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to add item to list',
    };
  }
}

/**
 * Remove an item from a shopping list
 */
export async function removeItemFromListAction(listId: string, itemId: string): Promise<ActionResult> {
  try {
    if (!listId || !itemId) {
      return {
        success: false,
        error: 'List ID and Item ID are required',
      };
    }

    const repository = await getListRepository();
    const list = await repository.removeItem(listId, itemId);

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Remove item from list error:', error);
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list or item not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to remove item from list',
    };
  }
}

/**
 * Toggle item collected status
 */
export async function toggleItemCollectedAction(listId: string, itemId: string): Promise<ActionResult> {
  try {
    if (!listId || !itemId) {
      return {
        success: false,
        error: 'List ID and Item ID are required',
      };
    }

    const repository = await getListRepository();
    const list = await repository.toggleItemCollected(listId, itemId);

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Toggle item collected error:', error);
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list or item not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to toggle item collected status',
    };
  }
}

/**
 * Update an item in a shopping list
 */
export async function updateListItemAction(listId: string, itemId: string, formData: FormData): Promise<ActionResult> {
  try {
    if (!listId || !itemId) {
      return {
        success: false,
        error: 'List ID and Item ID are required',
      };
    }

    const rawData: any = {};
    const quantity = formData.get('quantity');
    const collected = formData.get('collected');

    if (quantity) rawData.quantity = parseInt(quantity as string);
    if (collected !== null) rawData.collected = collected === 'true';

    const repository = await getListRepository();
    const list = await repository.updateItem(listId, itemId, rawData);

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Update list item error:', error);
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list or item not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to update item in list',
    };
  }
}

/**
 * Duplicate a shopping list
 */
export async function duplicateListAction(id: string, newName?: string): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'List ID is required',
      };
    }

    const repository = await getListRepository();
    const list = await repository.duplicateList(id, newName);

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Duplicate list error:', error);
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to duplicate shopping list',
    };
  }
}

/**
 * Update list name
 */
export async function updateListNameAction(listId: string, newName: string): Promise<ActionResult> {
  try {
    if (!listId) {
      return {
        success: false,
        error: 'List ID is required',
      };
    }

    if (!newName || newName.trim().length === 0) {
      return {
        success: false,
        error: 'List name is required',
      };
    }

    const validatedData = validateUpdateList({ name: newName.trim() });
    const repository = await getListRepository();
    const list = await repository.update(listId, validatedData);

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Update list name error:', error);
    
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: error.message,
        details: error.details,
      };
    }
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to update list name',
    };
  }
}

/**
 * Clear completed items from a list
 */
export async function clearCompletedItemsAction(listId: string): Promise<ActionResult> {
  try {
    if (!listId) {
      return {
        success: false,
        error: 'List ID is required',
      };
    }

    const repository = await getListRepository();
    const list = await repository.clearCompletedItems(listId);

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error('Clear completed items error:', error);
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to clear completed items',
    };
  }
}

/**
 * Add item to list with auto-creation if item doesn't exist
 */
export async function addItemToListWithAutoCreateAction(listId: string, itemName: string): Promise<ActionResult> {
  try {
    if (!listId) {
      return {
        success: false,
        error: 'List ID is required',
      };
    }

    if (!itemName || itemName.trim().length === 0) {
      return {
        success: false,
        error: 'Item name is required',
      };
    }

    const trimmedName = itemName.trim();
    
    // Get repositories
    const listRepository = await getListRepository();
    const itemRepository = await getItemRepository();
    
    // Check if list exists
    const list = await listRepository.getById(listId);
    if (!list) {
      return {
        success: false,
        error: 'Shopping list not found',
      };
    }

    // Search for existing item using contains search
    const existingItems = await itemRepository.search(trimmedName);
    let targetItem = existingItems.find(item => 
      item.name.toLowerCase() === trimmedName.toLowerCase()
    );

    // If item doesn't exist, create it
    if (!targetItem) {
      const newItem = await itemRepository.create({
        name: trimmedName,
        emoji: '🛒',
        tags: [],
      });
      targetItem = newItem;
    }

    // Check if item is already in the list
    const existingListItem = list.items.find(item => item.itemId === targetItem.id);
    if (existingListItem) {
      // Item already exists in list - show funny warning but still add
      const funnyMessages = [
        `Another one? You must really love ${targetItem.name}! 🤷`,
        `Double trouble! ${targetItem.name} added again (because why not?) 🤪`,
        `${targetItem.name} strikes again! Added to the list... again 🔄`,
        `Déjà vu! ${targetItem.name} is now on the list twice 👯`,
        `Here we go again! ${targetItem.name} makes a comeback 🎭`,
        `${targetItem.name} is back for round two! 🥊`
      ];
      const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
      
      // Add the item anyway
      const updatedList = await listRepository.addItem(listId, {
        itemId: targetItem.id,
        quantity: 1,
        collected: false,
      });

      // Note: React Query handles cache invalidation
      
      return {
        success: true,
        data: updatedList,
        warning: randomMessage,
      };
    }

    // Add item to list
    const updatedList = await listRepository.addItem(listId, {
      itemId: targetItem.id,
      quantity: 1,
      collected: false,
    });

    // Note: React Query handles cache invalidation
    
    return {
      success: true,
      data: updatedList,
    };
  } catch (error) {
    console.error('Add item to list with auto-create error:', error);
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Shopping list not found',
      };
    }
    
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: error.message,
        details: error.details,
      };
    }
    
    return {
      success: false,
      error: 'Failed to add item to list',
    };
  }
}