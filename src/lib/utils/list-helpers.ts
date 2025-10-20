import { Item } from '@/types/shopping-list';
import { mockItems } from '@/lib/data/mock-data';

/**
 * Get full item details by itemId from items array or mock data
 * @param itemId - The ID of the item to look up
 * @param items - Optional array of items to search in (defaults to mock data)
 * @returns Item object with emoji, name, and tags, or undefined if not found
 */
export function getItemDetails(itemId: string, items?: Item[]): Item | undefined {
  const searchItems = items || mockItems.items;
  return searchItems.find(item => item.id === itemId);
}
