import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ListDetailPage } from '../pages/ListDetailPage';

/**
 * Test data factory and utilities for creating and managing test data
 */

// Test data prefix to identify test data
const TEST_DATA_PREFIX = process.env.TEST_DATA_PREFIX || 'e2e_test_';

/**
 * Test data factory for creating test shopping lists and items
 */
export class TestDataFactory {
  /**
   * Create a test shopping list object
   */
  static createShoppingList(name: string, items: string[] = []) {
    const testName = `${TEST_DATA_PREFIX}${name}`;
    return {
      name: testName,
      items: items.map(item => ({
        name: `${TEST_DATA_PREFIX}${item}`,
        collected: false,
        quantity: 1,
        category: 'general'
      }))
    };
  }

  /**
   * Create a test shopping list with collected items
   */
  static createShoppingListWithCollectedItems(name: string, items: string[], collectedItems: string[] = []) {
    const testName = `${TEST_DATA_PREFIX}${name}`;
    return {
      name: testName,
      items: items.map(item => ({
        name: `${TEST_DATA_PREFIX}${item}`,
        collected: collectedItems.includes(item),
        quantity: 1,
        category: 'general'
      }))
    };
  }

  /**
   * Create a test shopping list with quantities
   */
  static createShoppingListWithQuantities(name: string, items: Array<{name: string, quantity: number}>) {
    const testName = `${TEST_DATA_PREFIX}${name}`;
    return {
      name: testName,
      items: items.map(item => ({
        name: `${TEST_DATA_PREFIX}${item.name}`,
        collected: false,
        quantity: item.quantity,
        category: 'general'
      }))
    };
  }

  /**
   * Create a test shopping list with categories
   */
  static createShoppingListWithCategories(name: string, items: Array<{name: string, category: string}>) {
    const testName = `${TEST_DATA_PREFIX}${name}`;
    return {
      name: testName,
      items: items.map(item => ({
        name: `${TEST_DATA_PREFIX}${item.name}`,
        collected: false,
        quantity: 1,
        category: item.category
      }))
    };
  }

  /**
   * Generate a unique test name with timestamp
   */
  static generateUniqueTestName(baseName: string) {
    const timestamp = Date.now();
    return `${TEST_DATA_PREFIX}${baseName}_${timestamp}`;
  }

  /**
   * Create multiple test shopping lists
   */
  static createMultipleShoppingLists(count: number, baseName: string = 'list') {
    return Array.from({ length: count }, (_, index) => 
      this.createShoppingList(`${baseName}_${index + 1}`, [`item_${index + 1}_1`, `item_${index + 1}_2`])
    );
  }

  /**
   * Create a large shopping list for performance testing
   */
  static createLargeShoppingList(name: string, itemCount: number = 100) {
    const testName = `${TEST_DATA_PREFIX}${name}`;
    const items = Array.from({ length: itemCount }, (_, index) => ({
      name: `${TEST_DATA_PREFIX}item_${index + 1}`,
      collected: Math.random() > 0.5, // Randomly collect some items
      quantity: Math.floor(Math.random() * 5) + 1, // Random quantity 1-5
      category: ['general', 'food', 'household', 'personal'][Math.floor(Math.random() * 4)]
    }));

    return {
      name: testName,
      items
    };
  }
}

/**
 * Test data utilities for managing test data in the application
 */
export class TestDataUtils {
  /**
   * Create a shopping list through the UI
   */
  static async createShoppingListThroughUI(page: Page, listName: string, items: string[] = []) {
    const homePage = new HomePage(page);
    await homePage.goto();
    
    // Click create list button (this would open a dialog or navigate to create page)
    await homePage.clickCreateList();
    
    // Fill in list name and items
    // Note: This would need to be implemented based on the actual UI flow
    // For now, we'll assume there's a form or dialog to fill
    
    // Return the created list ID or name for further use
    return `${TEST_DATA_PREFIX}${listName}`;
  }

  /**
   * Add items to a shopping list through the UI
   */
  static async addItemsToListThroughUI(page: Page, listId: string, items: string[]) {
    const listDetailPage = new ListDetailPage(page);
    await listDetailPage.goto(listId);
    
    for (const item of items) {
      await listDetailPage.addItem(`${TEST_DATA_PREFIX}${item}`);
    }
  }

  /**
   * Check items in a shopping list through the UI
   */
  static async checkItemsInListThroughUI(page: Page, listId: string, itemsToCheck: string[]) {
    const listDetailPage = new ListDetailPage(page);
    await listDetailPage.goto(listId);
    
    for (const item of itemsToCheck) {
      await listDetailPage.checkItem(`${TEST_DATA_PREFIX}${item}`);
    }
  }

  /**
   * Delete a shopping list through the UI
   */
  static async deleteShoppingListThroughUI(page: Page, listId: string) {
    const listDetailPage = new ListDetailPage(page);
    await listDetailPage.goto(listId);
    await listDetailPage.deleteList();
  }

  /**
   * Get all test shopping lists from the home page
   */
  static async getTestShoppingLists(page: Page) {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForListsToLoad();
    
    const allNames = await homePage.getShoppingListNames();
    return allNames.filter(name => name.startsWith(TEST_DATA_PREFIX));
  }

