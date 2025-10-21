import { Item } from '@/types/shopping-list';

/**
 * Extract all unique tags from an array of items
 */
export function extractUniqueTags(items: Item[]): string[] {
  const tagSet = new Set<string>();
  
  items.forEach(item => {
    item.tags.forEach(tag => {
      tagSet.add(tag);
    });
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Get tags sorted by usage frequency (most used first)
 */
export function getTagsByFrequency(items: Item[]): string[] {
  const tagCounts = new Map<string, number>();
  
  items.forEach(item => {
    item.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([tag]) => tag);
}

/**
 * Get tags with their usage counts
 */
export function getTagsWithCounts(items: Item[]): Array<{ tag: string; count: number }> {
  const tagCounts = new Map<string, number>();
  
  items.forEach(item => {
    item.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
}
