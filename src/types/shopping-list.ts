export interface Item {
  id: string;
  name: string;
  emoji: string;
  tags: string[];
}

export interface ShoppingListItem {
  itemId: string;
  quantity: number;
  collected: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  updatedAt: string;
  items: ShoppingListItem[];
  deletedAt?: string;
}

export interface ItemsData {
  items: Item[];
}

export interface ShoppingListsData {
  lists: ShoppingList[];
}
