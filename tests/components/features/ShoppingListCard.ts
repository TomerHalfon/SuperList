import { Locator } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';
import { Button } from '../ui/Button';

/**
 * Component model for ShoppingListCard feature component
 * Wraps src/components/features/ShoppingListCard.tsx
 */
export class ShoppingListCard extends BaseComponent {
  private deleteButton: Button;

  constructor(locator: Locator) {
    super(locator);
    
    // Initialize component models
    this.deleteButton = new Button(this.locator.getByTestId('shopping-list-delete-button'));
  }

  /**
   * Click the card to navigate to the list detail
   */
  async click() {
    await this.locator.click();
  }

  /**
   * Click the delete button
   */
  async clickDelete() {
    await this.deleteButton.click();
  }

  /**
   * Hover over the card
   */
  async hover() {
    await this.locator.hover();
  }

  /**
   * Get the list name
   */
  async getListName() {
    const nameElement = this.locator.locator('h6, .MuiTypography-h6');
    if (await nameElement.isVisible()) {
      return await nameElement.textContent();
    }
    return null;
  }

  /**
   * Get the last updated text
   */
  async getLastUpdated() {
    const updatedElement = this.locator.locator('.MuiTypography-body2');
    if (await updatedElement.isVisible()) {
      return await updatedElement.textContent();
    }
    return null;
  }

  /**
   * Get the progress percentage
   */
  async getProgressPercentage() {
    const progressText = this.locator.locator('.MuiTypography-caption').last();
    if (await progressText.isVisible()) {
      const text = await progressText.textContent();
      const match = text?.match(/(\d+)%/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Get the items collected text (e.g., "3 of 5 items collected")
   */
  async getItemsCollectedText() {
    const itemsText = this.locator.locator('.MuiTypography-caption').last();
    if (await itemsText.isVisible()) {
      return await itemsText.textContent();
    }
    return null;
  }

  /**
   * Get the number of collected items
   */
  async getCollectedItemsCount() {
    const itemsText = await this.getItemsCollectedText();
    if (itemsText) {
      const match = itemsText.match(/(\d+) of/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Get the total number of items
   */
  async getTotalItemsCount() {
    const itemsText = await this.getItemsCollectedText();
    if (itemsText) {
      const match = itemsText.match(/of (\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Check if the delete button is visible
   */
  async hasDeleteButton() {
    return await this.deleteButton.isVisible();
  }

  /**
   * Check if the delete button is enabled
   */
  async isDeleteButtonEnabled() {
    return await this.deleteButton.isEnabled();
  }

  /**
   * Get the progress bar element
   */
  getProgressBar() {
    return this.locator.locator('.MuiLinearProgress-root');
  }

  /**
   * Check if the progress bar is visible
   */
  async hasProgressBar() {
    return await this.getProgressBar().isVisible();
  }

  /**
   * Get the progress bar value
   */
  async getProgressBarValue() {
    const progressBar = this.getProgressBar();
    if (await progressBar.isVisible()) {
      return await progressBar.getAttribute('aria-valuenow');
    }
    return null;
  }

  /**
   * Check if the card is clickable (has a link)
   */
  async isClickable() {
    const link = this.locator.locator('a');
    return await link.count() > 0;
  }

  /**
   * Get the card's href attribute (if it's a link)
   */
  async getHref() {
    const link = this.locator.locator('a');
    if (await link.isVisible()) {
      return await link.getAttribute('href');
    }
    return null;
  }

  /**
   * Get the card's data attributes
   */
  async getDataAttributes() {
    return {
      listId: await this.locator.getAttribute('data-list-id'),
      listName: await this.locator.getAttribute('data-list-name'),
      progress: await this.locator.getAttribute('data-progress')
    };
  }

  /**
   * Assert that the card is visible
   */
  async expectVisible() {
    await super.expectVisible();
  }

  /**
   * Assert that the card is hidden
   */
  async expectHidden() {
    await this.expectHidden();
  }

  /**
   * Assert that the card has a specific list name
   */
  async expectListName(name: string) {
    const currentName = await this.getListName();
    if (currentName !== name) {
      throw new Error(`Expected list name to be "${name}" but got "${currentName}"`);
    }
  }

  /**
   * Assert that the card has a specific progress percentage
   */
  async expectProgressPercentage(percentage: number) {
    const currentPercentage = await this.getProgressPercentage();
    if (currentPercentage !== percentage) {
      throw new Error(`Expected progress percentage to be ${percentage}% but got ${currentPercentage}%`);
    }
  }

  /**
   * Assert that the card has a specific number of collected items
   */
  async expectCollectedItemsCount(count: number) {
    const currentCount = await this.getCollectedItemsCount();
    if (currentCount !== count) {
      throw new Error(`Expected collected items count to be ${count} but got ${currentCount}`);
    }
  }

  /**
   * Assert that the card has a specific total number of items
   */
  async expectTotalItemsCount(count: number) {
    const currentCount = await this.getTotalItemsCount();
    if (currentCount !== count) {
      throw new Error(`Expected total items count to be ${count} but got ${currentCount}`);
    }
  }

  /**
   * Assert that the card has a delete button
   */
  async expectDeleteButton() {
    const hasDeleteButton = await this.hasDeleteButton();
    if (!hasDeleteButton) {
      throw new Error('Expected card to have a delete button');
    }
  }

  /**
   * Assert that the card does not have a delete button
   */
  async expectNoDeleteButton() {
    const hasDeleteButton = await this.hasDeleteButton();
    if (hasDeleteButton) {
      throw new Error('Expected card to not have a delete button');
    }
  }

  /**
   * Assert that the delete button is enabled
   */
  async expectDeleteButtonEnabled() {
    const isEnabled = await this.isDeleteButtonEnabled();
    if (!isEnabled) {
      throw new Error('Expected delete button to be enabled');
    }
  }

  /**
   * Assert that the delete button is disabled
   */
  async expectDeleteButtonDisabled() {
    const isEnabled = await this.isDeleteButtonEnabled();
    if (isEnabled) {
      throw new Error('Expected delete button to be disabled');
    }
  }

  /**
   * Assert that the card has a progress bar
   */
  async expectProgressBar() {
    const hasProgressBar = await this.hasProgressBar();
    if (!hasProgressBar) {
      throw new Error('Expected card to have a progress bar');
    }
  }

  /**
   * Assert that the card does not have a progress bar
   */
  async expectNoProgressBar() {
    const hasProgressBar = await this.hasProgressBar();
    if (hasProgressBar) {
      throw new Error('Expected card to not have a progress bar');
    }
  }

  /**
   * Assert that the card is clickable
   */
  async expectClickable() {
    const isClickable = await this.isClickable();
    if (!isClickable) {
      throw new Error('Expected card to be clickable');
    }
  }

  /**
   * Assert that the card has a specific href
   */
  async expectHref(href: string) {
    const currentHref = await this.getHref();
    if (currentHref !== href) {
      throw new Error(`Expected card href to be "${href}" but got "${currentHref}"`);
    }
  }

  /**
   * Assert that the card contains specific text
   */
  async expectTextContaining(text: string) {
    await this.expectTextContaining(text);
  }

  /**
   * Assert that the card has a specific data attribute
   */
  async expectDataAttribute(name: string, value: string) {
    const currentValue = await this.locator.getAttribute(`data-${name}`);
    if (currentValue !== value) {
      throw new Error(`Expected data-${name} to be "${value}" but got "${currentValue}"`);
    }
  }
}
