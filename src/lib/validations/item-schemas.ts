import { z } from 'zod';

// Base item schema
export const itemSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  emoji: z.string().min(1, 'Emoji is required').max(10, 'Emoji too long'),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).max(20, 'Too many tags'),
});

// Create item schema (without ID)
export const createItemSchema = itemSchema.omit({ id: true });

// Update item schema (all fields optional except ID)
export const updateItemSchema = itemSchema.partial().omit({ id: true });

// Shopping list item schema
export const shoppingListItemSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(999, 'Quantity too high'),
  collected: z.boolean(),
});

// Items data container schema
export const itemsDataSchema = z.object({
  items: z.array(itemSchema),
});

// Validation helpers
export function validateItem(data: unknown) {
  return itemSchema.parse(data);
}

export function validateCreateItem(data: unknown) {
  return createItemSchema.parse(data);
}

export function validateUpdateItem(data: unknown) {
  return updateItemSchema.parse(data);
}

export function validateShoppingListItem(data: unknown) {
  return shoppingListItemSchema.parse(data);
}

export function validateItemsData(data: unknown) {
  return itemsDataSchema.parse(data);
}

// Type exports
export type ItemInput = z.infer<typeof itemSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ShoppingListItemInput = z.infer<typeof shoppingListItemSchema>;
export type ItemsDataInput = z.infer<typeof itemsDataSchema>;
