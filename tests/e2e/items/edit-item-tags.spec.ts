import { test, expect } from '@playwright/test';
import { authenticatedPage } from '../../fixtures/auth.fixture';
import { HomePage } from '../../pages/HomePage';
import { ListDetailPage } from '../../pages/ListDetailPage';
import { TestDataFactory, TestDataUtils } from '../../fixtures/test-data.fixture';

/**
 * Item Tag Management E2E tests
 * Tests adding, editing, and managing tags on items in shopping lists
 * 
 * Note: These tests are designed to fail initially due to a bug where
 * new tags typed in freeSolo mode create chips with empty/undefined labels
 */
test.describe('Item Tag Management', () => {
  let homePage: HomePage;
  let listDetailPage: ListDetailPage;
  let testListId: string;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    listDetailPage = new ListDetailPage(page);
    
    // Create a test list for each test
    const testList = TestDataFactory.createShoppingList('tag_test_list', []);
    await homePage.goto();
    await homePage.clickCreateList();
    await TestDataUtils.waitForTestDataCreation(homePage.getPage(), 'tag_test_list');
    
    // Get the list ID by clicking on the list
    await homePage.clickShoppingList(testList.name);
    testListId = listDetailPage.getListId();
  });

  test.afterEach(async ({ page }) => {
    // Clean up test data after each test
    await TestDataUtils.cleanupAllTestShoppingLists(page);
  });

  test('should add a new tag to an item using freeSolo input', async () => {
    const itemName = 'milk';
    const newTag = 'dairy';
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Open the Edit Item Quantity Dialog
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    
    // Verify dialog is open and shows the correct item
    await dialog.expectOpen();
    await dialog.expectItemName(itemName);
    
    // Toggle advanced settings to show tags section
    await dialog.toggleAdvancedSettings();
    await dialog.expectAdvancedSettingsVisible();
    
    // Initially no tags should be present
    await dialog.expectTagChipCount(0);
    
    // Type a new tag name in the autocomplete
    await dialog.addNewTag(newTag);
    
    // BUG: This will fail because the tag chip shows empty/undefined label
    // Expected: Tag chip appears with "dairy" label
    // Current behavior: Empty chip appears or tag shows as undefined
    await dialog.expectTagChip(newTag);
    await dialog.expectTagChipCount(1);
    
    // Save the changes
    await dialog.save();
    await dialog.expectClosed();
    
    // Reopen the dialog to verify persistence
    await listDetailPage.openEditItemDialog(itemName);
    await dialog.waitForOpen();
    await dialog.toggleAdvancedSettings();
    
    // BUG: This will fail because the tag is not properly saved
    // Expected: Tag "dairy" is persisted and visible
    // Current behavior: Tag is not saved or shows empty
    await dialog.expectTagChip(newTag);
    await dialog.expectTagChipCount(1);
    
    await dialog.cancel();
  });

  test('should add multiple new tags to an item', async () => {
    const itemName = 'bread';
    const newTags = ['bakery', 'whole-grain', 'organic'];
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Open the Edit Item Quantity Dialog
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    
    // Toggle advanced settings
    await dialog.toggleAdvancedSettings();
    await dialog.expectAdvancedSettingsVisible();
    
    // Add multiple new tags
    await dialog.addMultipleNewTags(newTags);
    
    // BUG: This will fail because tag chips show empty/undefined labels
    // Expected: All tag chips show correct labels
    // Current behavior: Chips show empty or undefined labels
    await dialog.expectTagChipCount(3);
    await dialog.expectTagChipLabels(newTags);
    
    // Save the changes
    await dialog.save();
    await dialog.expectClosed();
    
    // Reopen to verify persistence
    await listDetailPage.openEditItemDialog(itemName);
    await dialog.waitForOpen();
    await dialog.toggleAdvancedSettings();
    
    // BUG: This will fail because tags are not properly saved
    // Expected: All tags are persisted
    // Current behavior: Tags are not saved or show empty
    await dialog.expectTagChipCount(3);
    await dialog.expectTagChipLabels(newTags);
    
    await dialog.cancel();
  });

  test('should handle empty tag input gracefully', async () => {
    const itemName = 'eggs';
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Open the Edit Item Quantity Dialog
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    
    // Toggle advanced settings
    await dialog.toggleAdvancedSettings();
    await dialog.expectAdvancedSettingsVisible();
    
    // Try to add an empty tag
    await dialog.getTagsAutocomplete().getInput().fill('');
    await dialog.getTagsAutocomplete().getInput().press('Enter');
    
    // Should not create any tag chips for empty input
    await dialog.expectTagChipCount(0);
    
    // Try to add whitespace-only tag
    await dialog.getTagsAutocomplete().getInput().fill('   ');
    await dialog.getTagsAutocomplete().getInput().press('Enter');
    
    // Should not create any tag chips for whitespace-only input
    await dialog.expectTagChipCount(0);
    
    await dialog.cancel();
  });

  test('should remove tags from an item', async () => {
    const itemName = 'butter';
    const tags = ['dairy', 'refrigerated'];
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Add tags to the item (this will fail due to the bug, but we'll continue)
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    await dialog.toggleAdvancedSettings();
    
    // Add tags (these will show as empty due to the bug)
    await dialog.addMultipleNewTags(tags);
    await dialog.save();
    
    // Reopen dialog
    await listDetailPage.openEditItemDialog(itemName);
    await dialog.waitForOpen();
    await dialog.toggleAdvancedSettings();
    
    // Remove one tag
    await dialog.removeTag(tags[0]);
    
    // Should have one less tag
    await dialog.expectTagChipCount(1);
    
    // Remove remaining tag
    await dialog.removeTag(tags[1]);
    
    // Should have no tags
    await dialog.expectTagChipCount(0);
    
    await dialog.save();
  });

  test('should clear all tags from an item', async () => {
    const itemName = 'cheese';
    const tags = ['dairy', 'refrigerated', 'aged'];
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Add tags to the item
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    await dialog.toggleAdvancedSettings();
    
    // Add multiple tags
    await dialog.addMultipleNewTags(tags);
    await dialog.save();
    
    // Reopen dialog
    await listDetailPage.openEditItemDialog(itemName);
    await dialog.waitForOpen();
    await dialog.toggleAdvancedSettings();
    
    // Clear all tags
    await dialog.clearAllTags();
    
    // Should have no tags
    await dialog.expectTagChipCount(0);
    
    await dialog.save();
  });

  test('should handle tag input with special characters', async () => {
    const itemName = 'olive oil';
    const specialTags = ['extra-virgin', 'cold-pressed', 'organic (certified)', 'mediterranean-style'];
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Open the Edit Item Quantity Dialog
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    
    // Toggle advanced settings
    await dialog.toggleAdvancedSettings();
    await dialog.expectAdvancedSettingsVisible();
    
    // Add tags with special characters
    await dialog.addMultipleNewTags(specialTags);
    
    // BUG: This will fail because tag chips show empty/undefined labels
    // Expected: All tag chips show correct labels including special characters
    // Current behavior: Chips show empty or undefined labels
    await dialog.expectTagChipCount(4);
    await dialog.expectTagChipLabels(specialTags);
    
    await dialog.cancel();
  });

  test('should handle very long tag names', async () => {
    const itemName = 'spices';
    const longTag = 'a'.repeat(50); // Very long tag name
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Open the Edit Item Quantity Dialog
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    
    // Toggle advanced settings
    await dialog.toggleAdvancedSettings();
    await dialog.expectAdvancedSettingsVisible();
    
    // Add a very long tag
    await dialog.addNewTag(longTag);
    
    // BUG: This will fail because tag chips show empty/undefined labels
    // Expected: Tag chip appears with the long tag name
    // Current behavior: Empty chip appears or tag shows as undefined
    await dialog.expectTagChip(longTag);
    await dialog.expectTagChipCount(1);
    
    await dialog.cancel();
  });

  test('should maintain tag state when canceling dialog', async () => {
    const itemName = 'yogurt';
    const tags = ['dairy', 'probiotic'];
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Open the Edit Item Quantity Dialog
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    
    // Toggle advanced settings
    await dialog.toggleAdvancedSettings();
    await dialog.expectAdvancedSettingsVisible();
    
    // Add tags
    await dialog.addMultipleNewTags(tags);
    
    // Cancel the dialog without saving
    await dialog.cancel();
    await dialog.expectClosed();
    
    // Reopen the dialog
    await listDetailPage.openEditItemDialog(itemName);
    await dialog.waitForOpen();
    await dialog.toggleAdvancedSettings();
    
    // Tags should not be present since we canceled
    await dialog.expectTagChipCount(0);
    
    await dialog.cancel();
  });

  test('should handle keyboard navigation in tag input', async ({ page }) => {
    const itemName = 'cereal';
    const tags = ['breakfast', 'whole-grain'];
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Open the Edit Item Quantity Dialog
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    
    // Toggle advanced settings
    await dialog.toggleAdvancedSettings();
    await dialog.expectAdvancedSettingsVisible();
    
    // Focus the tags input
    await dialog.getTagsAutocomplete().getInput().focus();
    
    // Type first tag and press Enter
    await page.keyboard.type(tags[0]);
    await page.keyboard.press('Enter');
    
    // Type second tag and press Enter
    await page.keyboard.type(tags[1]);
    await page.keyboard.press('Enter');
    
    // BUG: This will fail because tag chips show empty/undefined labels
    // Expected: Both tags are added as chips
    // Current behavior: Chips show empty or undefined labels
    await dialog.expectTagChipCount(2);
    await dialog.expectTagChipLabels(tags);
    
    await dialog.cancel();
  });

  test('should be accessible for tag management', async ({ page }) => {
    const itemName = 'pasta';
    
    // Add an item to the list
    await listDetailPage.addItem(itemName);
    await listDetailPage.expectItem(itemName);
    
    // Open the Edit Item Quantity Dialog
    await listDetailPage.openEditItemDialog(itemName);
    const dialog = listDetailPage.getEditItemQuantityDialog();
    await dialog.waitForOpen();
    
    // Toggle advanced settings
    await dialog.toggleAdvancedSettings();
    await dialog.expectAdvancedSettingsVisible();
    
    // Check for proper ARIA labels and roles
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByPlaceholder(/tag/i)).toBeVisible();
    
    // Check for proper form structure
    await expect(page.locator('form')).toBeVisible();
    
    // Check for proper autocomplete structure
    await expect(page.locator('.MuiAutocomplete-root')).toBeVisible();
    
    await dialog.cancel();
  });
});
