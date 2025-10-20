import { Item } from '@/types/shopping-list';

/**
 * Parse comma-separated search terms and clean them
 */
export function parseSearchTerms(searchInput: string): string[] {
  if (!searchInput.trim()) return [];
  
  return searchInput
    .split(',')
    .map(term => term.trim())
    .filter(term => term.length > 0);
}

/**
 * Check if an item matches any of the search terms
 * Matches against item name (partial) or tags (exact)
 */
export function itemMatchesSearch(item: Item, searchTerms: string[]): boolean {
  if (searchTerms.length === 0) return true;

  return searchTerms.some(term => {
    const lowerTerm = term.toLowerCase();
    
    // Check item name (case-insensitive partial match)
    const nameMatch = item.name.toLowerCase().includes(lowerTerm);
    
    // Check tags (case-insensitive exact match)
    const tagMatch = item.tags.some(tag => 
      tag.toLowerCase() === lowerTerm
    );
    
    return nameMatch || tagMatch;
  });
}

/**
 * Filter items based on search terms using OR logic
 */
export function filterItemsBySearch(items: Item[], searchInput: string): Item[] {
  const searchTerms = parseSearchTerms(searchInput);
  
  if (searchTerms.length === 0) return items;
  
  return items.filter(item => itemMatchesSearch(item, searchTerms));
}
