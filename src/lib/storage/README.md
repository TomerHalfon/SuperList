# SuperList Data Layer

A flexible, type-safe data access layer for the SuperList shopping list application. This layer provides a clean abstraction over storage implementations, currently using JSON files with easy migration to Vercel storage solutions.

## 🏗️ Architecture Overview

The data layer follows a repository pattern with clear separation of concerns:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Components    │───▶│  Server Actions  │───▶│   Repositories  │
│                 │    │                  │    │                 │
│ - UI Components │    │ - Validation     │    │ - JSON Storage  │
│ - Pages         │    │ - Error Handling │    │ - Future: KV    │
│                 │    │ - Revalidation   │    │ - Future: DB    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 File Structure

```
src/lib/storage/
├── README.md                    # This documentation
├── interfaces.ts                # Core interfaces and types
├── index.ts                     # Factory and exports
└── json/                        # JSON file implementation
    ├── json-storage.ts          # Core file operations
    ├── item-repository.ts       # Item CRUD operations
    └── list-repository.ts       # List CRUD operations
```

## 🔧 Core Components

### 1. Storage Interfaces (`interfaces.ts`)

Defines the contract for all storage operations:

```typescript
interface IItemRepository {
  // Basic CRUD
  getAll(): Promise<Item[]>;
  getById(id: string): Promise<Item | null>;
  create(data: CreateItemInput): Promise<Item>;
  update(id: string, data: UpdateItemInput): Promise<Item>;
  delete(id: string): Promise<void>;
  
  // Search operations
  search(query: string): Promise<Item[]>;
  getByTag(tag: string): Promise<Item[]>;
  getByTags(tags: string[]): Promise<Item[]>;
}

interface IListRepository {
  // Basic CRUD
  getAll(): Promise<ShoppingList[]>;
  getById(id: string): Promise<ShoppingList | null>;
  create(data: CreateListInput): Promise<ShoppingList>;
  update(id: string, data: UpdateListInput): Promise<ShoppingList>;
  delete(id: string): Promise<void>;
  
  // Item management
  addItem(listId: string, item: ShoppingListItem): Promise<ShoppingList>;
  removeItem(listId: string, itemId: string): Promise<ShoppingList>;
  updateItem(listId: string, itemId: string, updates: Partial<ShoppingListItem>): Promise<ShoppingList>;
  toggleItemCollected(listId: string, itemId: string): Promise<ShoppingList>;
  
  // List operations
  duplicateList(id: string, newName?: string): Promise<ShoppingList>;
  clearCompletedItems(listId: string): Promise<ShoppingList>;
}
```

### 2. Storage Factory (`index.ts`)

Provides a unified interface to get repository instances:

```typescript
// Get repositories
const itemRepo = getItemRepository();
const listRepo = getListRepository();

// Initialize with default data
await initializeStorage();
```

**Configuration:**
- `STORAGE_TYPE`: Storage implementation (`json`, `vercel-kv`, `vercel-postgres`)
- `STORAGE_DATA_DIR`: Data directory path (default: `data`)

### 3. JSON Storage Implementation

#### Core Storage (`json/json-storage.ts`)

Handles atomic file operations with locking:

```typescript
class JsonStorage {
  async readJson<T>(filename: string, defaultValue: T): Promise<T>
  async writeJson<T>(filename: string, data: T): Promise<void>
  async fileExists(filename: string): Promise<boolean>
  async deleteFile(filename: string): Promise<void>
}
```

**Features:**
- ✅ Atomic writes with temporary files
- ✅ File locking to prevent concurrent access
- ✅ Automatic directory creation
- ✅ Comprehensive error handling
- ✅ Type-safe operations

#### Repositories (`json/item-repository.ts`, `json/list-repository.ts`)

Implement the storage interfaces using JSON files:

```typescript
class JsonItemRepository implements IItemRepository {
  // All interface methods implemented
  // Automatic validation and error handling
  // UUID generation for new items
}

class JsonListRepository implements IListRepository {
  // All interface methods implemented
  // Automatic timestamp updates
  // Deep copying for list duplication
}
```

## 🚀 Usage Examples

### Server Actions

```typescript
// src/actions/lists.ts
'use server';

export async function toggleItemCollectedAction(listId: string, itemId: string) {
  try {
    const repository = getListRepository();
    const list = await repository.toggleItemCollected(listId, itemId);
    
    revalidatePath(`/lists/${listId}`);
    return { success: true, data: list };
  } catch (error) {
    return { success: false, error: 'Failed to toggle item' };
  }
}
```

### Direct Repository Usage

```typescript
// In Server Components or API routes
const itemRepo = getItemRepository();
const listRepo = getListRepository();

// Get all items
const items = await itemRepo.getAll();

// Create a new list
const newList = await listRepo.create({
  name: "Weekly Groceries",
  items: []
});

// Add item to list
const updatedList = await listRepo.addItem(newList.id, {
  itemId: "item-1",
  quantity: 2,
  collected: false
});
```

