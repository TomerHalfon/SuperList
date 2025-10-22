import { z } from 'zod';
import { shoppingListItemSchema } from './item-schemas';

/**
 * Create localized schemas
 */
export const createShoppingListSchema = (messages: Record<string, string>) => {
  return z.object({
    id: z.string().min(1, messages.idRequired || 'ID is required'),
    name: z.string().min(1, messages.nameRequired || 'Name is required').max(100, messages.nameTooLong || 'Name too long'),
    updatedAt: z.string().datetime(messages.invalidDateFormat || 'Invalid date format'),
    items: z.array(createShoppingListItemSchema(messages)).max(200, messages.tooManyItems || 'Too many items in list'),
  });
};

export const createCreateShoppingListSchema = (messages: Record<string, string>) => {
  return z.object({
    name: z.string().min(1, messages.nameRequired || 'Name is required').max(100, messages.nameTooLong || 'Name too long'),
  });
};

export const createShoppingListItemSchema = (messages: Record<string, string>) => {
  return z.object({
    itemId: z.string().min(1, messages.itemIdRequired || 'Item ID is required'),
    quantity: z.number().int().min(1, messages.quantityMin || 'Quantity must be at least 1').max(999, messages.quantityMax || 'Quantity too high'),
    collected: z.boolean(),
  });
};

// Base shopping list schema
export const shoppingListSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  updatedAt: z.string().datetime('Invalid date format'),
  items: z.array(shoppingListItemSchema).max(200, 'Too many items in list'),
});

// Create list schema (without ID and updatedAt)
export const createListSchema = shoppingListSchema.omit({ 
  id: true, 
  updatedAt: true 
}).extend({
  items: z.array(shoppingListItemSchema).optional().default([]),
});

// Update list schema (all fields optional except ID)
export const updateListSchema = shoppingListSchema.partial().omit({ 
  id: true,
  updatedAt: true 
});

// Shopping lists data container schema
export const shoppingListsDataSchema = z.object({
  lists: z.array(shoppingListSchema),
});

// List operation schemas
export const addItemToListSchema = z.object({
  listId: z.string().min(1, 'List ID is required'),
  item: shoppingListItemSchema,
});

export const removeItemFromListSchema = z.object({
  listId: z.string().min(1, 'List ID is required'),
  itemId: z.string().min(1, 'Item ID is required'),
});

export const toggleItemCollectedSchema = z.object({
  listId: z.string().min(1, 'List ID is required'),
  itemId: z.string().min(1, 'Item ID is required'),
});

export const updateListItemSchema = z.object({
  listId: z.string().min(1, 'List ID is required'),
  itemId: z.string().min(1, 'Item ID is required'),
  updates: shoppingListItemSchema.partial().omit({ itemId: true }),
});

export const duplicateListSchema = z.object({
  id: z.string().min(1, 'List ID is required'),
  newName: z.string().min(1, 'New name is required').max(100, 'Name too long').optional(),
});

// Validation helpers
export function validateShoppingList(data: unknown) {
  return shoppingListSchema.parse(data);
}

export function validateCreateList(data: unknown) {
  return createListSchema.parse(data);
}

export function validateUpdateList(data: unknown) {
  return updateListSchema.parse(data);
}

export function validateShoppingListsData(data: unknown) {
  return shoppingListsDataSchema.parse(data);
}

export function validateAddItemToList(data: unknown) {
  return addItemToListSchema.parse(data);
}

export function validateRemoveItemFromList(data: unknown) {
  return removeItemFromListSchema.parse(data);
}

export function validateToggleItemCollected(data: unknown) {
  return toggleItemCollectedSchema.parse(data);
}

export function validateUpdateListItem(data: unknown) {
  return updateListItemSchema.parse(data);
}

export function validateDuplicateList(data: unknown) {
  return duplicateListSchema.parse(data);
}

// Type exports
export type ShoppingListInput = z.infer<typeof shoppingListSchema>;
export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type ShoppingListsDataInput = z.infer<typeof shoppingListsDataSchema>;
export type AddItemToListInput = z.infer<typeof addItemToListSchema>;
export type RemoveItemFromListInput = z.infer<typeof removeItemFromListSchema>;
export type ToggleItemCollectedInput = z.infer<typeof toggleItemCollectedSchema>;
export type UpdateListItemInput = z.infer<typeof updateListItemSchema>;
export type DuplicateListInput = z.infer<typeof duplicateListSchema>;
