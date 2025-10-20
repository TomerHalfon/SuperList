import { ItemsData, ShoppingListsData } from '@/types/shopping-list';

export const mockItems: ItemsData = {
  "items": [
    { "id": "item-1", "name": "Milk", "emoji": "🥛", "tags": ["dairy", "beverages", "breakfast"] },
    { "id": "item-2", "name": "Bread", "emoji": "🍞", "tags": ["bakery", "grains", "breakfast"] },
    { "id": "item-3", "name": "Eggs", "emoji": "🥚", "tags": ["dairy", "protein", "breakfast"] },
    { "id": "item-4", "name": "Chicken Breast", "emoji": "🍗", "tags": ["meat", "protein"] },
    { "id": "item-5", "name": "Rice", "emoji": "🍚", "tags": ["grains", "pantry"] },
    { "id": "item-6", "name": "Tomatoes", "emoji": "🍅", "tags": ["vegetables", "fresh"] },
    { "id": "item-7", "name": "Onions", "emoji": "🧅", "tags": ["vegetables", "fresh"] },
    { "id": "item-8", "name": "Cheese", "emoji": "🧀", "tags": ["dairy", "protein", "breakfast"] },
    { "id": "item-9", "name": "Apples", "emoji": "🍎", "tags": ["fruits", "fresh"] },
    { "id": "item-10", "name": "Bananas", "emoji": "🍌", "tags": ["fruits", "fresh"] },
    { "id": "item-11", "name": "Potatoes", "emoji": "🥔", "tags": ["vegetables", "fresh"] },
    { "id": "item-12", "name": "Pasta", "emoji": "🍝", "tags": ["grains", "pantry"] },
    { "id": "item-13", "name": "Olive Oil", "emoji": "🫒", "tags": ["pantry", "cooking"] },
    { "id": "item-14", "name": "Salt", "emoji": "🧂", "tags": ["pantry", "seasoning"] },
    { "id": "item-15", "name": "Pepper", "emoji": "🫚", "tags": ["pantry", "seasoning"] },
    { "id": "item-16", "name": "Yogurt", "emoji": "🥛", "tags": ["dairy", "snacks"] },
    { "id": "item-17", "name": "Orange Juice", "emoji": "🍊", "tags": ["beverages", "fruits"] },
    { "id": "item-18", "name": "Ground Beef", "emoji": "🥩", "tags": ["meat", "protein"] },
    { "id": "item-19", "name": "Lettuce", "emoji": "🥬", "tags": ["vegetables", "fresh"] },
    { "id": "item-20", "name": "Carrots", "emoji": "🥕", "tags": ["vegetables", "fresh"] },
    { "id": "item-21", "name": "Cereal", "emoji": "🥣", "tags": ["grains", "breakfast"] },
    { "id": "item-22", "name": "Coffee", "emoji": "☕", "tags": ["beverages", "pantry"] },
    { "id": "item-23", "name": "Butter", "emoji": "🧈", "tags": ["dairy", "cooking"] },
    { "id": "item-24", "name": "Sugar", "emoji": "🍯", "tags": ["pantry", "baking"] },
    { "id": "item-25", "name": "Flour", "emoji": "🌾", "tags": ["pantry", "baking"] }
  ]
};

export const mockShoppingLists: ShoppingListsData = {
  "lists": [
    {
      "id": "list-1",
      "name": "Weekly Groceries",
      "updatedAt": "2025-01-20T10:30:00Z",
      "items": [
        { "itemId": "item-1", "quantity": 2, "collected": true },
        { "itemId": "item-2", "quantity": 1, "collected": true },
        { "itemId": "item-3", "quantity": 1, "collected": false },
        { "itemId": "item-6", "quantity": 3, "collected": true },
        { "itemId": "item-7", "quantity": 2, "collected": false }
      ]
    },
    {
      "id": "list-2",
      "name": "Dinner Party Prep",
      "updatedAt": "2025-01-19T15:45:00Z",
      "items": [
        { "itemId": "item-4", "quantity": 2, "collected": true },
        { "itemId": "item-5", "quantity": 1, "collected": true },
        { "itemId": "item-8", "quantity": 1, "collected": true },
        { "itemId": "item-13", "quantity": 1, "collected": true },
        { "itemId": "item-14", "quantity": 1, "collected": true },
        { "itemId": "item-15", "quantity": 1, "collected": true }
      ]
    },
    {
      "id": "list-3",
      "name": "Healthy Breakfast",
      "updatedAt": "2025-01-18T08:20:00Z",
      "items": [
        { "itemId": "item-9", "quantity": 6, "collected": true },
        { "itemId": "item-10", "quantity": 4, "collected": true },
        { "itemId": "item-16", "quantity": 2, "collected": false },
        { "itemId": "item-21", "quantity": 1, "collected": true },
        { "itemId": "item-17", "quantity": 1, "collected": false }
      ]
    },
    {
      "id": "list-4",
      "name": "Pantry Essentials",
      "updatedAt": "2025-01-17T14:10:00Z",
      "items": [
        { "itemId": "item-12", "quantity": 3, "collected": false },
        { "itemId": "item-22", "quantity": 1, "collected": false },
        { "itemId": "item-23", "quantity": 2, "collected": false },
        { "itemId": "item-24", "quantity": 1, "collected": false },
        { "itemId": "item-25", "quantity": 1, "collected": false }
      ]
    },
    {
      "id": "list-5",
      "name": "Fresh Vegetables",
      "updatedAt": "2025-01-16T11:30:00Z",
      "items": [
        { "itemId": "item-11", "quantity": 5, "collected": true },
        { "itemId": "item-19", "quantity": 2, "collected": true },
        { "itemId": "item-20", "quantity": 3, "collected": true },
        { "itemId": "item-6", "quantity": 4, "collected": true },
        { "itemId": "item-7", "quantity": 3, "collected": true }
      ]
    },
    {
      "id": "list-6",
      "name": "BBQ Weekend",
      "updatedAt": "2025-01-15T16:45:00Z",
      "items": [
        { "itemId": "item-18", "quantity": 2, "collected": true },
        { "itemId": "item-4", "quantity": 3, "collected": false },
        { "itemId": "item-6", "quantity": 2, "collected": true },
        { "itemId": "item-19", "quantity": 1, "collected": false },
        { "itemId": "item-8", "quantity": 1, "collected": true }
      ]
    },
    {
      "id": "list-7",
      "name": "Baking Project",
      "updatedAt": "2025-01-14T09:15:00Z",
      "items": [
        { "itemId": "item-25", "quantity": 2, "collected": false },
        { "itemId": "item-24", "quantity": 1, "collected": false },
        { "itemId": "item-23", "quantity": 1, "collected": false },
        { "itemId": "item-3", "quantity": 6, "collected": false },
        { "itemId": "item-9", "quantity": 3, "collected": false }
      ]
    },
    {
      "id": "list-8",
      "name": "Quick Snacks",
      "updatedAt": "2025-01-13T13:20:00Z",
      "items": [
        { "itemId": "item-16", "quantity": 4, "collected": true },
        { "itemId": "item-9", "quantity": 8, "collected": true },
        { "itemId": "item-10", "quantity": 6, "collected": true },
        { "itemId": "item-21", "quantity": 2, "collected": true }
      ]
    }
  ]
};
