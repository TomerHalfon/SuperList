import { v4 as uuidv4 } from 'uuid';
import { ShoppingList, ShoppingListItem } from '@/types/shopping-list';
import { IListRepository, CreateListInput, UpdateListInput, NotFoundError, ValidationError } from '../interfaces';
import { validateCreateList, validateUpdateList } from '@/lib/validations/list-schemas';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Database response types for joins
interface ShoppingListWithItems {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  deleted_at: string | null;
  shopping_list_items: Array<{
    id: string;
    list_id: string;
    item_id: string;
    quantity: number;
    collected: boolean;
    items: {
      id: string;
      name: string;
      emoji: string;
      tags: string[];
    };
  }>;
}

export class SupabaseListRepository implements IListRepository {
  private readonly supabase: SupabaseClient<Database>;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabase = supabaseClient as SupabaseClient<Database>;
  }

  /**
   * Get all shopping lists
   */
  async getAll(): Promise<ShoppingList[]> {
    const { data, error } = await this.supabase
      .from('shopping_lists')
      .select(`
        *,
        shopping_list_items (
          *,
          items (*)
        )
      `)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new ValidationError(`Failed to fetch shopping lists: ${error.message}`);
    }

    return this.mapDatabaseResponseToShoppingLists(data || []);
  }

  /**
   * Get shopping list by ID
   */
  async getById(id: string): Promise<ShoppingList | null> {
    const { data, error } = await this.supabase
      .from('shopping_lists')
      .select(`
        *,
        shopping_list_items (
          *,
          items (*)
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new ValidationError(`Failed to fetch shopping list: ${error.message}`);
    }

    return this.mapDatabaseResponseToShoppingList(data);
  }

  /**
   * Create a new shopping list
   */
  async create(data: CreateListInput): Promise<ShoppingList> {
    try {
      const validatedData = validateCreateList(data);
      
      // Check if list with same name already exists
      const existingList = await this.getByName(validatedData.name);
      if (existingList) {
        throw new ValidationError(`List with name '${validatedData.name}' already exists`);
      }

      const newList = {
        id: uuidv4(),
        name: validatedData.name,
        updated_at: new Date().toISOString(),
      };

      const { data: listData, error: listError } = await this.supabase
        .from('shopping_lists')
        .insert(newList)
        .select()
        .single();

      if (listError) {
        throw new ValidationError(`Failed to create shopping list: ${listError.message}`);
      }

      // Add items if provided
      if (validatedData.items && validatedData.items.length > 0) {
        const listItems = validatedData.items.map(item => ({
          id: uuidv4(),
          list_id: listData.id,
          item_id: item.itemId,
          quantity: item.quantity,
          collected: item.collected,
        }));

        const { error: itemsError } = await this.supabase
          .from('shopping_list_items')
          .insert(listItems);

        if (itemsError) {
          // Clean up the created list if items insertion fails
          await this.supabase.from('shopping_lists').delete().eq('id', listData.id);
          throw new ValidationError(`Failed to add items to shopping list: ${itemsError.message}`);
        }
      }

      // Return the complete list with items
      const completeList = await this.getById(listData.id);
      if (!completeList) {
        throw new ValidationError('Failed to retrieve created shopping list');
      }

      return completeList;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(`Failed to create shopping list: ${error}`);
    }
  }

  /**
   * Update an existing shopping list
   */
  async update(id: string, data: UpdateListInput): Promise<ShoppingList> {
    try {
      const validatedData = validateUpdateList(data);
      
      // Check if list exists
      const existingList = await this.getById(id);
      if (!existingList) {
        throw new NotFoundError('Shopping list', id);
      }

      // Check if name is being changed and if it conflicts with existing lists
      if (validatedData.name && validatedData.name !== existingList.name) {
        const conflictingList = await this.getByName(validatedData.name);
        if (conflictingList) {
          throw new ValidationError(`List with name '${validatedData.name}' already exists`);
        }
      }

      const updateData = {
        ...validatedData,
        updated_at: new Date().toISOString(),
      };

      const { data: listData, error: listError } = await this.supabase
        .from('shopping_lists')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (listError) {
        throw new ValidationError(`Failed to update shopping list: ${listError.message}`);
      }

      // Update items if provided
      if (validatedData.items !== undefined) {
        // Delete existing items
        const { error: deleteError } = await this.supabase
          .from('shopping_list_items')
          .delete()
          .eq('list_id', id);

        if (deleteError) {
          throw new ValidationError(`Failed to clear existing items: ${deleteError.message}`);
        }

        // Insert new items
        if (validatedData.items.length > 0) {
          const listItems = validatedData.items.map(item => ({
            id: uuidv4(),
            list_id: id,
            item_id: item.itemId,
            quantity: item.quantity,
            collected: item.collected,
          }));

          const { error: insertError } = await this.supabase
            .from('shopping_list_items')
            .insert(listItems);

          if (insertError) {
            throw new ValidationError(`Failed to add items to shopping list: ${insertError.message}`);
          }
        }
      }

      // Return the updated list
      const updatedList = await this.getById(id);
      if (!updatedList) {
        throw new ValidationError('Failed to retrieve updated shopping list');
      }

      return updatedList;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(`Failed to update shopping list: ${error}`);
    }
  }

  /**
   * Delete a shopping list (soft delete)
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('shopping_lists')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new ValidationError(`Failed to delete shopping list: ${error.message}`);
    }
  }

  /**
   * Add an item to a shopping list
   */
  async addItem(listId: string, item: ShoppingListItem): Promise<ShoppingList> {
    // Try to update if exists, otherwise insert
    const { data: existing } = await this.supabase
      .from('shopping_list_items')
      .select('id')
      .eq('list_id', listId)
      .eq('item_id', item.itemId)
      .single();

    if (existing) {
      // Update existing item
      return this.updateItem(listId, item.itemId, item);
    }

    // Add new item
    const listItem = {
      id: uuidv4(),
      list_id: listId,
      item_id: item.itemId,
      quantity: item.quantity,
      collected: item.collected,
    };

    const { error } = await this.supabase
      .from('shopping_list_items')
      .insert(listItem);

    if (error) {
      throw new ValidationError(`Failed to add item to shopping list: ${error.message}`);
    }

    // Update list timestamp
    await this.supabase
      .from('shopping_lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);

    // Return the updated list - still need full data for consistency
    const updatedList = await this.getById(listId);
    if (!updatedList) {
      throw new ValidationError('Failed to retrieve updated shopping list');
    }

    return updatedList;
  }

  /**
   * Remove an item from a shopping list
   */
  async removeItem(listId: string, itemId: string): Promise<ShoppingList> {
    const { error } = await this.supabase
      .from('shopping_list_items')
      .delete()
      .eq('list_id', listId)
      .eq('item_id', itemId);

    if (error) {
      throw new ValidationError(`Failed to remove item from shopping list: ${error.message}`);
    }

    // Update list timestamp
    await this.supabase
      .from('shopping_lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);

    // Return the updated list
    const updatedList = await this.getById(listId);
    if (!updatedList) {
      throw new ValidationError('Failed to retrieve updated shopping list');
    }

    return updatedList;
  }

  /**
   * Update an item in a shopping list
   */
  async updateItem(listId: string, itemId: string, updates: Partial<ShoppingListItem>): Promise<ShoppingList> {
    const updateData: any = {};
    
    if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
    if (updates.collected !== undefined) updateData.collected = updates.collected;

    const { error } = await this.supabase
      .from('shopping_list_items')
      .update(updateData)
      .eq('list_id', listId)
      .eq('item_id', itemId);

    if (error) {
      throw new ValidationError(`Failed to update item in shopping list: ${error.message}`);
    }

    // Update list timestamp
    await this.supabase
      .from('shopping_lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);

    // Return the updated list
    const updatedList = await this.getById(listId);
    if (!updatedList) {
      throw new ValidationError('Failed to retrieve updated shopping list');
    }

    return updatedList;
  }

  /**
   * Toggle the collected status of an item
   */
  async toggleItemCollected(listId: string, itemId: string): Promise<ShoppingList> {
    // First get the current item to toggle its collected status
    const { data: currentItem, error: fetchError } = await this.supabase
      .from('shopping_list_items')
      .select('collected')
      .eq('list_id', listId)
      .eq('item_id', itemId)
      .single();

    if (fetchError) {
      throw new ValidationError(`Failed to fetch item: ${fetchError.message}`);
    }

    const { error } = await this.supabase
      .from('shopping_list_items')
      .update({ collected: !currentItem.collected })
      .eq('list_id', listId)
      .eq('item_id', itemId);

    if (error) {
      throw new ValidationError(`Failed to toggle item collected status: ${error.message}`);
    }

    // Update list timestamp
    await this.supabase
      .from('shopping_lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);

    // Return the updated list
    const updatedList = await this.getById(listId);
    if (!updatedList) {
      throw new ValidationError('Failed to retrieve updated shopping list');
    }

    return updatedList;
  }

  /**
   * Duplicate a shopping list
   */
  async duplicateList(id: string, newName?: string): Promise<ShoppingList> {
    const originalList = await this.getById(id);
    if (!originalList) {
      throw new NotFoundError('Shopping list', id);
    }

    const duplicatedList = {
      id: uuidv4(),
      name: newName || `${originalList.name} (Copy)`,
      updated_at: new Date().toISOString(),
    };

    const { data: listData, error: listError } = await this.supabase
      .from('shopping_lists')
      .insert(duplicatedList)
      .select()
      .single();

    if (listError) {
      throw new ValidationError(`Failed to duplicate shopping list: ${listError.message}`);
    }

    // Copy items if the original list has any
    if (originalList.items.length > 0) {
      const listItems = originalList.items.map(item => ({
        id: uuidv4(),
        list_id: listData.id,
        item_id: item.itemId,
        quantity: item.quantity,
        collected: false, // Reset collected status for duplicated items
      }));

      const { error: itemsError } = await this.supabase
        .from('shopping_list_items')
        .insert(listItems);

      if (itemsError) {
        // Clean up the created list if items insertion fails
        await this.supabase.from('shopping_lists').delete().eq('id', listData.id);
        throw new ValidationError(`Failed to copy items to duplicated list: ${itemsError.message}`);
      }
    }

    // Return the complete duplicated list
    const completeList = await this.getById(listData.id);
    if (!completeList) {
      throw new ValidationError('Failed to retrieve duplicated shopping list');
    }

    return completeList;
  }

  /**
   * Clear all completed items from a list
   */
  async clearCompletedItems(listId: string): Promise<ShoppingList> {
    const { error } = await this.supabase
      .from('shopping_list_items')
      .delete()
      .eq('list_id', listId)
      .eq('collected', true);

    if (error) {
      throw new ValidationError(`Failed to clear completed items: ${error.message}`);
    }

    // Update list timestamp
    await this.supabase
      .from('shopping_lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);

    // Return the updated list
    const updatedList = await this.getById(listId);
    if (!updatedList) {
      throw new ValidationError('Failed to retrieve updated shopping list');
    }

    return updatedList;
  }

  /**
   * Helper method to get list by name (case-insensitive)
   */
  private async getByName(name: string): Promise<ShoppingList | null> {
    const { data, error } = await this.supabase
      .from('shopping_lists')
      .select(`
        *,
        shopping_list_items (
          *,
          items (*)
        )
      `)
      .ilike('name', name)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new ValidationError(`Failed to fetch shopping list by name: ${error.message}`);
    }

    return this.mapDatabaseResponseToShoppingList(data);
  }

  /**
   * Map database response to ShoppingList type
   */
  private mapDatabaseResponseToShoppingList(data: ShoppingListWithItems): ShoppingList {
    const items: ShoppingListItem[] = data.shopping_list_items.map(listItem => ({
      itemId: listItem.items.id,
      quantity: listItem.quantity,
      collected: listItem.collected,
    }));

    return {
      id: data.id,
      name: data.name,
      updatedAt: data.updated_at,
      items,
      deletedAt: data.deleted_at || undefined,
    };
  }

  /**
   * Map array of database responses to ShoppingList array
   */
  private mapDatabaseResponseToShoppingLists(data: ShoppingListWithItems[]): ShoppingList[] {
    return data.map(item => this.mapDatabaseResponseToShoppingList(item));
  }
}