## 📊 Data Models

### Item
```typescript
interface Item {
  id: string;           // UUID
  name: string;         // Item name
  emoji: string;        // Display emoji
  tags: string[];       // Categorization tags
}
```

### ShoppingList
```typescript
interface ShoppingList {
  id: string;                    // UUID
  name: string;                  // List name
  updatedAt: string;             // ISO timestamp
  items: ShoppingListItem[];     // List items
}
```

### ShoppingListItem
```typescript
interface ShoppingListItem {
  itemId: string;       // Reference to Item.id
  quantity: number;     // Quantity needed
  collected: boolean;   // Collection status
}
```

## 🔒 Data Storage

### JSON Files

Data is stored in two JSON files at the project root:

```
data/
├── items.json         # All available items
└── lists.json         # All shopping lists
```

**File Format:**
```json
{
  "items": [
    {
      "id": "item-1",
      "name": "Milk",
      "emoji": "🥛",
      "tags": ["dairy", "beverages", "breakfast"]
    }
  ]
}
```

### File Operations

- **Atomic Writes**: All writes use temporary files and atomic rename
- **File Locking**: Prevents concurrent access corruption
- **Error Recovery**: Graceful handling of file system errors
- **Type Safety**: Full TypeScript validation

## 🔄 Migration Path

### Current: JSON Files
```typescript
// Environment variables
STORAGE_TYPE=json
STORAGE_DATA_DIR=data
```

### Current: Supabase
```typescript
// Environment variables
STORAGE_TYPE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

**Implementation:**
- `src/lib/storage/supabase/supabase-client.ts` - Supabase client configuration
- `src/lib/storage/supabase/item-repository.ts` - Items repository using PostgREST
- `src/lib/storage/supabase/list-repository.ts` - Lists repository with normalized schema
- `supabase/migrations/001_initial_schema.sql` - Database schema with triggers
- `supabase/seed.sql` - Seed data for development
- `scripts/migrate-json-to-supabase.ts` - Migration script

### Future: Vercel KV
```typescript
// 1. Create src/lib/storage/vercel/kv-repository.ts
class VercelKVItemRepository implements IItemRepository {
  // Implement all interface methods using Vercel KV
}

// 2. Update factory in index.ts
case 'vercel-kv':
  return new VercelKVItemRepository(kvClient);
```

### Future: Vercel Postgres
```typescript
// 1. Create src/lib/storage/vercel/postgres-repository.ts
class VercelPostgresItemRepository implements IItemRepository {
  // Implement all interface methods using SQL
}

// 2. Update factory in index.ts
case 'vercel-postgres':
  return new VercelPostgresItemRepository(sqlClient);
```

**Migration Benefits:**
- ✅ Zero code changes in components or Server Actions
- ✅ Same interface across all implementations
- ✅ Easy A/B testing between storage types
- ✅ Gradual migration support

## 🛡️ Error Handling

### Error Types

```typescript
class StorageError extends Error {
  constructor(message: string, code: string, statusCode: number = 500)
}

class NotFoundError extends StorageError {
  constructor(resource: string, id: string)
}

class ValidationError extends StorageError {
  constructor(message: string, details?: any)
}
```

### Error Handling Strategy

1. **Validation**: Zod schemas validate all inputs
2. **Repository**: Business logic errors with specific error types
3. **Server Actions**: User-friendly error messages
4. **Components**: Graceful error states and fallbacks

## 🧪 Testing

### Unit Tests
```typescript
// Test repositories in isolation
const mockStorage = new MockJsonStorage();
const itemRepo = new JsonItemRepository(mockStorage);

test('should create item with valid data', async () => {
  const item = await itemRepo.create({
    name: 'Test Item',
    emoji: '🧪',
    tags: ['test']
  });
  
  expect(item.id).toBeDefined();
  expect(item.name).toBe('Test Item');
});
```

### Integration Tests
```typescript
// Test with real file system
const storage = new JsonStorage('test-data');
const itemRepo = new JsonItemRepository(storage);

test('should persist data to file system', async () => {
  await itemRepo.create(testItem);
  const items = await itemRepo.getAll();
  expect(items).toContainEqual(expect.objectContaining(testItem));
});
```

## 📈 Performance Considerations

### Caching
- Server Components cache data automatically
- `revalidatePath()` invalidates cache when needed
- No client-side caching (Server Actions handle state)

### File Operations
- Atomic writes prevent data corruption
- File locking prevents race conditions
- Efficient JSON parsing with error handling

### Scalability
- JSON files suitable for development and small deployments
- Easy migration to scalable solutions (KV, Postgres)
- Repository pattern supports horizontal scaling

## 🔧 Development

### Initialization
```bash
# Initialize storage with mock data (JSON only)
node scripts/init-storage.js
```

### Environment Variables
```bash
# .env.local
STORAGE_TYPE=json
STORAGE_DATA_DIR=data
```

## 🚀 Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from the project settings

### 2. Configure Environment Variables
```bash
# .env.local
STORAGE_TYPE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Database Migration
```bash
# Option 1: Use Supabase CLI (recommended)
supabase db reset
supabase db push

# Option 2: Run SQL manually in Supabase Dashboard
# Copy and execute the contents of supabase/migrations/001_initial_schema.sql
```

