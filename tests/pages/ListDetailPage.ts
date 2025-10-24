import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Dialog } from '../components/ui/Dialog';

/**
 * Page object model for the List Detail page
 * Represents /lists/[id] route
 */
export class ListDetailPage extends BasePage {
  private addItemInput: TextField;
  private addItemButton: Button;
  private deleteListButton: Button;

  constructor(page: Page) {
    super(page);
    this.addItemInput = new TextField(page.getByPlaceholder(/add.*item/i));
    this.addItemButton = new Button(page.getByRole('button', { name: /add.*item/i }));
    this.deleteListButton = new Button(page.getByTestId('delete-list-button'));
  }

  /**
   * Get the URL path for this page
   */
  getUrl(): string {
    return '/lists/[id]';
  }

  /**
   * Navigate to a specific list detail page
   */
  async goto(listId: string) {
    await super.goto(`/lists/${listId}`);
    await this.waitForLoad();
  }

  /**
   * Get the list name from the page header
   */
  async getListName() {
    const header = this.page.locator('h1, h2, h3, h4, h5, h6').first();
    if (await header.isVisible()) {
      return await header.textContent();
    }
    return null;
  }

  /**
   * Get the list ID from the URL
   */
  getListId() {
    const url = new URL(this.page.url());
    const pathParts = url.pathname.split('/');
    return pathParts[pathParts.length - 1];
  }

  /**
   * Get the add item input field
   */
  getAddItemInput() {
    return this.addItemInput;
  }

  /**
   * Get the add item button
   */
  getAddItemButton() {
    return this.addItemButton;
  }

  /**
   * Get the delete list button
   */
  getDeleteListButton() {
    return this.deleteListButton;
  }

  /**
   * Add an item to the list
   */
  async addItem(itemName: string) {
    await this.addItemInput.fill(itemName);
    await this.addItemButton.click();
  }

  /**
   * Get all shopping list items
   */
  getShoppingListItems() {
    return this.page.locator('[data-testid^="shopping-list-item"], .MuiListItem-root');
  }

  /**
   * Get a specific shopping list item by name
   */
  getShoppingListItem(itemName: string) {
    const item = this.page.locator(`[data-testid="shopping-list-item-${itemName}"], .MuiListItem-root:has-text("${itemName}")`);
    return {
      locator: item,
      checkbox: new Checkbox(item.locator('input[type="checkbox"]')),
      name: item.locator('.item-name, .MuiTypography-root'),
      quantity: item.locator('.item-quantity, .quantity'),
      editButton: new Button(item.locator('[data-testid="edit-item-button"]')),
      deleteButton: new Button(item.locator('[data-testid="delete-item-button"]')),
      incrementButton: new Button(item.locator('[data-testid="increment-quantity-button"], button:has-text("+")')),
      decrementButton: new Button(item.locator('[data-testid="decrement-quantity-button"], button:has-text("-")'))
    };
  }

  /**
   * Get a shopping list item by index
   */
  getShoppingListItemByIndex(index: number) {
    const item = this.getShoppingListItems().nth(index);
    return {
      locator: item,
      checkbox: new Checkbox(item.locator('input[type="checkbox"]')),
      name: item.locator('.item-name, .MuiTypography-root'),
      quantity: item.locator('.item-quantity, .quantity'),
      editButton: new Button(item.locator('[data-testid="edit-item-button"]')),
      deleteButton: new Button(item.locator('[data-testid="delete-item-button"]'))
    };
  }

  /**
   * Get the number of shopping list items
   */
  async getShoppingListItemCount() {
    return await this.getShoppingListItems().count();
  }

  /**
   * Get all item names
   */
  async getItemNames() {
    const items = this.getShoppingListItems();
    const count = await items.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const item = this.getShoppingListItemByIndex(i);
      const name = await item.name.textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    
    return names;
  }

  /**
   * Check if an item exists by name
   */
  async hasItem(itemName: string) {
    const names = await this.getItemNames();
    return names.includes(itemName);
  }

