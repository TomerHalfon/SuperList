import { v4 as uuidv4 } from 'uuid';
import { ShoppingList, ShoppingListItem, ShoppingListsData } from '@/types/shopping-list';
import { IListRepository, CreateListInput, UpdateListInput, NotFoundError, ValidationError } from '../interfaces';
import { JsonStorage } from './json-storage';
import { validateCreateList, validateUpdateList, validateShoppingListsData } from '@/lib/validations/list-schemas';

export class JsonListRepository implements IListRepository {
  private readonly storage: JsonStorage;
  private readonly filename = 'lists.json';

  constructor(storage: JsonStorage) {
    this.storage = storage;
  }

  /**
   * Get all shopping lists
   */
  async getAll(): Promise<ShoppingList[]> {
    const data = await this.storage.readJson<ShoppingListsData>(this.filename, { lists: [] });
    return data.lists;
  }

  /**
   * Get shopping list by ID
   */
  async getById(id: string): Promise<ShoppingList | null> {
    const lists = await this.getAll();
    return lists.find(list => list.id === id) || null;
  }

  /**
   * Create a new shopping list
   */
  async create(data: CreateListInput): Promise<ShoppingList> {
    try {
      const validatedData = validateCreateList(data);
      
      // Check if list with same name already exists
      const existingLists = await this.getAll();
      const existingList = existingLists.find(list => 
        list.name.toLowerCase() === validatedData.name.toLowerCase()
      );
      
      if (existingList) {
        throw new ValidationError(`List with name '${validatedData.name}' already exists`);
      }

      const newList: ShoppingList = {
        id: uuidv4(),
        name: validatedData.name,
        updatedAt: new Date().toISOString(),
        items: validatedData.items || [],
      };

      const updatedLists = [...existingLists, newList];
      await this.storage.writeJson(this.filename, { lists: updatedLists });

      return newList;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(`Failed to create list: ${error}`);
    }
  }

  /**
   * Update an existing shopping list
   */
  async update(id: string, data: UpdateListInput): Promise<ShoppingList> {
    try {
      const validatedData = validateUpdateList(data);
      const lists = await this.getAll();
      const listIndex = lists.findIndex(list => list.id === id);

      if (listIndex === -1) {
        throw new NotFoundError('Shopping list', id);
      }

      // Check if name is being changed and if it conflicts with existing lists
      if (validatedData.name) {
        const existingList = lists.find(list => 
          list.id !== id && 
          list.name.toLowerCase() === validatedData.name!.toLowerCase()
        );
        
        if (existingList) {
          throw new ValidationError(`List with name '${validatedData.name}' already exists`);
        }
      }

      const updatedList: ShoppingList = {
        ...lists[listIndex],
        ...validatedData,
        updatedAt: new Date().toISOString(),
      };

      lists[listIndex] = updatedList;
      await this.storage.writeJson(this.filename, { lists });

      return updatedList;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(`Failed to update list: ${error}`);
    }
  }

  /**
   * Delete a shopping list
   */
  async delete(id: string): Promise<void> {
    const lists = await this.getAll();
    const listIndex = lists.findIndex(list => list.id === id);

    if (listIndex === -1) {
      throw new NotFoundError('Shopping list', id);
    }

    lists.splice(listIndex, 1);
    await this.storage.writeJson(this.filename, { lists });
  }

  /**
   * Add an item to a shopping list
   */
  async addItem(listId: string, item: ShoppingListItem): Promise<ShoppingList> {
    const lists = await this.getAll();
    const listIndex = lists.findIndex(list => list.id === listId);

    if (listIndex === -1) {
      throw new NotFoundError('Shopping list', listId);
    }

    const list = lists[listIndex];
    
    // Check if item already exists in the list
    const existingItemIndex = list.items.findIndex(listItem => listItem.itemId === item.itemId);
    
    if (existingItemIndex !== -1) {
      // Update existing item
      list.items[existingItemIndex] = item;
    } else {
      // Add new item
      list.items.push(item);
    }

    list.updatedAt = new Date().toISOString();
    lists[listIndex] = list;
    await this.storage.writeJson(this.filename, { lists });

    return list;
  }