  /**
   * Get all test items from a shopping list
   */
  static async getTestItemsFromList(page: Page, listId: string) {
    const listDetailPage = new ListDetailPage(page);
    await listDetailPage.goto(listId);
    await listDetailPage.waitForListToLoad();
    
    const allNames = await listDetailPage.getItemNames();
    return allNames.filter(name => name.startsWith(TEST_DATA_PREFIX));
  }

  /**
   * Clean up all test shopping lists
   */
  static async cleanupAllTestShoppingLists(page: Page) {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForListsToLoad();
    
    const testListNames = await this.getTestShoppingLists(page);
    
    for (const listName of testListNames) {
      try {
        // Find the list card and delete it
        const listCard = homePage.getShoppingListCard(listName);
        if (await listCard.isVisible()) {
          await listCard.clickDelete();
          
          // Handle delete confirmation dialog if it appears
          const deleteDialog = page.locator('[role="dialog"]:has-text("delete")');
          if (await deleteDialog.isVisible()) {
            await deleteDialog.getByRole('button', { name: /confirm|delete|yes/i }).click();
          }
        }
      } catch (error) {
        console.warn(`Failed to delete test list "${listName}":`, error);
      }
    }
  }

  /**
   * Clean up test items from a specific list
   */
  static async cleanupTestItemsFromList(page: Page, listId: string) {
    const listDetailPage = new ListDetailPage(page);
    await listDetailPage.goto(listId);
    await listDetailPage.waitForListToLoad();
    
    const testItemNames = await this.getTestItemsFromList(page, listId);
    
    for (const itemName of testItemNames) {
      try {
        await listDetailPage.deleteItem(itemName);
      } catch (error) {
        console.warn(`Failed to delete test item "${itemName}":`, error);
      }
    }
  }

  /**
   * Verify test data cleanup
   */
  static async verifyTestDataCleanup(page: Page) {
    const testLists = await this.getTestShoppingLists(page);
    if (testLists.length > 0) {
      throw new Error(`Test data cleanup failed. Found ${testLists.length} remaining test lists: ${testLists.join(', ')}`);
    }
  }

  /**
   * Wait for test data to be created
   */
  static async waitForTestDataCreation(page: Page, expectedListName: string, timeout: number = 10000) {
    const homePage = new HomePage(page);
    await homePage.goto();
    
    await page.waitForFunction(
      (listName) => {
        const cards = document.querySelectorAll('[data-testid^="shopping-list-card"], .MuiCard-root');
        return Array.from(cards).some(card => card.textContent?.includes(listName));
      },
      `${TEST_DATA_PREFIX}${expectedListName}`,
      { timeout }
    );
  }

  /**
   * Wait for test data to be deleted
   */
  static async waitForTestDataDeletion(page: Page, listName: string, timeout: number = 10000) {
    const homePage = new HomePage(page);
    await homePage.goto();
    
    await page.waitForFunction(
      (listName) => {
        const cards = document.querySelectorAll('[data-testid^="shopping-list-card"], .MuiCard-root');
        return !Array.from(cards).some(card => card.textContent?.includes(listName));
      },
      `${TEST_DATA_PREFIX}${listName}`,
      { timeout }
    );
  }
}

/**
 * Test data constants
 */
export const TEST_DATA_CONSTANTS = {
  PREFIX: TEST_DATA_PREFIX,
  COMMON_ITEMS: [
    'milk',
    'bread',
    'eggs',
    'butter',
    'cheese',
    'apples',
    'bananas',
    'chicken',
    'rice',
    'pasta'
  ],
  COMMON_CATEGORIES: [
    'general',
    'food',
    'household',
    'personal',
    'health',
    'cleaning'
  ],
  COMMON_LIST_NAMES: [
    'grocery_list',
    'weekly_shopping',
    'party_supplies',
    'home_improvement',
    'work_supplies'
  ]
};

/**
 * Helper function to create test data with common patterns
 */
export function createCommonTestData() {
  return {
    simpleList: TestDataFactory.createShoppingList('simple_list', ['milk', 'bread']),
    listWithCollectedItems: TestDataFactory.createShoppingListWithCollectedItems(
      'list_with_collected', 
      ['milk', 'bread', 'eggs'], 
      ['milk', 'bread']
    ),
    listWithQuantities: TestDataFactory.createShoppingListWithQuantities(
      'list_with_quantities',
      [
        { name: 'milk', quantity: 2 },
        { name: 'bread', quantity: 1 },
        { name: 'eggs', quantity: 12 }
      ]
    ),
    listWithCategories: TestDataFactory.createShoppingListWithCategories(
      'list_with_categories',
      [
        { name: 'milk', category: 'dairy' },
        { name: 'bread', category: 'bakery' },
        { name: 'apples', category: 'produce' }
      ]
    ),
    largeList: TestDataFactory.createLargeShoppingList('large_list', 50),
    multipleLists: TestDataFactory.createMultipleShoppingLists(3, 'test_list')
  };
}

/**
 * Export test data factory and utilities
 * Note: Classes are already exported above, this is just for clarity
 */