  /**
   * Check an item by name
   */
  async checkItem(itemName: string) {
    const item = this.getShoppingListItem(itemName);
    await item.checkbox.check();
  }

  /**
   * Uncheck an item by name
   */
  async uncheckItem(itemName: string) {
    const item = this.getShoppingListItem(itemName);
    await item.checkbox.uncheck();
  }

  /**
   * Toggle an item's checked state by name
   */
  async toggleItem(itemName: string) {
    const item = this.getShoppingListItem(itemName);
    await item.checkbox.toggle();
  }

  /**
   * Check if an item is checked by name
   */
  async isItemChecked(itemName: string) {
    const item = this.getShoppingListItem(itemName);
    return await item.checkbox.isChecked();
  }

  /**
   * Delete an item by name
   */
  async deleteItem(itemName: string) {
    const item = this.getShoppingListItem(itemName);
    await item.deleteButton.click();
  }

  /**
   * Edit an item by name
   */
  async editItem(itemName: string) {
    const item = this.getShoppingListItem(itemName);
    await item.editButton.click();
  }

  /**
   * Get the progress information
   */
  async getProgressInfo() {
    const progressElement = this.page.locator('.progress-info, .MuiTypography-caption');
    if (await progressElement.isVisible()) {
      return await progressElement.textContent();
    }
    return null;
  }