### 4. Seed Database (Optional)
```bash
# Option 1: Use Supabase CLI
supabase db seed

# Option 2: Run SQL manually in Supabase Dashboard
# Copy and execute the contents of supabase/seed.sql
```

### 5. Migrate Existing JSON Data
```bash
# If you have existing JSON data to migrate
npx tsx scripts/migrate-json-to-supabase.ts
```

### 6. Verify Setup
```bash
# Start the development server
npm run dev

# The app should now use Supabase for data storage
```

### Adding New Operations

1. **Add to Interface**: Update `IItemRepository` or `IListRepository`
2. **Implement in JSON**: Add method to repository classes
3. **Implement in Supabase**: Add method to Supabase repository classes
4. **Create Server Action**: Add action in `src/actions/`
5. **Update Components**: Use new Server Action

## 🗄️ Supabase Implementation Details

### Database Schema
The Supabase implementation uses a normalized database schema:

- **items**: Stores all available items with tags as PostgreSQL arrays
- **shopping_lists**: Stores shopping list metadata
- **shopping_list_items**: Junction table linking lists to items with quantity and collected status

### Key Features
- **Automatic Timestamps**: Triggers update `updated_at` on list modifications
- **Array Support**: Tags stored as PostgreSQL arrays for efficient querying
- **Foreign Key Constraints**: Ensures data integrity
- **Indexes**: Optimized for common queries (name search, tag filtering)
- **Row Level Security**: Ready for multi-user support (currently open for single-user)

### Query Patterns
```typescript
// Search items by name (case-insensitive)
.ilike('name', `%${query}%`)

// Filter by tags (array contains)
.contains('tags', [tag])

// Join lists with items
.select('*, shopping_list_items(*, items(*))')

// Error handling (PostgREST pattern)
const { data, error } = await supabase.from('table').select()
if (error) throw new ValidationError(error.message)
```

### Debugging

```typescript
// Enable debug logging
const storage = new JsonStorage('data', { debug: true });

// Check file operations
console.log(await storage.getFileStats('items.json'));
```

## 📚 API Reference

### Repository Methods

#### ItemRepository
- `getAll()`: Get all items
- `getById(id)`: Get item by ID
- `create(data)`: Create new item
- `update(id, data)`: Update existing item
- `delete(id)`: Delete item
- `search(query)`: Search items by name/tags
- `getByTag(tag)`: Get items by single tag
- `getByTags(tags)`: Get items by multiple tags

#### ListRepository
- `getAll()`: Get all lists
- `getById(id)`: Get list by ID
- `create(data)`: Create new list
- `update(id, data)`: Update existing list
- `delete(id)`: Delete list
- `addItem(listId, item)`: Add item to list
- `removeItem(listId, itemId)`: Remove item from list
- `updateItem(listId, itemId, updates)`: Update item in list
- `toggleItemCollected(listId, itemId)`: Toggle item collected status
- `duplicateList(id, newName?)`: Duplicate existing list
- `clearCompletedItems(listId)`: Remove all collected items

### Server Actions

#### Items (`src/actions/items.ts`)
- `getAllItemsAction()`
- `getItemByIdAction(id)`
- `createItemAction(formData)`
- `updateItemAction(id, formData)`
- `deleteItemAction(id)`
- `searchItemsAction(query)`
- `getItemsByTagAction(tag)`
- `getItemsByTagsAction(tags)`

#### Lists (`src/actions/lists.ts`)
- `getAllListsAction()`
- `getListByIdAction(id)`
- `createListAction(formData)`
- `updateListAction(id, formData)`
- `deleteListAction(id)`
- `addItemToListAction(listId, formData)`
- `removeItemFromListAction(listId, itemId)`
- `toggleItemCollectedAction(listId, itemId)`
- `updateListItemAction(listId, itemId, formData)`
- `duplicateListAction(id, newName?)`
- `clearCompletedItemsAction(listId)`

## 🤝 Contributing

1. **Follow Interface Contract**: All implementations must satisfy the repository interfaces
2. **Add Tests**: Include unit and integration tests for new features
3. **Update Documentation**: Keep this README current with changes
4. **Error Handling**: Use appropriate error types and messages
5. **Type Safety**: Maintain full TypeScript coverage

## 📝 License

This data layer is part of the SuperList application and follows the same license terms.
