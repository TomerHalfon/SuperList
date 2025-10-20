import { v4 as uuidv4 } from 'uuid';
import { Item } from '@/types/shopping-list';
import { IItemRepository, CreateItemInput, UpdateItemInput, NotFoundError, ValidationError } from '../interfaces';
import { getSupabaseClient } from './supabase-client';
import { validateCreateItem, validateUpdateItem } from '@/lib/validations/item-schemas';

export class SupabaseItemRepository implements IItemRepository {
  private readonly supabase = getSupabaseClient();

  /**
   * Get all items
   */
  async getAll(): Promise<Item[]> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .order('name');

    if (error) {
      throw new ValidationError(`Failed to fetch items: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get item by ID
   */
  async getById(id: string): Promise<Item | null> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new ValidationError(`Failed to fetch item: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new item
   */
  async create(inputData: CreateItemInput): Promise<Item> {
    try {
      const validatedData = validateCreateItem(inputData);
      
      // Check if item with same name already exists
      const existingItem = await this.getByName(validatedData.name);
      if (existingItem) {
        throw new ValidationError(`Item with name '${validatedData.name}' already exists`);
      }

      const newItem = {
        id: uuidv4(),
        name: validatedData.name,
        emoji: validatedData.emoji,
        tags: validatedData.tags,
      };

      const { data, error } = await this.supabase
        .from('items')
        .insert(newItem)
        .select()
        .single();

      if (error) {
        throw new ValidationError(`Failed to create item: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(`Failed to create item: ${error}`);
    }
  }

  /**
   * Update an existing item
   */
  async update(id: string, inputData: UpdateItemInput): Promise<Item> {
    try {
      const validatedData = validateUpdateItem(inputData);
      
      // Check if item exists
      const existingItem = await this.getById(id);
      if (!existingItem) {
        throw new NotFoundError('Item', id);
      }

      // Check if name is being changed and if it conflicts with existing items
      if (validatedData.name && validatedData.name !== existingItem.name) {
        const conflictingItem = await this.getByName(validatedData.name);
        if (conflictingItem) {
          throw new ValidationError(`Item with name '${validatedData.name}' already exists`);
        }
      }

      const updateData = {
        ...validatedData,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabase
        .from('items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new ValidationError(`Failed to update item: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(`Failed to update item: ${error}`);
    }
  }

  /**
   * Delete an item
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) {
      throw new ValidationError(`Failed to delete item: ${error.message}`);
    }
  }

  /**
   * Search items by query (name or tags)
   */
  async search(query: string): Promise<Item[]> {
    if (!query.trim()) {
      return this.getAll();
    }

    const searchTerm = `%${query.toLowerCase()}%`;

    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .or(`name.ilike.${searchTerm},tags.cs.{${query}}`)
      .order('name');

    if (error) {
      throw new ValidationError(`Failed to search items: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get items by tag
   */
  async getByTag(tag: string): Promise<Item[]> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .contains('tags', [tag])
      .order('name');

    if (error) {
      throw new ValidationError(`Failed to fetch items by tag: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get items by multiple tags (must have all tags)
   */
  async getByTags(tags: string[]): Promise<Item[]> {
    if (tags.length === 0) {
      return this.getAll();
    }

    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .contains('tags', tags)
      .order('name');

    if (error) {
      throw new ValidationError(`Failed to fetch items by tags: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Helper method to get item by name (case-insensitive)
   */
  private async getByName(name: string): Promise<Item | null> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .ilike('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new ValidationError(`Failed to fetch item by name: ${error.message}`);
    }

    return data;
  }
}