  /**
   * Get the progress percentage
   */
  async getProgressPercentage() {
    const progressText = await this.getProgressInfo();
    if (progressText) {
      const match = progressText.match(/(\d+)%/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Get the number of checked items
   */
  async getCheckedItemsCount() {
    const checkedItems = this.page.locator('input[type="checkbox"]:checked');
    return await checkedItems.count();
  }

  /**
   * Get the total number of items
   */
  async getTotalItemsCount() {
    return await this.getShoppingListItemCount();
  }

  /**
   * Get the back button
   */
  getBackButton() {
    return this.page.locator('[data-testid="back-button"], button[aria-label*="back"], a[href="/"]');
  }

  /**
   * Click the back button
   */
  async clickBack() {
    await this.getBackButton().click();
  }

  /**
   * Get the edit list button
   */
  getEditListButton() {
    return this.page.locator('[data-testid="edit-list-button"], button[aria-label*="edit"]');
  }

  /**
   * Click the edit list button
   */
  async clickEditList() {
    await this.getEditListButton().click();
  }

  /**
   * Get the delete list dialog
   */
  getDeleteListDialog() {
    const dialog = this.page.locator('[role="dialog"]:has-text("delete"), [role="dialog"]:has-text("Delete")');
    return new Dialog(dialog);
  }

  /**
   * Delete the list (opens dialog and confirms)
   */
  async deleteList() {
    await this.deleteListButton.click();
    const dialog = this.getDeleteListDialog();
    await dialog.expectOpen();
    await dialog.clickConfirm();
  }

  /**
   * Cancel list deletion
   */
  async cancelDeleteList() {
    const dialog = this.getDeleteListDialog();
    await dialog.clickCancel();
  }

  /**
   * Get the empty state message
   */
  getEmptyStateMessage() {
    return this.page.locator('[data-testid="empty-state"], .empty-state, :has-text("No items"), :has-text("Add your first item")');
  }

  /**
   * Check if the empty state is visible
   */
  async hasEmptyState() {
    return await this.getEmptyStateMessage().isVisible();
  }

  /**
   * Get the loading skeleton
   */
  getLoadingSkeleton() {
    return this.page.locator('[data-testid="list-detail-skeleton"], .MuiSkeleton-root');
  }

  /**
   * Check if the loading skeleton is visible
   */
  async hasLoadingSkeleton() {
    return await this.getLoadingSkeleton().isVisible();
  }

  /**
   * Wait for the list to load
   */
  async waitForListToLoad() {
    await this.page.waitForSelector('[data-testid^="shopping-list-item"], [data-testid="empty-state"]', { 
      state: 'visible',
      timeout: 10000 
    });
  }

  /**
   * Wait for the loading skeleton to disappear
   */
  async waitForLoadingToComplete() {
    await this.page.waitForSelector('[data-testid="list-detail-skeleton"], .MuiSkeleton-root', { 
      state: 'hidden',
      timeout: 10000 
    });
  }

  /**
   * Assert that the page is loaded
   */
  async expectLoaded() {
    await this.expectUrl(/.*\/lists\/.+/);
    await this.addItemInput.expectVisible();
  }

  /**
   * Assert that the page has a specific list name
   */
  async expectListName(listName: string) {
    const currentName = await this.getListName();
    if (currentName !== listName) {
      throw new Error(`Expected list name to be "${listName}" but got "${currentName}"`);
    }
  }

  /**
   * Assert that the add item input is visible
   */
  async expectAddItemInput() {
    await this.addItemInput.expectVisible();
  }

  /**
   * Assert that the add item button is visible
   */
  async expectAddItemButton() {
    await this.addItemButton.expectVisible();
  }

  /**
   * Assert that the delete list button is visible
   */
  async expectDeleteListButton() {
    await this.deleteListButton.expectVisible();
  }

  /**
   * Assert that there are a specific number of items
   */
  async expectItemCount(count: number) {
    const currentCount = await this.getShoppingListItemCount();
    if (currentCount !== count) {
      throw new Error(`Expected ${count} items but got ${currentCount}`);
    }
  }

  /**
   * Assert that an item exists
   */
  async expectItem(itemName: string) {
    const exists = await this.hasItem(itemName);
    if (!exists) {
      throw new Error(`Expected item "${itemName}" to exist`);
    }
  }

  /**
   * Assert that an item does not exist
   */
  async expectNoItem(itemName: string) {
    const exists = await this.hasItem(itemName);
    if (exists) {
      throw new Error(`Expected item "${itemName}" to not exist`);
    }
  }

  /**
   * Assert that an item is checked
   */
  async expectItemChecked(itemName: string) {
    const isChecked = await this.isItemChecked(itemName);
    if (!isChecked) {
      throw new Error(`Expected item "${itemName}" to be checked`);
    }
  }

  /**
   * Assert that an item is unchecked
   */
  async expectItemUnchecked(itemName: string) {
    const isChecked = await this.isItemChecked(itemName);
    if (isChecked) {
      throw new Error(`Expected item "${itemName}" to be unchecked`);
    }
  }

  /**
   * Assert that the progress percentage is correct
   */
  async expectProgressPercentage(percentage: number) {
    const currentPercentage = await this.getProgressPercentage();
    if (currentPercentage !== percentage) {
      throw new Error(`Expected progress percentage to be ${percentage}% but got ${currentPercentage}%`);
    }
  }

  /**
   * Assert that the empty state is visible
   */
  async expectEmptyState() {
    const hasEmptyState = await this.hasEmptyState();
    if (!hasEmptyState) {
      throw new Error('Expected empty state to be visible');
    }
  }

  /**
   * Assert that the empty state is not visible
   */
  async expectNoEmptyState() {
    const hasEmptyState = await this.hasEmptyState();
    if (hasEmptyState) {
      throw new Error('Expected empty state to not be visible');
    }
  }

  /**
   * Assert that the loading skeleton is visible
   */
  async expectLoadingSkeleton() {
    const hasSkeleton = await this.hasLoadingSkeleton();
    if (!hasSkeleton) {
      throw new Error('Expected loading skeleton to be visible');
    }
  }

  /**
   * Assert that the loading skeleton is not visible
   */
  async expectNoLoadingSkeleton() {
    const hasSkeleton = await this.hasLoadingSkeleton();
    if (hasSkeleton) {
      throw new Error('Expected loading skeleton to not be visible');
    }
  }

  /**
   * Assert that the back button is visible
   */
  async expectBackButton() {
    await expect(this.getBackButton()).toBeVisible();
  }

  /**
   * Assert that the edit list button is visible
   */
  async expectEditListButton() {
    await expect(this.getEditListButton()).toBeVisible();
  }
}
