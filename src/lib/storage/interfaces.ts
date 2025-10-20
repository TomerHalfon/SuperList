import { Item, ShoppingList, ShoppingListItem } from '@/types/shopping-list';

// Input types for creating and updating entities
export interface CreateItemInput {
  name: string;
  emoji: string;
  tags: string[];
}

export interface UpdateItemInput {
  name?: string;
  emoji?: string;
  tags?: string[];
}

export interface CreateListInput {
  name: string;
  items?: ShoppingListItem[];
}

export interface UpdateListInput {
  name?: string;
  items?: ShoppingListItem[];
}

// Repository interfaces
export interface IItemRepository {
  // Basic CRUD operations
  getAll(): Promise<Item[]>;
  getById(id: string): Promise<Item | null>;
  create(data: CreateItemInput): Promise<Item>;
  update(id: string, data: UpdateItemInput): Promise<Item>;
  delete(id: string): Promise<void>;
  
  // Search and filtering
  search(query: string): Promise<Item[]>;
  getByTag(tag: string): Promise<Item[]>;
  getByTags(tags: string[]): Promise<Item[]>;
}

export interface IListRepository {
  // Basic CRUD operations
  getAll(): Promise<ShoppingList[]>;
  getById(id: string): Promise<ShoppingList | null>;
  create(data: CreateListInput): Promise<ShoppingList>;
  update(id: string, data: UpdateListInput): Promise<ShoppingList>;
  delete(id: string): Promise<void>;
  
  // Item management operations
  addItem(listId: string, item: ShoppingListItem): Promise<ShoppingList>;
  removeItem(listId: string, itemId: string): Promise<ShoppingList>;
  updateItem(listId: string, itemId: string, updates: Partial<ShoppingListItem>): Promise<ShoppingList>;
  toggleItemCollected(listId: string, itemId: string): Promise<ShoppingList>;
  
  // List operations
  duplicateList(id: string, newName?: string): Promise<ShoppingList>;
  clearCompletedItems(listId: string): Promise<ShoppingList>;
}

// Storage configuration
export interface StorageConfig {
  type: 'json' | 'vercel-kv' | 'vercel-postgres' | 'supabase';
  options?: Record<string, any>;
}

// Error types
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

export class NotFoundError extends StorageError {
  constructor(resource: string, id: string) {
    super(`${resource} with id '${id}' not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends StorageError {
  constructor(message: string, public details?: any) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}
