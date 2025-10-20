import { ShoppingList, ShoppingListItem, Item } from '@/types/shopping-list';

export function calculateCompletionPercentage(items: ShoppingListItem[]): number {
  if (items.length === 0) return 0;
  
  const collectedCount = items.filter(item => item.collected).length;
  return Math.round((collectedCount / items.length) * 100);
}

export function getItemDetails(itemId: string, items: Item[]): Item | undefined {
  return items.find(item => item.id === itemId);
}

export function getTotalItemsCount(items: ShoppingListItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCollectedItemsCount(items: ShoppingListItem[]): number {
  return items
    .filter(item => item.collected)
    .reduce((total, item) => total + item.quantity, 0);
}
