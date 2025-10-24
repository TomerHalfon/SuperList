import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ShoppingListCard } from '../components/features/ShoppingListCard';
import { Button } from '../components/ui/Button';

/**
 * Page object model for the Home page
 * Represents the main page with shopping lists grid
 */
export class HomePage extends BasePage {
  private createListButton: Button;

  constructor(page: Page) {
    super(page);
    this.createListButton = new Button(page.getByRole('button', { name: /create.*list/i }));
  }

  /**
   * Get the URL path for this page
   */
  getUrl(): string {
    return '/';
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await super.goto();
    await this.waitForLoad();
  }

  /**
   * Get the page title
   */
  async getPageTitle() {
    return await this.getTitle();
  }

  /**
   * Get the create list button
   */
  getCreateListButton() {
    return this.createListButton;
  }

  /**
   * Click the create list button
   */
  async clickCreateList() {
    await this.createListButton.click();
  }

  /**
   * Get all shopping list cards
   */
  getShoppingListCards() {
    return this.page.locator('[data-testid^="shopping-list-card"], .MuiCard-root');
  }

  /**
   * Get a specific shopping list card by name
   */
  getShoppingListCard(listName: string) {
    const card = this.page.locator(`[data-testid="shopping-list-card-${listName}"], .MuiCard-root:has-text("${listName}")`);
    return new ShoppingListCard(card);
  }

  /**
   * Get a shopping list card by index
   */
  getShoppingListCardByIndex(index: number) {
    const card = this.getShoppingListCards().nth(index);
    return new ShoppingListCard(card);
  }

  /**
   * Get the number of shopping list cards
   */
  async getShoppingListCount() {
    return await this.getShoppingListCards().count();
  }

  /**
   * Get all shopping list names
   */
  async getShoppingListNames() {
    const cards = this.getShoppingListCards();
    const count = await cards.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const card = new ShoppingListCard(cards.nth(i));
      const name = await card.getListName();
      if (name) {
        names.push(name);
      }
    }
    
