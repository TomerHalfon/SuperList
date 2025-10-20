#!/usr/bin/env tsx

/**
 * Migration script to transfer data from JSON files to Supabase
 * 
 * Usage:
 *   npm run migrate:json-to-supabase
 *   or
 *   npx tsx scripts/migrate-json-to-supabase.ts
 * 
 * Environment variables required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   - STORAGE_DATA_DIR (optional, defaults to 'data')
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getSupabaseClient } from '../src/lib/storage/supabase/supabase-client';
import { Item, ShoppingList, ItemsData, ShoppingListsData } from '../src/types/shopping-list';

interface MigrationStats {
  items: {
    total: number;
    migrated: number;
    errors: number;
  };
  lists: {
    total: number;
    migrated: number;
    errors: number;
  };
  listItems: {
    total: number;
    migrated: number;
    errors: number;
  };
}

class JsonToSupabaseMigrator {
  private supabase = getSupabaseClient();
  private dataDir: string;
  private stats: MigrationStats = {
    items: { total: 0, migrated: 0, errors: 0 },
    lists: { total: 0, migrated: 0, errors: 0 },
    listItems: { total: 0, migrated: 0, errors: 0 },
  };

  constructor(dataDir: string = 'data') {
    this.dataDir = dataDir;
  }

  /**
   * Run the complete migration process
   */
  async migrate(): Promise<void> {
    console.log('🚀 Starting JSON to Supabase migration...\n');

    try {
      // Check if JSON files exist
      const itemsFile = join(this.dataDir, 'items.json');
      const listsFile = join(this.dataDir, 'lists.json');

      if (!existsSync(itemsFile)) {
        throw new Error(`Items file not found: ${itemsFile}`);
      }
      if (!existsSync(listsFile)) {
        throw new Error(`Lists file not found: ${listsFile}`);
      }

      // Read JSON data
      console.log('📖 Reading JSON data...');
      const itemsData: ItemsData = JSON.parse(readFileSync(itemsFile, 'utf-8'));
      const listsData: ShoppingListsData = JSON.parse(readFileSync(listsFile, 'utf-8'));

      this.stats.items.total = itemsData.items.length;
      this.stats.lists.total = listsData.lists.length;
      this.stats.listItems.total = listsData.lists.reduce((sum, list) => sum + list.items.length, 0);

      console.log(`   Found ${this.stats.items.total} items`);
      console.log(`   Found ${this.stats.lists.total} shopping lists`);
      console.log(`   Found ${this.stats.listItems.total} list items\n`);

      // Clear existing data
      console.log('🧹 Clearing existing Supabase data...');
      await this.clearExistingData();

      // Migrate items
      console.log('📦 Migrating items...');
      await this.migrateItems(itemsData.items);

      // Migrate shopping lists
      console.log('📋 Migrating shopping lists...');
      await this.migrateShoppingLists(listsData.lists);

      // Print final statistics
      this.printStats();

      console.log('\n✅ Migration completed successfully!');
    } catch (error) {
      console.error('\n❌ Migration failed:', error);
      process.exit(1);
    }
  }

  /**
   * Clear existing data from Supabase
   */
  private async clearExistingData(): Promise<void> {
    // Delete in reverse order due to foreign key constraints
    const { error: listItemsError } = await this.supabase
      .from('shopping_list_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (listItemsError) {
      throw new Error(`Failed to clear shopping_list_items: ${listItemsError.message}`);
    }

    const { error: listsError } = await this.supabase
      .from('shopping_lists')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (listsError) {
      throw new Error(`Failed to clear shopping_lists: ${listsError.message}`);
    }

    const { error: itemsError } = await this.supabase
      .from('items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (itemsError) {
      throw new Error(`Failed to clear items: ${itemsError.message}`);
    }

    console.log('   ✅ Existing data cleared\n');
  }

  /**
   * Migrate items to Supabase
   */
  private async migrateItems(items: Item[]): Promise<void> {
    for (const item of items) {
      try {
        const { error } = await this.supabase
          .from('items')
          .insert({
            id: item.id,
            name: item.name,
            emoji: item.emoji,
            tags: item.tags,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error(`   ❌ Failed to migrate item "${item.name}": ${error.message}`);
          this.stats.items.errors++;
        } else {
          this.stats.items.migrated++;
          if (this.stats.items.migrated % 5 === 0) {
            process.stdout.write('.');
          }
        }
      } catch (error) {
        console.error(`   ❌ Failed to migrate item "${item.name}": ${error}`);
        this.stats.items.errors++;
      }
    }

    console.log(`\n   ✅ Migrated ${this.stats.items.migrated}/${this.stats.items.total} items`);
    if (this.stats.items.errors > 0) {
      console.log(`   ⚠️  ${this.stats.items.errors} items failed to migrate\n`);
    } else {
      console.log('');
    }
  }

  /**
   * Migrate shopping lists to Supabase
   */
  private async migrateShoppingLists(lists: ShoppingList[]): Promise<void> {
    for (const list of lists) {
      try {
        // Insert the shopping list
        const { error: listError } = await this.supabase
          .from('shopping_lists')
          .insert({
            id: list.id,
            name: list.name,
            updated_at: list.updatedAt,
            created_at: new Date().toISOString(),
          });

        if (listError) {
          console.error(`   ❌ Failed to migrate list "${list.name}": ${listError.message}`);
          this.stats.lists.errors++;
          continue;
        }

        this.stats.lists.migrated++;

        // Insert list items
        if (list.items.length > 0) {
          const listItems = list.items.map((item, index) => ({
            id: `${list.id}-item-${index}`,
            list_id: list.id,
            item_id: item.itemId,
            quantity: item.quantity,
            collected: item.collected,
          }));

          const { error: itemsError } = await this.supabase
            .from('shopping_list_items')
            .insert(listItems);

          if (itemsError) {
            console.error(`   ❌ Failed to migrate items for list "${list.name}": ${itemsError.message}`);
            this.stats.listItems.errors += list.items.length;
          } else {
            this.stats.listItems.migrated += list.items.length;
          }
        }

        process.stdout.write('.');
      } catch (error) {
        console.error(`   ❌ Failed to migrate list "${list.name}": ${error}`);
        this.stats.lists.errors++;
      }
    }

    console.log(`\n   ✅ Migrated ${this.stats.lists.migrated}/${this.stats.lists.total} shopping lists`);
    console.log(`   ✅ Migrated ${this.stats.listItems.migrated}/${this.stats.listItems.total} list items`);
    
    if (this.stats.lists.errors > 0 || this.stats.listItems.errors > 0) {
      console.log(`   ⚠️  ${this.stats.lists.errors} lists and ${this.stats.listItems.errors} list items failed to migrate\n`);
    } else {
      console.log('');
    }
  }

  /**
   * Print migration statistics
   */
  private printStats(): void {
    console.log('\n📊 Migration Statistics:');
    console.log('┌─────────────────┬─────────┬───────────┬────────┐');
    console.log('│ Table           │ Total   │ Migrated  │ Errors │');
    console.log('├─────────────────┼─────────┼───────────┼────────┤');
    console.log(`│ Items           │ ${this.stats.items.total.toString().padEnd(7)} │ ${this.stats.items.migrated.toString().padEnd(9)} │ ${this.stats.items.errors.toString().padEnd(6)} │`);
    console.log(`│ Shopping Lists  │ ${this.stats.lists.total.toString().padEnd(7)} │ ${this.stats.lists.migrated.toString().padEnd(9)} │ ${this.stats.lists.errors.toString().padEnd(6)} │`);
    console.log(`│ List Items      │ ${this.stats.listItems.total.toString().padEnd(7)} │ ${this.stats.listItems.migrated.toString().padEnd(9)} │ ${this.stats.listItems.errors.toString().padEnd(6)} │`);
    console.log('└─────────────────┴─────────┴───────────┴────────┘');

    const totalErrors = this.stats.items.errors + this.stats.lists.errors + this.stats.listItems.errors;
    if (totalErrors === 0) {
      console.log('\n🎉 All data migrated successfully!');
    } else {
      console.log(`\n⚠️  ${totalErrors} items failed to migrate. Check the logs above for details.`);
    }
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('\nPlease set these variables in your .env.local file or environment.');
    process.exit(1);
  }

  const dataDir = process.env.STORAGE_DATA_DIR || 'data';
  const migrator = new JsonToSupabaseMigrator(dataDir);
  
  await migrator.migrate();
}

// Run the migration if this script is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
}

export { JsonToSupabaseMigrator };
