import { v4 as uuidv4 } from 'uuid';
import { Item, ItemsData } from '@/types/shopping-list';
import { IItemRepository, CreateItemInput, UpdateItemInput, NotFoundError, ValidationError } from '../interfaces';
import { JsonStorage } from './json-storage';
import { validateCreateItem, validateUpdateItem, validateItemsData } from '@/lib/validations/item-schemas';

export class JsonItemRepository implements IItemRepository {
  private readonly storage: JsonStorage;
  private readonly filename = 'items.json';

  constructor(storage: JsonStorage) {
    this.storage = storage;
  }

  /**
   * Get all items
   */
  async getAll(): Promise<Item[]> {
    const data = await this.storage.readJson<ItemsData>(this.filename, { items: [] });
    return data.items;
  }

  /**
   * Get item by ID
   */
  async getById(id: string): Promise<Item | null> {
    const items = await this.getAll();
    return items.find(item => item.id === id) || null;
  }

  /**
   * Create a new item
   */
  async create(data: CreateItemInput): Promise<Item> {
    try {
      const validatedData = validateCreateItem(data);
      
      // Check if item with same name already exists
      const existingItems = await this.getAll();
      const existingItem = existingItems.find(item => 
        item.name.toLowerCase() === validatedData.name.toLowerCase()
      );
      
      if (existingItem) {
        throw new ValidationError(`Item with name '${validatedData.name}' already exists`);
      }

      const newItem: Item = {
        id: uuidv4(),
        name: validatedData.name,
        emoji: validatedData.emoji,
        tags: validatedData.tags,
      };

      const updatedItems = [...existingItems, newItem];
      await this.storage.writeJson(this.filename, { items: updatedItems });

      return newItem;
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
  async update(id: string, data: UpdateItemInput): Promise<Item> {
    try {
      const validatedData = validateUpdateItem(data);
      const items = await this.getAll();
      const itemIndex = items.findIndex(item => item.id === id);

      if (itemIndex === -1) {
        throw new NotFoundError('Item', id);
      }

      // Check if name is being changed and if it conflicts with existing items
      if (validatedData.name) {
        const existingItem = items.find(item => 
          item.id !== id && 
          item.name.toLowerCase() === validatedData.name!.toLowerCase()
        );
        
        if (existingItem) {
          throw new ValidationError(`Item with name '${validatedData.name}' already exists`);
        }
      }

      const updatedItem: Item = {
        ...items[itemIndex],
        ...validatedData,
      };

      items[itemIndex] = updatedItem;
      await this.storage.writeJson(this.filename, { items });

      return updatedItem;
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
    const items = await this.getAll();
    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      throw new NotFoundError('Item', id);
    }

    items.splice(itemIndex, 1);
    await this.storage.writeJson(this.filename, { items });
  }

  /**
   * Search items by query (name or tags)
   */
  async search(query: string): Promise<Item[]> {
    if (!query.trim()) {
      return this.getAll();
    }

    const items = await this.getAll();
    const searchTerm = query.toLowerCase();

    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get items by tag
   */
  async getByTag(tag: string): Promise<Item[]> {
    const items = await this.getAll();
    return items.filter(item => 
      item.tags.some(itemTag => itemTag.toLowerCase() === tag.toLowerCase())
    );
  }

  /**
   * Get items by multiple tags (must have all tags)
   */
  async getByTags(tags: string[]): Promise<Item[]> {
    if (tags.length === 0) {
      return this.getAll();
    }

    const items = await this.getAll();
    const normalizedTags = tags.map(tag => tag.toLowerCase());

    return items.filter(item => 
      normalizedTags.every(tag => 
        item.tags.some(itemTag => itemTag.toLowerCase() === tag)
      )
    );
  }

  /**
   * Initialize with default data if file doesn't exist
   */
  async initializeWithDefaults(defaultItems: Item[]): Promise<void> {
    const exists = await this.storage.fileExists(this.filename);
    if (!exists) {
      await this.storage.writeJson(this.filename, { items: defaultItems });
    }
  }
}