    return names;
  }

  /**
   * Check if a shopping list exists by name
   */
  async hasShoppingList(listName: string) {
    const names = await this.getShoppingListNames();
    return names.includes(listName);
  }

  /**
   * Click on a shopping list card by name
   */
  async clickShoppingList(listName: string) {
    const card = this.getShoppingListCard(listName);
    await card.click();
  }

  /**
   * Delete a shopping list by name
   */
  async deleteShoppingList(listName: string) {
    const card = this.getShoppingListCard(listName);
    await card.clickDelete();
  }

  /**
   * Get the user menu button
   */
  getUserMenuButton() {
    return this.page.locator('[data-testid="user-menu-button"], button[aria-label*="user"], button[aria-label*="account"]');
  }

  /**
   * Click the user menu button
   */
  async clickUserMenu() {
    await this.getUserMenuButton().click();
  }

  /**
   * Get the logout button from user menu
   */
  getLogoutButton() {
    return this.page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Sign Out")');
  }

  /**
   * Click the logout button
   */
  async clickLogout() {
    await this.clickUserMenu();
    await this.getLogoutButton().click();
  }

  /**
   * Get the theme switcher button
   */
  getThemeSwitcherButton() {
    return this.page.locator('[data-testid="theme-switcher"], button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]');
  }

  /**
   * Click the theme switcher button
   */
  async clickThemeSwitcher() {
    await this.getThemeSwitcherButton().click();
  }

  /**
   * Get the language switcher button
   */
  getLanguageSwitcherButton() {
    return this.page.locator('[data-testid="language-switcher"], button[aria-label*="language"], button[aria-label*="locale"]');
  }

  /**
   * Click the language switcher button
   */
  async clickLanguageSwitcher() {
    await this.getLanguageSwitcherButton().click();
  }

  /**
   * Get the search input field
   */
  getSearchInput() {
    return this.page.locator('input[placeholder*="search"], input[aria-label*="search"]');
  }

  /**
   * Search for shopping lists
   */
  async searchLists(searchTerm: string) {
    const searchInput = this.getSearchInput();
    await searchInput.fill(searchTerm);
  }

  /**
   * Clear the search input
   */
  async clearSearch() {
    const searchInput = this.getSearchInput();
    await searchInput.clear();
  }

  /**
   * Get the empty state message
   */
  getEmptyStateMessage() {
    return this.page.locator('[data-testid="empty-state"], .empty-state, :has-text("No lists found"), :has-text("Create your first list")');
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
    return this.page.locator('[data-testid="shopping-lists-skeleton"], .MuiSkeleton-root');
  }

  /**
   * Check if the loading skeleton is visible
   */
  async hasLoadingSkeleton() {
    return await this.getLoadingSkeleton().isVisible();
  }

  /**
   * Wait for the shopping lists to load
   */
  async waitForListsToLoad() {
    await this.page.waitForSelector('[data-testid^="shopping-list-card"], .MuiCard-root, [data-testid="empty-state"]', { 
      state: 'visible',
      timeout: 10000 
    });
  }

  /**
   * Wait for the loading skeleton to disappear
   */
  async waitForLoadingToComplete() {
    await this.page.waitForSelector('[data-testid="shopping-lists-skeleton"], .MuiSkeleton-root', { 
      state: 'hidden',
      timeout: 10000 
    });
  }

  /**
   * Get the current locale from the page
   */
  async getCurrentLocale() {
    return await super.getCurrentLocale();
  }

  /**
   * Check if the page is in RTL mode
   */
  async isRTL() {
    return await super.isRTL();
  }

  /**
   * Assert that the page is loaded
   */
  async expectLoaded() {
    await this.expectUrl(/.*\/$/);
    await this.createListButton.expectVisible();
  }

  /**
   * Assert that the page has a specific title
   */
  async expectTitle(title: string) {
    await this.expectTitle(title);
  }

  /**
   * Assert that the create list button is visible
   */
  async expectCreateListButton() {
    await this.createListButton.expectVisible();
  }

  /**
   * Assert that the create list button is enabled
   */
  async expectCreateListButtonEnabled() {
    await this.createListButton.expectEnabled();
  }

  /**
   * Assert that the create list button is disabled
   */
  async expectCreateListButtonDisabled() {
    await this.createListButton.expectDisabled();
  }

  /**
   * Assert that there are a specific number of shopping lists
   */
  async expectShoppingListCount(count: number) {
    const currentCount = await this.getShoppingListCount();
    if (currentCount !== count) {
      throw new Error(`Expected ${count} shopping lists but got ${currentCount}`);
    }
  }

  /**
   * Assert that a shopping list exists
   */
  async expectShoppingList(listName: string) {
    const exists = await this.hasShoppingList(listName);
    if (!exists) {
      throw new Error(`Expected shopping list "${listName}" to exist`);
    }
  }

  /**
   * Assert that a shopping list does not exist
   */
  async expectNoShoppingList(listName: string) {
    const exists = await this.hasShoppingList(listName);
    if (exists) {
      throw new Error(`Expected shopping list "${listName}" to not exist`);
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
   * Assert that the user menu button is visible
   */
  async expectUserMenuButton() {
    await expect(this.getUserMenuButton()).toBeVisible();
  }

  /**
   * Assert that the theme switcher button is visible
   */
  async expectThemeSwitcherButton() {
    await expect(this.getThemeSwitcherButton()).toBeVisible();
  }

  /**
   * Assert that the language switcher button is visible
   */
  async expectLanguageSwitcherButton() {
    await expect(this.getLanguageSwitcherButton()).toBeVisible();
  }

  /**
   * Assert that the search input is visible
   */
  async expectSearchInput() {
    await expect(this.getSearchInput()).toBeVisible();
  }

  /**
   * Assert that the page is in a specific locale
   */
  async expectLocale(locale: string) {
    const currentLocale = await this.getCurrentLocale();
    if (currentLocale !== locale) {
      throw new Error(`Expected locale to be "${locale}" but got "${currentLocale}"`);
    }
  }

  /**
   * Assert that the page is in RTL mode
   */
  async expectRTL() {
    const isRTL = await this.isRTL();
    if (!isRTL) {
      throw new Error('Expected page to be in RTL mode');
    }
  }

  /**
   * Assert that the page is in LTR mode
   */
  async expectLTR() {
    const isRTL = await this.isRTL();
    if (isRTL) {
      throw new Error('Expected page to be in LTR mode');
    }
  }
}
