import { IItemRepository, IListRepository, StorageConfig } from './interfaces';
import { JsonStorage } from './json/json-storage';
import { JsonItemRepository } from './json/item-repository';
import { JsonListRepository } from './json/list-repository';
import { SupabaseItemRepository } from './supabase/item-repository';
import { SupabaseListRepository } from './supabase/list-repository';

// Storage configuration
const getStorageConfig = (): StorageConfig => {
  const storageType = (process.env.STORAGE_TYPE || 'json') as StorageConfig['type'];
  
  return {
    type: storageType,
    options: {
      dataDir: process.env.STORAGE_DATA_DIR || 'data',
      // Future: Add KV/Postgres connection options here
    },
  };
};

// Storage instances (singleton pattern)
let itemRepository: IItemRepository | null = null;
let listRepository: IListRepository | null = null;

/**
 * Get the item repository instance
 */
export function getItemRepository(): IItemRepository {
  if (!itemRepository) {
    const config = getStorageConfig();
    
    switch (config.type) {
      case 'json':
        const jsonStorage = new JsonStorage(config.options?.dataDir);
        itemRepository = new JsonItemRepository(jsonStorage);
        break;
        
      case 'supabase':
        itemRepository = new SupabaseItemRepository();
        break;
        
      case 'vercel-kv':
        // Future: Implement Vercel KV repository
        throw new Error('Vercel KV storage not yet implemented');
        
      case 'vercel-postgres':
        // Future: Implement Vercel Postgres repository
        throw new Error('Vercel Postgres storage not yet implemented');
        
      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  }
  
  return itemRepository;
}

/**
 * Get the list repository instance
 */
export function getListRepository(): IListRepository {
  if (!listRepository) {
    const config = getStorageConfig();
    
    switch (config.type) {
      case 'json':
        const jsonStorage = new JsonStorage(config.options?.dataDir);
        listRepository = new JsonListRepository(jsonStorage);
        break;
        
      case 'supabase':
        listRepository = new SupabaseListRepository();
        break;
        
      case 'vercel-kv':
        // Future: Implement Vercel KV repository
        throw new Error('Vercel KV storage not yet implemented');
        
      case 'vercel-postgres':
        // Future: Implement Vercel Postgres repository
        throw new Error('Vercel Postgres storage not yet implemented');
        
      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  }
  
  return listRepository;
}

/**
 * Initialize storage with default data
 */
export async function initializeStorage(): Promise<void> {
  const config = getStorageConfig();
  
  if (config.type === 'json') {
    // Import mock data for initialization
    const { mockItems, mockShoppingLists } = await import('@/lib/data/mock-data');
    
    const itemRepo = getItemRepository() as JsonItemRepository;
    const listRepo = getListRepository() as JsonListRepository;
    
    await itemRepo.initializeWithDefaults(mockItems.items);
    await listRepo.initializeWithDefaults(mockShoppingLists.lists);
  }
  
  // For Supabase, initialization is handled by the migration script
  // No automatic initialization needed as data is managed through migrations
}

/**
 * Reset storage instances (useful for testing)
 */
export function resetStorageInstances(): void {
  itemRepository = null;
  listRepository = null;
}

/**
 * Get storage configuration
 */
export function getStorageConfiguration(): StorageConfig {
  return getStorageConfig();
}

// Export types for external use
export type { IItemRepository, IListRepository, StorageConfig } from './interfaces';
export type { CreateItemInput, UpdateItemInput, CreateListInput, UpdateListInput } from './interfaces';
