import { Page, expect, Locator } from '@playwright/test';

/**
 * Base class for all page object models
 * Provides common utilities and patterns for page interactions
 */
export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get the page instance (for test access)
   */
  getPage() {
    return this.page;
  }

  /**
   * Navigate to the page
   */
  async goto(url?: string) {
    const targetUrl = url || this.getUrl();
    await this.page.goto(targetUrl);
    await this.waitForLoad();
  }

  /**
   * Get the current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get the page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Wait for the page to load completely
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for a specific URL
   */
  async waitForUrl(url: string | RegExp, timeout: number = 10000) {
    await this.page.waitForURL(url, { timeout });
  }

  /**
   * Reload the page
   */
  async reload() {
    await this.page.reload();
    await this.waitForLoad();
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.page.goBack();
    await this.waitForLoad();
  }

  /**
   * Go forward in browser history
   */
  async goForward() {
    await this.page.goForward();
    await this.waitForLoad();
  }

  /**
   * Take a screenshot of the page
   */
  async screenshot(options?: { path?: string; fullPage?: boolean }) {
    return await this.page.screenshot(options);
  }

  /**
   * Get a locator for an element on the page
   */
  locator(selector: string) {
    return this.page.locator(selector);
  }

  /**
   * Get a locator by role
   */
  getByRole(role: string, options?: { name?: string; exact?: boolean }) {
    return this.page.getByRole(role as any, options);
  }

  /**
   * Get a locator by text
   */
  getByText(text: string | RegExp, options?: { exact?: boolean }) {
    return this.page.getByText(text, options);
  }

  /**
   * Get a locator by label
   */
  getByLabel(text: string | RegExp, options?: { exact?: boolean }) {
    return this.page.getByLabel(text, options);
  }

  /**
   * Get a locator by placeholder
   */
  getByPlaceholder(text: string | RegExp, options?: { exact?: boolean }) {
    return this.page.getByPlaceholder(text, options);
  }

  /**
   * Get a locator by test ID
   */
  getByTestId(testId: string) {
    return this.page.getByTestId(testId);
  }

  /**
   * Get a locator by title
   */
  getByTitle(text: string | RegExp) {
    return this.page.getByTitle(text);
  }

  /**
   * Get a locator by alt text
   */
  getByAltText(text: string | RegExp) {
    return this.page.getByAltText(text);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForElementHidden(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Wait for a network request to complete
   */
  async waitForRequest(url: string | RegExp, timeout: number = 10000) {
    return await this.page.waitForRequest(url, { timeout });
  }

  /**
   * Wait for a network response
   */
  async waitForResponse(url: string | RegExp, timeout: number = 10000) {
    return await this.page.waitForResponse(url, { timeout });
  }

  /**
   * Check if an element exists on the page
   */
  async hasElement(selector: string) {
    return await this.page.locator(selector).count() > 0;
  }

  /**
   * Check if an element is visible
   */
  async isElementVisible(selector: string) {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Get the text content of an element
   */
  async getElementText(selector: string) {
    return await this.page.locator(selector).textContent();
  }

  /**
   * Get the inner text of an element
   */
  async getElementInnerText(selector: string) {
    return await this.page.locator(selector).innerText();
  }

  /**
   * Get the value of an input element
   */
  async getInputValue(selector: string) {
    return await this.page.locator(selector).inputValue();
  }

  /**
   * Fill an input field
   */
  async fillInput(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
  }

  /**
   * Clear an input field
   */
  async clearInput(selector: string) {
    await this.page.locator(selector).clear();
  }

  /**
   * Click an element
   */
  async clickElement(selector: string) {
    await this.page.locator(selector).click();
  }

  /**
   * Double click an element
   */
  async doubleClickElement(selector: string) {
    await this.page.locator(selector).dblclick();
  }

  /**
   * Right click an element
   */
  async rightClickElement(selector: string) {
    await this.page.locator(selector).click({ button: 'right' });
  }

  /**
   * Hover over an element
   */
  async hoverElement(selector: string) {
    await this.page.locator(selector).hover();
  }

  /**
   * Focus an element
   */
  async focusElement(selector: string) {
    await this.page.locator(selector).focus();
  }

  /**
   * Select an option from a select element
   */
  async selectOption(selector: string, value: string | string[]) {
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * Check a checkbox
   */
  async checkCheckbox(selector: string) {
    await this.page.locator(selector).check();
  }

  /**
   * Uncheck a checkbox
   */
  async uncheckCheckbox(selector: string) {
    await this.page.locator(selector).uncheck();
  }

  /**
   * Check if a checkbox is checked
   */
  async isCheckboxChecked(selector: string) {
    return await this.page.locator(selector).isChecked();
  }

  /**
   * Press a key
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text
   */
  async typeText(text: string) {
    await this.page.keyboard.type(text);
  }

  /**
   * Assert that the page has a specific title
   */
  async expectTitle(title: string | RegExp) {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Assert that the page URL matches a pattern
   */
  async expectUrl(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }

  /**
   * Assert that an element is visible
   */
  async expectElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Assert that an element is hidden
   */
  async expectElementHidden(selector: string) {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  /**
   * Assert that an element has specific text
   */
  async expectElementText(selector: string, text: string | RegExp) {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  /**
   * Assert that an element contains specific text
   */
  async expectElementTextContaining(selector: string, text: string | RegExp) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  /**
   * Assert that an input has a specific value
   */
  async expectInputValue(selector: string, value: string) {
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  /**
   * Assert that a checkbox is checked
   */
  async expectCheckboxChecked(selector: string) {
    await expect(this.page.locator(selector)).toBeChecked();
  }

  /**
   * Assert that a checkbox is unchecked
   */
  async expectCheckboxUnchecked(selector: string) {
    await expect(this.page.locator(selector)).not.toBeChecked();
  }

  /**
   * Wait for a toast/notification to appear
   */
  async waitForToast(timeout: number = 5000) {
    await this.page.waitForSelector('[role="alert"], .MuiSnackbar-root, .toast', { 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Wait for a toast/notification to disappear
   */
  async waitForToastToDisappear(timeout: number = 5000) {
    await this.page.waitForSelector('[role="alert"], .MuiSnackbar-root, .toast', { 
      state: 'hidden', 
      timeout 
    });
  }

  /**
   * Get the current locale from the page
   */
  async getCurrentLocale() {
    const htmlElement = this.page.locator('html');
    return await htmlElement.getAttribute('lang') || 'en';
  }

  /**
   * Check if the page is in RTL mode
   */
  async isRTL() {
    const htmlElement = this.page.locator('html');
    const dir = await htmlElement.getAttribute('dir');
    return dir === 'rtl';
  }

  /**
   * Abstract method that must be implemented by subclasses
   * Returns the URL path for the page
   */
  abstract getUrl(): string;
}
