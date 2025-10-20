'use server';

import { revalidatePath } from 'next/cache';
import { getItemRepository } from '@/lib/storage';
import { validateCreateItem, validateUpdateItem } from '@/lib/validations/item-schemas';
import { StorageError, ValidationError } from '@/lib/storage/interfaces';

// Action result types
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

/**
 * Get all items
 */
export async function getAllItemsAction(): Promise<ActionResult> {
  try {
    const repository = getItemRepository();
    const items = await repository.getAll();
    
    return {
      success: true,
      data: items,
    };
  } catch (error) {
    console.error('Get all items error:', error);
    return {
      success: false,
      error: 'Failed to fetch items',
    };
  }
}

/**
 * Get item by ID
 */
export async function getItemByIdAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Item ID is required',
      };
    }

    const repository = getItemRepository();
    const item = await repository.getById(id);
    
    if (!item) {
      return {
        success: false,
        error: 'Item not found',
      };
    }
    
    return {
      success: true,
      data: item,
    };
  } catch (error) {
    console.error('Get item by ID error:', error);
    return {
      success: false,
      error: 'Failed to fetch item',
    };
  }
}

/**
 * Create a new item
 */
export async function createItemAction(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      name: formData.get('name'),
      emoji: formData.get('emoji'),
      tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [],
    };

    const validatedData = validateCreateItem(rawData);
    const repository = getItemRepository();
    const item = await repository.create(validatedData);

    revalidatePath('/');
    
    return {
      success: true,
      data: item,
    };
  } catch (error) {
    console.error('Create item error:', error);
    
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: error.message,
        details: error.details,
      };
    }
    
    return {
      success: false,
      error: 'Failed to create item',
    };
  }
}

/**
 * Update an existing item
 */
export async function updateItemAction(id: string, formData: FormData): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Item ID is required',
      };
    }

    const rawData: any = {};
    const name = formData.get('name');
    const emoji = formData.get('emoji');
    const tags = formData.get('tags');

    if (name) rawData.name = name;
    if (emoji) rawData.emoji = emoji;
    if (tags) rawData.tags = JSON.parse(tags as string);

    const validatedData = validateUpdateItem(rawData);
    const repository = getItemRepository();
    const item = await repository.update(id, validatedData);

    revalidatePath('/');
    
    return {
      success: true,
      data: item,
    };
  } catch (error) {
    console.error('Update item error:', error);
    
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
        error: 'Item not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to update item',
    };
  }
}

/**
 * Delete an item
 */
export async function deleteItemAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Item ID is required',
      };
    }

    const repository = getItemRepository();
    await repository.delete(id);

    revalidatePath('/');
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete item error:', error);
    
    if (error instanceof StorageError && error.code === 'NOT_FOUND') {
      return {
        success: false,
        error: 'Item not found',
      };
    }
    
    return {
      success: false,
      error: 'Failed to delete item',
    };
  }
}

/**
 * Search items
 */
export async function searchItemsAction(query: string): Promise<ActionResult> {
  try {
    const repository = getItemRepository();
    const items = await repository.search(query);
    
    return {
      success: true,
      data: items,
    };
  } catch (error) {
    console.error('Search items error:', error);
    return {
      success: false,
      error: 'Failed to search items',
    };
  }
}

/**
 * Get items by tag
 */
export async function getItemsByTagAction(tag: string): Promise<ActionResult> {
  try {
    if (!tag) {
      return {
        success: false,
        error: 'Tag is required',
      };
    }

    const repository = getItemRepository();
    const items = await repository.getByTag(tag);
    
    return {
      success: true,
      data: items,
    };
  } catch (error) {
    console.error('Get items by tag error:', error);
    return {
      success: false,
      error: 'Failed to fetch items by tag',
    };
  }
}

/**
 * Get items by multiple tags
 */
export async function getItemsByTagsAction(tags: string[]): Promise<ActionResult> {
  try {
    const repository = getItemRepository();
    const items = await repository.getByTags(tags);
    
    return {
      success: true,
      data: items,
    };
  } catch (error) {
    console.error('Get items by tags error:', error);
    return {
      success: false,
      error: 'Failed to fetch items by tags',
    };
  }
}
