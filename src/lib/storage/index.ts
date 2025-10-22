import { IItemRepository, IListRepository, StorageConfig } from './interfaces';
import { JsonStorage } from './json/json-storage';
import { JsonItemRepository } from './json/item-repository';
import { JsonListRepository } from './json/list-repository';
import { SupabaseItemRepository } from './supabase/item-repository';
import { SupabaseListRepository } from './supabase/list-repository';
import { createServerSupabaseClient } from './supabase/server';
import { createClientSupabaseClient } from './supabase/client';

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

// Storage instances (singleton pattern for JSON only)
let jsonItemRepository: JsonItemRepository | null = null;
let jsonListRepository: JsonListRepository | null = null;

/**
 * Get the item repository instance for server-side usage (Server Components, Server Actions)
 */
export async function getItemRepository(): Promise<IItemRepository> {
  console.log('STORAGE_TYPE', process.env.STORAGE_TYPE);
  const config = getStorageConfig();
  
  switch (config.type) {
    case 'json':
      if (!jsonItemRepository) {
        const jsonStorage = new JsonStorage(config.options?.dataDir);
        jsonItemRepository = new JsonItemRepository(jsonStorage);
      }
      return jsonItemRepository;
      
    case 'supabase':
      // For server-side, create a new client each time
      const serverClient = await createServerSupabaseClient();
      return new SupabaseItemRepository(serverClient);
      
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

/**
 * Get the list repository instance for server-side usage (Server Components, Server Actions)
 */
export async function getListRepository(): Promise<IListRepository> {
  const config = getStorageConfig();
  
  switch (config.type) {
    case 'json':
      if (!jsonListRepository) {
        const jsonStorage = new JsonStorage(config.options?.dataDir);
        jsonListRepository = new JsonListRepository(jsonStorage);
      }
      return jsonListRepository;
      
    case 'supabase':
      // For server-side, create a new client each time
      const serverClient = await createServerSupabaseClient();
      return new SupabaseListRepository(serverClient);
      
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

/**
 * Get the item repository instance for client-side usage (Client Components)
 * Note: This is synchronous and uses the browser client
 */
export function getClientItemRepository(): IItemRepository {
  const config = getStorageConfig();
  
  switch (config.type) {
    case 'json':
      throw new Error('JSON storage is not available on the client-side');
      
    case 'supabase':
      const browserClient = createClientSupabaseClient();
      return new SupabaseItemRepository(browserClient);
      
    case 'vercel-kv':
      throw new Error('Vercel KV storage not yet implemented');
      
    case 'vercel-postgres':
      throw new Error('Vercel Postgres storage not yet implemented');
      
    default:
      throw new Error(`Unsupported storage type: ${config.type}`);
  }
}

/**
 * Get the list repository instance for client-side usage (Client Components)
 * Note: This is synchronous and uses the browser client
 */
export function getClientListRepository(): IListRepository {
  const config = getStorageConfig();
  
  switch (config.type) {
    case 'json':
      throw new Error('JSON storage is not available on the client-side');
      
    case 'supabase':
      const browserClient = createClientSupabaseClient();
      return new SupabaseListRepository(browserClient);
      
    case 'vercel-kv':
      throw new Error('Vercel KV storage not yet implemented');
      
    case 'vercel-postgres':
      throw new Error('Vercel Postgres storage not yet implemented');
      
    default:
      throw new Error(`Unsupported storage type: ${config.type}`);
  }
}

/**
 * Initialize storage with default data
 */
export async function initializeStorage(): Promise<void> {
  const config = getStorageConfig();
  
  if (config.type === 'json') {
    // Import mock data for initialization
    const { mockItems, mockShoppingLists } = await import('@/lib/data/mock-data');
    
    const itemRepo = await getItemRepository() as JsonItemRepository;
    const listRepo = await getListRepository() as JsonListRepository;
    
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
  jsonItemRepository = null;
  jsonListRepository = null;
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