  /**
   * Remove an item from a shopping list
   */
  async removeItem(listId: string, itemId: string): Promise<ShoppingList> {
    const lists = await this.getAll();
    const listIndex = lists.findIndex(list => list.id === listId);

    if (listIndex === -1) {
      throw new NotFoundError('Shopping list', listId);
    }

    const list = lists[listIndex];
    const itemIndex = list.items.findIndex(item => item.itemId === itemId);

    if (itemIndex === -1) {
      throw new NotFoundError('Item', itemId);
    }

    list.items.splice(itemIndex, 1);
    list.updatedAt = new Date().toISOString();
    lists[listIndex] = list;
    await this.storage.writeJson(this.filename, { lists });

    return list;
  }

  /**
   * Update an item in a shopping list
   */
  async updateItem(listId: string, itemId: string, updates: Partial<ShoppingListItem>): Promise<ShoppingList> {
    const lists = await this.getAll();
    const listIndex = lists.findIndex(list => list.id === listId);

    if (listIndex === -1) {
      throw new NotFoundError('Shopping list', listId);
    }

    const list = lists[listIndex];
    const itemIndex = list.items.findIndex(item => item.itemId === itemId);

    if (itemIndex === -1) {
      throw new NotFoundError('Item', itemId);
    }

    list.items[itemIndex] = {
      ...list.items[itemIndex],
      ...updates,
    };

    list.updatedAt = new Date().toISOString();
    lists[listIndex] = list;
    await this.storage.writeJson(this.filename, { lists });

    return list;
  }

  /**
   * Toggle the collected status of an item
   */
  async toggleItemCollected(listId: string, itemId: string): Promise<ShoppingList> {
    const lists = await this.getAll();
    const listIndex = lists.findIndex(list => list.id === listId);

    if (listIndex === -1) {
      throw new NotFoundError('Shopping list', listId);
    }

    const list = lists[listIndex];
    const itemIndex = list.items.findIndex(item => item.itemId === itemId);

    if (itemIndex === -1) {
      throw new NotFoundError('Item', itemId);
    }

    list.items[itemIndex].collected = !list.items[itemIndex].collected;
    list.updatedAt = new Date().toISOString();
    lists[listIndex] = list;
    await this.storage.writeJson(this.filename, { lists });

    return list;
  }

  /**
   * Duplicate a shopping list
   */
  async duplicateList(id: string, newName?: string): Promise<ShoppingList> {
    const lists = await this.getAll();
    const originalList = lists.find(list => list.id === id);

    if (!originalList) {
      throw new NotFoundError('Shopping list', id);
    }

    const duplicatedList: ShoppingList = {
      id: uuidv4(),
      name: newName || `${originalList.name} (Copy)`,
      updatedAt: new Date().toISOString(),
      items: originalList.items.map(item => ({ ...item })), // Deep copy items
    };

    const updatedLists = [...lists, duplicatedList];
    await this.storage.writeJson(this.filename, { lists: updatedLists });

    return duplicatedList;
  }

  /**
   * Clear all completed items from a list
   */
  async clearCompletedItems(listId: string): Promise<ShoppingList> {
    const lists = await this.getAll();
    const listIndex = lists.findIndex(list => list.id === listId);

    if (listIndex === -1) {
      throw new NotFoundError('Shopping list', listId);
    }

    const list = lists[listIndex];
    const completedCount = list.items.filter(item => item.collected).length;
    
    if (completedCount === 0) {
      return list; // No completed items to clear
    }

    list.items = list.items.filter(item => !item.collected);
    list.updatedAt = new Date().toISOString();
    lists[listIndex] = list;
    await this.storage.writeJson(this.filename, { lists });

    return list;
  }

  /**
   * Initialize with default data if file doesn't exist
   */
  async initializeWithDefaults(defaultLists: ShoppingList[]): Promise<void> {
    const exists = await this.storage.fileExists(this.filename);
    if (!exists) {
      await this.storage.writeJson(this.filename, { lists: defaultLists });
    }
  }
}
