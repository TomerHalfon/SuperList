import { Locator, Page, expect } from '@playwright/test';

/**
 * Base class for all component models
 * Provides common utilities and patterns for component interactions
 */
export abstract class BaseComponent {
  protected locator: Locator;
  protected page: Page;

  constructor(locator: Locator, page?: Page) {
    this.locator = locator;
    this.page = page || locator.page();
  }

  /**
   * Get the locator (for test access)
   */
  getLocator() {
    return this.locator;
  }

  /**
   * Wait for the component to be visible
   */
  async waitForVisible(timeout: number = 5000) {
    await this.locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for the component to be hidden
   */
  async waitForHidden(timeout: number = 5000) {
    await this.locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if the component is visible
   */
  async isVisible() {
    return await this.locator.isVisible();
  }

  /**
   * Check if the component is hidden
   */
  async isHidden() {
    return await this.locator.isHidden();
  }

  /**
   * Check if the component is enabled
   */
  async isEnabled() {
    return await this.locator.isEnabled();
  }

  /**
   * Check if the component is disabled
   */
  async isDisabled() {
    return await this.locator.isDisabled();
  }

  /**
   * Get the text content of the component
   */
  async getText() {
    return await this.locator.textContent();
  }

  /**
   * Get the inner text of the component
   */
  async getInnerText() {
    return await this.locator.innerText();
  }

  /**
   * Get the HTML content of the component
   */
  async getHTML() {
    return await this.locator.innerHTML();
  }

  /**
   * Get a specific attribute value
   */
  async getAttribute(name: string) {
    return await this.locator.getAttribute(name);
  }

  /**
   * Check if the component has a specific attribute
   */
  async hasAttribute(name: string) {
    return await this.locator.getAttribute(name) !== null;
  }

  /**
   * Get the bounding box of the component
   */
  async getBoundingBox() {
    return await this.locator.boundingBox();
  }

  /**
   * Scroll the component into view
   */
  async scrollIntoView() {
    await this.locator.scrollIntoViewIfNeeded();
  }

  /**
   * Take a screenshot of the component
   */
  async screenshot(options?: { path?: string; fullPage?: boolean }) {
    return await this.locator.screenshot(options);
  }

  /**
   * Hover over the component
   */
  async hover() {
    await this.locator.hover();
  }

  /**
   * Focus the component
   */
  async focus() {
    await this.locator.focus();
  }

  /**
   * Blur the component
   */
  async blur() {
    await this.locator.blur();
  }

  /**
   * Get a child locator
   */
  getChild(selector: string) {
    return this.locator.locator(selector);
  }

  /**
   * Get a child locator by role
   */
  getByRole(role: string, options?: { name?: string; exact?: boolean }) {
    return this.locator.getByRole(role as any, options);
  }

  /**
   * Get a child locator by text
   */
  getByText(text: string | RegExp, options?: { exact?: boolean }) {
    return this.locator.getByText(text, options);
  }

  /**
   * Get a child locator by label
   */
  getByLabel(text: string | RegExp, options?: { exact?: boolean }) {
    return this.locator.getByLabel(text, options);
  }

  /**
   * Get a child locator by placeholder
   */
  getByPlaceholder(text: string | RegExp, options?: { exact?: boolean }) {
    return this.locator.getByPlaceholder(text, options);
  }

  /**
   * Get a child locator by test ID
   */
  getByTestId(testId: string) {
    return this.locator.getByTestId(testId);
  }

  /**
   * Assert that the component is visible
   */
  async expectVisible() {
    await expect(this.locator).toBeVisible();
  }

  /**
   * Assert that the component is hidden
   */
  async expectHidden() {
    await expect(this.locator).toBeHidden();
  }

  /**
   * Assert that the component is enabled
   */
  async expectEnabled() {
    await expect(this.locator).toBeEnabled();
  }

  /**
   * Assert that the component is disabled
   */
  async expectDisabled() {
    await expect(this.locator).toBeDisabled();
  }

  /**
   * Assert that the component has specific text
   */
  async expectText(text: string | RegExp) {
    await expect(this.locator).toHaveText(text);
  }

  /**
   * Assert that the component contains specific text
   */
  async expectTextContaining(text: string | RegExp) {
    await expect(this.locator).toContainText(text);
  }

  /**
   * Assert that the component has a specific attribute
   */
  async expectAttribute(name: string, value: string | RegExp) {
    await expect(this.locator).toHaveAttribute(name, value);
  }

  /**
   * Assert that the component has a specific CSS class
   */
  async expectClass(className: string) {
    await expect(this.locator).toHaveClass(new RegExp(className));
  }

  /**
   * Assert that the component has a specific CSS property
   */
  async expectCSSProperty(name: string, value: string) {
    await expect(this.locator).toHaveCSS(name, value);
  }
}
