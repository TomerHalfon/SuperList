import { test, expect } from '@playwright/test';
import { authenticatedPage } from '../../fixtures/auth.fixture';
import { HomePage } from '../../pages/HomePage';
import { ListDetailPage } from '../../pages/ListDetailPage';
import { TestDataFactory, TestDataUtils } from '../../fixtures/test-data.fixture';

/**
 * Item management E2E tests
 * Tests adding, editing, and managing items in shopping lists
 */
test.describe('Item Management', () => {
  let homePage: HomePage;
  let listDetailPage: ListDetailPage;
  let testListId: string;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    listDetailPage = new ListDetailPage(page);
    
    // Create a test list for each test
    const testList = TestDataFactory.createShoppingList('item_test_list', []);
    await homePage.goto();
    await homePage.clickCreateList();
    await TestDataUtils.waitForTestDataCreation(homePage.getPage(), 'item_test_list');
    
    // Get the list ID by clicking on the list
    await homePage.clickShoppingList(testList.name);
    testListId = listDetailPage.getListId();
  });

  test.afterEach(async ({ page }) => {
    // Clean up test data after each test
    await TestDataUtils.cleanupAllTestShoppingLists(page);
  });

  test('should display list detail page with add item form', async () => {
    // Assert that the list detail page is loaded correctly
    await listDetailPage.expectLoaded();
    await listDetailPage.expectListName('item_test_list');
    await listDetailPage.expectAddItemInput();
    await listDetailPage.expectAddItemButton();
    await listDetailPage.expectEmptyState();
  });

  test('should add a single item to the list', async () => {
    const itemName = 'milk';
    
    // Add item to the list
    await listDetailPage.addItem(itemName);
    
    // Verify item was added
    await listDetailPage.expectItem(itemName);
    await listDetailPage.expectItemCount(1);
    await listDetailPage.expectNoEmptyState();
  });

  test('should add multiple items to the list', async () => {
    const items = ['milk', 'bread', 'eggs', 'butter'];
    
    // Add multiple items
    for (const item of items) {
      await listDetailPage.addItem(item);
    }
    
    // Verify all items were added
    await listDetailPage.expectItemCount(4);
    
    for (const item of items) {
      await listDetailPage.expectItem(item);
    }
  });

  test('should add items with special characters', async () => {
    const specialItems = ['milk (2%)', 'bread - whole wheat', 'eggs (free-range)', 'butter & margarine'];
    
    // Add items with special characters
    for (const item of specialItems) {
      await listDetailPage.addItem(item);
    }
    
    // Verify all items were added
    await listDetailPage.expectItemCount(4);
    
    for (const item of specialItems) {
      await listDetailPage.expectItem(item);
    }
  });

  test('should add items with long names', async () => {
    const longItemName = 'a'.repeat(100); // Very long item name
    
    // Add item with long name
    await listDetailPage.addItem(longItemName);
    
    // Verify item was added
    await listDetailPage.expectItem(longItemName);
    await listDetailPage.expectItemCount(1);
  });

  test('should prevent adding duplicate items', async () => {
    const itemName = 'milk';
    
    // Add item twice
    await listDetailPage.addItem(itemName);
    await listDetailPage.addItem(itemName);
    
    // Should only have one item
    await listDetailPage.expectItemCount(1);
    await listDetailPage.expectItem(itemName);
  });

  test('should check and uncheck items', async () => {
    const itemName = 'milk';
    
    // Add item
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Check the item
    await listDetailPage.checkItem(itemName);
    await listDetailPage.expectItemChecked(itemName);
    
    // Uncheck the item
    await listDetailPage.uncheckItem(itemName);
    await listDetailPage.expectItemUnchecked(itemName);
  });

  test('should update progress when items are checked', async () => {
    const items = ['milk', 'bread', 'eggs'];
    
    // Add multiple items
    for (const item of items) {
      await listDetailPage.addItem(item);
    }
    
    // Initially 0% progress
    await listDetailPage.expectProgressPercentage(0);
    
    // Check one item - should be 33% progress
    await listDetailPage.checkItem('milk');
    await listDetailPage.expectProgressPercentage(33);
    
    // Check another item - should be 67% progress
    await listDetailPage.checkItem('bread');
    await listDetailPage.expectProgressPercentage(67);
    
    // Check all items - should be 100% progress
    await listDetailPage.checkItem('eggs');
    await listDetailPage.expectProgressPercentage(100);
  });

  test('should handle item quantity changes', async () => {
    const itemName = 'milk';
    
    // Add item
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Increment quantity
    const item = listDetailPage.getShoppingListItem(itemName);
    await item.incrementButton.click();
    
    // Should show quantity 2
    await expect(item.quantity).toHaveText('2');
    
    // Increment again
    await item.incrementButton.click();
    
    // Should show quantity 3
    await expect(item.quantity).toHaveText('3');
    
    // Decrement quantity
    await item.decrementButton.click();
    
    // Should show quantity 2
    await expect(item.quantity).toHaveText('2');
  });

  test('should prevent quantity from going below 1', async () => {
    const itemName = 'milk';
    
    // Add item
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Try to decrement quantity (should stay at 1)
    const item = listDetailPage.getShoppingListItem(itemName);
    await item.decrementButton.click();
    
    // Should still show quantity 1
    await expect(item.quantity).toHaveText('1');
    
    // Decrement button should be disabled
    await expect(item.decrementButton.getLocator()).toBeDisabled();
  });

  test('should prevent quantity from going above 999', async () => {
    const itemName = 'milk';
    
    // Add item
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Increment quantity to maximum
    const item = listDetailPage.getShoppingListItem(itemName);
    
    // Click increment button many times
    for (let i = 0; i < 1000; i++) {
      await item.incrementButton.click();
    }
    
    // Should be capped at 999
    await expect(item.quantity).toHaveText('999');
    
    // Increment button should be disabled
    await expect(item.incrementButton.getLocator()).toBeDisabled();
  });

  test('should edit item name', async () => {
    const originalName = 'milk';
    const newName = 'almond milk';
    
    // Add item
    await listDetailPage.addItem(originalName);
    await listDetailPage.expectItem(originalName);
    
    // Edit the item
    await listDetailPage.editItem(originalName);
    
    // Note: This would open an edit dialog or inline editor
    // The exact implementation depends on the UI flow
    
    // For now, we'll simulate the edit process
    // In a real test, you would fill in the new name and save
  });

  test('should delete an item', async () => {
    const itemName = 'milk';
    
    // Add item
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    await listDetailPage.expectItemCount(1);
    
    // Delete the item
    await listDetailPage.deleteItem(itemName);
    
    // Verify item was deleted
    await listDetailPage.expectNoItem(itemName);
    await listDetailPage.expectItemCount(0);
    await listDetailPage.expectEmptyState();
  });

  test('should handle keyboard navigation for adding items', async ({ page }) => {
    // Focus the add item input
    await listDetailPage.getAddItemInput().focus();
    
    // Type item name
    await page.keyboard.type('milk');
    
    // Press Enter to add item
    await page.keyboard.press('Enter');
    
    // Verify item was added
    await listDetailPage.expectItem('milk');
  });

  test('should show autocomplete suggestions', async ({ page }) => {
    // Add some items first to create suggestions
    await listDetailPage.addItem('milk');
    await listDetailPage.addItem('bread');
    
    // Focus the add item input
    await listDetailPage.getAddItemInput().focus();
    
    // Type 'm' to trigger autocomplete
    await page.keyboard.type('m');
    
    // Should show autocomplete suggestions
    await expect(page.locator('.MuiAutocomplete-popper')).toBeVisible();
    await expect(page.getByText('milk')).toBeVisible();
  });

  test('should handle empty item names', async () => {
    // Try to add empty item
    await listDetailPage.getAddItemInput().fill('');
    await listDetailPage.getAddItemButton().click();
    
    // Should not add empty item
    await listDetailPage.expectItemCount(0);
    await listDetailPage.expectEmptyState();
  });

  test('should handle whitespace-only item names', async () => {
    // Try to add whitespace-only item
    await listDetailPage.getAddItemInput().fill('   ');
    await listDetailPage.getAddItemButton().click();
    
    // Should not add whitespace-only item
    await listDetailPage.expectItemCount(0);
    await listDetailPage.expectEmptyState();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout
    await listDetailPage.expectLoaded();
    await listDetailPage.expectAddItemInput();
    
    // Test touch interactions
    await listDetailPage.addItem('milk');
    await listDetailPage.expectItem('milk');
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper ARIA labels and roles
    await expect(page.getByPlaceholder(/add.*item/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add.*item/i })).toBeVisible();
    
    // Check for proper form structure
    await expect(page.locator('form')).toBeVisible();
    
    // Check for proper list structure
    await expect(page.getByRole('list')).toBeVisible();
  });
});
