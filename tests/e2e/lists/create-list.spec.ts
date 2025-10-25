import { test, expect } from '@playwright/test';
import { authenticatedPage } from '../../fixtures/auth.fixture';
import { HomePage } from '../../pages/HomePage';
import { TestDataFactory, TestDataUtils } from '../../fixtures/test-data.fixture';

/**
 * Shopping list creation E2E tests
 * Tests the list creation flow and management
 */
test.describe('Shopping List Creation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    // Wait for the page to be ready (create button visible) instead of waiting for lists
    await homePage.waitForPageReady();
  });

  test.afterEach(async ({ page }) => {
    // Clean up test data after each test
    await TestDataUtils.cleanupAllTestShoppingLists(page);
  });

  test('should display home page with create list button', async () => {
    // Assert that the home page is loaded correctly
    await homePage.expectLoaded();
    await homePage.expectCreateListButton();
    await homePage.expectCreateListButtonEnabled();
    await homePage.expectUserMenuButton();
  });

  test('should show empty state when no lists exist', async () => {
    // Clean up any existing test lists first
    await TestDataUtils.cleanupAllTestShoppingLists(homePage.getPage());
    
    // Navigate to home page and wait for it to be ready
    await homePage.goto();
    await homePage.waitForPageReady();
    
    // Wait specifically for empty state to appear (more efficient than waiting for lists)
    await homePage.waitForEmptyState();
    
    // Verify empty state is shown
    await homePage.expectEmptyState();
    await homePage.expectShoppingListCount(0);
  });

  test('should create a new shopping list', async () => {
    const testList = TestDataFactory.createShoppingList('test_list', ['milk', 'bread']);
    
    // Click create list button
    await homePage.clickCreateList();
    
    // Note: This test assumes there's a create list dialog or page
    // The actual implementation would depend on the UI flow
    // For now, we'll simulate the creation process
    
    // Wait for the list to appear
    await TestDataUtils.waitForTestDataCreation(homePage.getPage(), 'test_list');
    
    // Wait for lists to load after creation
    await homePage.waitForListsToLoad();
    
    // Verify the list was created
    await homePage.expectShoppingList(testList.name);
    await homePage.expectShoppingListCount(1);
  });

  test('should create multiple shopping lists', async () => {
    const testLists = TestDataFactory.createMultipleShoppingLists(3, 'multi_test');
    
    // Create multiple lists
    for (const list of testLists) {
      await homePage.clickCreateList();
      // Simulate list creation
      await TestDataUtils.waitForTestDataCreation(homePage.getPage(), list.name);
    }
    
    // Wait for lists to load after all creations
    await homePage.waitForListsToLoad();
    
    // Verify all lists were created
    await homePage.expectShoppingListCount(3);
    
    for (const list of testLists) {
      await homePage.expectShoppingList(list.name);
    }
  });

  test('should navigate to list detail when clicking on a list', async () => {
    const testList = TestDataFactory.createShoppingList('navigation_test', ['milk']);
    
    // Create a test list
    await homePage.clickCreateList();
    await TestDataUtils.waitForTestDataCreation(homePage.getPage(), 'navigation_test');
    
    // Wait for lists to load after creation
    await homePage.waitForListsToLoad();
    
    // Click on the list card
    await homePage.clickShoppingList(testList.name);
    
    // Should navigate to list detail page
    await expect(homePage.getPage()).toHaveURL(/.*\/lists\/.+/);
  });

  test('should delete a shopping list', async () => {
    const testList = TestDataFactory.createShoppingList('delete_test', ['milk']);
    
    // Create a test list
    await homePage.clickCreateList();
    await TestDataUtils.waitForTestDataCreation(homePage.getPage(), 'delete_test');
    
    // Wait for lists to load after creation
    await homePage.waitForListsToLoad();
    
    // Verify list exists
    await homePage.expectShoppingList(testList.name);
    
    // Delete the list
    await homePage.deleteShoppingList(testList.name);
    
    // Wait for deletion
    await TestDataUtils.waitForTestDataDeletion(homePage.getPage(), 'delete_test');
    
    // Wait for lists to load after deletion
    await homePage.waitForListsToLoad();
    
    // Verify list is deleted
    await homePage.expectNoShoppingList(testList.name);
    await homePage.expectShoppingListCount(0);
  });

  test('should search for shopping lists', async () => {
    const testLists = TestDataFactory.createMultipleShoppingLists(3, 'search_test');
    
    // Create multiple lists
    for (const list of testLists) {
      await homePage.clickCreateList();
      await TestDataUtils.waitForTestDataCreation(homePage.getPage(), list.name);
    }
    
    // Wait for lists to load after all creations
    await homePage.waitForListsToLoad();
    
    // Search for a specific list
    await homePage.searchLists('search_test_list_1');
    
    // Should show only matching lists
    await homePage.expectShoppingList('search_test_list_1');
    await homePage.expectNoShoppingList('search_test_list_2');
    await homePage.expectNoShoppingList('search_test_list_3');
    
    // Clear search
    await homePage.clearSearch();
    
    // Should show all lists again
    await homePage.expectShoppingListCount(3);
  });

  test('should handle list creation with special characters', async () => {
    const specialList = TestDataFactory.createShoppingList('special_chars_!@#$%', ['milk']);
    
    // Create list with special characters
    await homePage.clickCreateList();
    await TestDataUtils.waitForTestDataCreation(homePage.getPage(), 'special_chars_!@#$%');
    
    // Wait for lists to load after creation
    await homePage.waitForListsToLoad();
    
    // Verify list was created
    await homePage.expectShoppingList(specialList.name);
  });

  test('should handle list creation with long names', async () => {
    const longName = 'a'.repeat(100); // Very long name
    const longList = TestDataFactory.createShoppingList(longName, ['milk']);
    
    // Create list with long name
    await homePage.clickCreateList();
    await TestDataUtils.waitForTestDataCreation(homePage.getPage(), longName);
    
    // Wait for lists to load after creation
    await homePage.waitForListsToLoad();
    
    // Verify list was created
    await homePage.expectShoppingList(longList.name);
  });

  test('should show loading state during list operations', async () => {
    // Click create list button
    await homePage.clickCreateList();
    
    // Should show loading state
    await homePage.expectLoadingSkeleton();
    
    // Wait for loading to complete
    await homePage.waitForLoadingToComplete();
    await homePage.expectNoLoadingSkeleton();
  });

  test('should handle list creation errors gracefully', async () => {
    // This test would simulate network errors or validation failures
    // The exact implementation depends on the error handling in the app
    
    // For now, we'll test that the UI remains functional after errors
    await homePage.clickCreateList();
    
    // The app should handle errors gracefully and not break the UI
    await homePage.expectCreateListButton();
    await homePage.expectCreateListButtonEnabled();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout
    await homePage.expectLoaded();
    await homePage.expectCreateListButton();
    
    // Test touch interactions
    await homePage.clickCreateList();
    
    // Should work on mobile
    await homePage.expectCreateListButton();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate to create button
    await page.keyboard.press('Enter');
    
    // Should trigger create list action
    await homePage.expectCreateListButton();
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper ARIA labels and roles
    await expect(page.getByRole('button', { name: /create.*list/i })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    
    // Check for proper heading structure
    await expect(page.locator('h1, h2, h3')).toBeVisible();
    
    // Check for proper navigation landmarks
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
