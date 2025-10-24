import { Locator } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';

/**
 * Component model for Button UI component
 * Wraps src/components/ui/Button.tsx
 */
export class Button extends BaseComponent {
  constructor(locator: Locator) {
    super(locator);
  }

  /**
   * Click the button
   */
  async click() {
    await this.locator.click();
  }

  /**
   * Double click the button
   */
  async doubleClick() {
    await this.locator.dblclick();
  }

  /**
   * Right click the button
   */
  async rightClick() {
    await this.locator.click({ button: 'right' });
  }

  /**
   * Hover over the button
   */
  async hover() {
    await this.locator.hover();
  }

  /**
   * Focus the button
   */
  async focus() {
    await this.locator.focus();
  }

  /**
   * Get the button text
   */
  async getText() {
    return await this.locator.textContent();
  }

  /**
   * Get the button's inner text (including nested elements)
   */
  async getInnerText() {
    return await this.locator.innerText();
  }

  /**
   * Check if the button is disabled
   */
  async isDisabled() {
    return await this.locator.isDisabled();
  }

  /**
   * Check if the button is enabled
   */
  async isEnabled() {
    return await this.locator.isEnabled();
  }

  /**
   * Get the button variant (primary, secondary, etc.)
   */
  async getVariant() {
    const classList = await this.locator.getAttribute('class');
    if (classList?.includes('MuiButton-contained')) return 'contained';
    if (classList?.includes('MuiButton-outlined')) return 'outlined';
    if (classList?.includes('MuiButton-text')) return 'text';
    return 'contained'; // default
  }

  /**
   * Get the button color
   */
  async getColor() {
    const classList = await this.locator.getAttribute('class');
    if (classList?.includes('MuiButton-colorPrimary')) return 'primary';
    if (classList?.includes('MuiButton-colorSecondary')) return 'secondary';
    if (classList?.includes('MuiButton-colorError')) return 'error';
    return 'primary'; // default
  }

  /**
   * Get the button size
   */
  async getSize() {
    const classList = await this.locator.getAttribute('class');
    if (classList?.includes('MuiButton-sizeSmall')) return 'small';
    if (classList?.includes('MuiButton-sizeLarge')) return 'large';
    return 'medium'; // default
  }

  /**
   * Check if the button has a loading state
   */
  async isLoading() {
    const loadingIndicator = this.locator.locator('.MuiCircularProgress-root');
    return await loadingIndicator.isVisible();
  }

  /**
   * Get the button's aria-label
   */
  async getAriaLabel() {
    return await this.locator.getAttribute('aria-label');
  }

  /**
   * Get the button's title attribute
   */
  async getTitle() {
    return await this.locator.getAttribute('title');
  }

  /**
   * Assert that the button is visible
   */
  async expectVisible() {
    await super.expectVisible();
  }

  /**
   * Assert that the button is hidden
   */
  async expectHidden() {
    await this.expectHidden();
  }

  /**
   * Assert that the button is enabled
   */
  async expectEnabled() {
    await this.expectEnabled();
  }

  /**
   * Assert that the button is disabled
   */
  async expectDisabled() {
    await this.expectDisabled();
  }

  /**
   * Assert that the button has specific text
   */
  async expectText(text: string | RegExp) {
    await this.expectText(text);
  }

  /**
   * Assert that the button contains specific text
   */
  async expectTextContaining(text: string | RegExp) {
    await this.expectTextContaining(text);
  }

  /**
   * Assert that the button has a specific variant
   */
  async expectVariant(variant: 'text' | 'outlined' | 'contained') {
    const currentVariant = await this.getVariant();
    if (currentVariant !== variant) {
      throw new Error(`Expected button variant to be "${variant}" but got "${currentVariant}"`);
    }
  }

  /**
   * Assert that the button has a specific color
   */
  async expectColor(color: 'primary' | 'secondary' | 'error') {
    const currentColor = await this.getColor();
    if (currentColor !== color) {
      throw new Error(`Expected button color to be "${color}" but got "${currentColor}"`);
    }
  }

  /**
   * Assert that the button has a specific size
   */
  async expectSize(size: 'small' | 'medium' | 'large') {
    const currentSize = await this.getSize();
    if (currentSize !== size) {
      throw new Error(`Expected button size to be "${size}" but got "${currentSize}"`);
    }
  }

  /**
   * Assert that the button is in loading state
   */
  async expectLoading() {
    const isLoading = await this.isLoading();
    if (!isLoading) {
      throw new Error('Expected button to be in loading state');
    }
  }

  /**
   * Assert that the button is not in loading state
   */
  async expectNotLoading() {
    const isLoading = await this.isLoading();
    if (isLoading) {
      throw new Error('Expected button to not be in loading state');
    }
  }
}
