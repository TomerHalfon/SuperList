import { Item } from '@/types/shopping-list';
import { AutocompleteOption } from '@/components/ui/Autocomplete';

/**
 * Generate search suggestions from items and their tags
 */
export function generateSearchSuggestions(items: Item[]): AutocompleteOption[] {
  const suggestions: AutocompleteOption[] = [];
  const seenLabels = new Set<string>();

  // Add item names with emojis
  items.forEach(item => {
    if (!seenLabels.has(item.name.toLowerCase())) {
      suggestions.push({
        label: item.name,
        value: item.name,
        type: 'item',
        emoji: item.emoji,
      });
      seenLabels.add(item.name.toLowerCase());
    }
  });

  // Add unique tags
  const allTags = new Set<string>();
  items.forEach(item => {
    item.tags.forEach(tag => {
      allTags.add(tag);
    });
  });

  allTags.forEach(tag => {
    if (!seenLabels.has(tag.toLowerCase())) {
      suggestions.push({
        label: tag,
        value: tag,
        type: 'tag',
      });
      seenLabels.add(tag.toLowerCase());
    }
  });

  return suggestions.sort((a, b) => {
    // Sort items first, then tags
    if (a.type !== b.type) {
      return a.type === 'item' ? -1 : 1;
    }
    // Then sort alphabetically
    return a.label.localeCompare(b.label);
  });
}

/**
 * Filter suggestions based on current input
 */
export function filterSuggestions(
  suggestions: AutocompleteOption[], 
  inputValue: string
): AutocompleteOption[] {
  if (!inputValue.trim()) return suggestions;

  const searchTerms = inputValue.toLowerCase().split(',').map(term => term.trim());
  const lastTerm = searchTerms[searchTerms.length - 1].toLowerCase();

  if (!lastTerm) return suggestions;

  return suggestions.filter(suggestion => 
    suggestion.label.toLowerCase().includes(lastTerm)
  );
}
