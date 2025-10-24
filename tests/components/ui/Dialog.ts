import { Locator } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';
import { Button } from './Button';

/**
 * Component model for Dialog UI component
 * Wraps src/components/ui/Dialog.tsx
 */
export class Dialog extends BaseComponent {
  constructor(locator: Locator) {
    super(locator);
  }

  /**
   * Check if the dialog is open
   */
  async isOpen() {
    return await this.locator.isVisible();
  }

  /**
   * Check if the dialog is closed
   */
  async isClosed() {
    return await this.locator.isHidden();
  }

  /**
   * Get the dialog title
   */
  async getTitle() {
    const titleElement = this.locator.locator('.MuiDialogTitle-root, [role="dialog"] h2, [role="dialog"] h3');
    if (await titleElement.isVisible()) {
      return await titleElement.textContent();
    }
    return null;
  }

  /**
   * Get the dialog content
   */
  async getContent() {
    const contentElement = this.locator.locator('.MuiDialogContent-root, [role="dialog"] .content');
    if (await contentElement.isVisible()) {
      return await contentElement.textContent();
    }
    return null;
  }

  /**
   * Get the close button
   */
  getCloseButton() {
    const closeButton = this.locator.locator('[data-testid="dialog-close-button"], .MuiDialogTitle-root button, [aria-label="close"]');
    return new Button(closeButton);
  }

  /**
   * Get the backdrop element
   */
  getBackdrop() {
    return this.locator.locator('.MuiBackdrop-root, .MuiModal-backdrop');
  }

  /**
   * Close the dialog by clicking the close button
   */
  async close() {
    const closeButton = this.getCloseButton();
    await closeButton.click();
  }

  /**
   * Close the dialog by clicking the backdrop
   */
  async closeByBackdrop() {
    const backdrop = this.getBackdrop();
    await backdrop.click();
  }

  /**
   * Close the dialog by pressing Escape key
   */
  async closeByEscape() {
    await this.locator.press('Escape');
  }

  /**
   * Get all buttons in the dialog
   */
  getButtons() {
    return this.locator.locator('.MuiDialogActions-root button, [role="dialog"] button');
  }

  /**
   * Get a specific button by text
   */
  getButtonByText(text: string) {
    const button = this.locator.locator(`button:has-text("${text}")`);
    return new Button(button);
  }

  /**
   * Get the primary action button (usually the first button)
   */
  getPrimaryButton() {
    const primaryButton = this.locator.locator('.MuiDialogActions-root button:first-child, [role="dialog"] button.primary');
    return new Button(primaryButton);
  }

  /**
   * Get the secondary action button (usually the second button)
   */
  getSecondaryButton() {
    const secondaryButton = this.locator.locator('.MuiDialogActions-root button:nth-child(2), [role="dialog"] button.secondary');
    return new Button(secondaryButton);
  }

  /**
   * Get the cancel button
   */
  getCancelButton() {
    return this.getButtonByText('Cancel');
  }

  /**
   * Get the confirm/OK button
   */
  getConfirmButton() {
    return this.locator.getByRole('button', { name: /OK|Confirm|Yes/i });
  }

  /**
   * Click the primary button
   */
  async clickPrimary() {
    const primaryButton = this.getPrimaryButton();
    await primaryButton.click();
  }

  /**
   * Click the secondary button
   */
  async clickSecondary() {
    const secondaryButton = this.getSecondaryButton();
    await secondaryButton.click();
  }

  /**
   * Click the cancel button
   */
  async clickCancel() {
    const cancelButton = this.getCancelButton();
    await cancelButton.click();
  }

  /**
   * Click the confirm button
   */
  async clickConfirm() {
    const confirmButton = this.getConfirmButton();
    await confirmButton.click();
  }

  /**
   * Get the dialog's aria-label
   */
  async getAriaLabel() {
    return await this.locator.getAttribute('aria-label');
  }

  /**
   * Get the dialog's aria-labelledby
   */
  async getAriaLabelledBy() {
    return await this.locator.getAttribute('aria-labelledby');
  }

  /**
   * Get the dialog's aria-describedby
   */
  async getAriaDescribedBy() {
    return await this.locator.getAttribute('aria-describedby');
  }

  /**
   * Check if the dialog is scrollable
   */
  async isScrollable() {
    const contentElement = this.locator.locator('.MuiDialogContent-root');
    if (await contentElement.isVisible()) {
      const scrollHeight = await contentElement.evaluate((el: HTMLElement) => el.scrollHeight);
      const clientHeight = await contentElement.evaluate((el: HTMLElement) => el.clientHeight);
      return scrollHeight > clientHeight;
    }
    return false;
  }

  /**
   * Scroll the dialog content to the bottom
   */
  async scrollToBottom() {
    const contentElement = this.locator.locator('.MuiDialogContent-root');
    if (await contentElement.isVisible()) {
      await contentElement.evaluate((el: HTMLElement) => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }

  /**
   * Scroll the dialog content to the top
   */
  async scrollToTop() {
    const contentElement = this.locator.locator('.MuiDialogContent-root');
    if (await contentElement.isVisible()) {
      await contentElement.evaluate((el: HTMLElement) => {
        el.scrollTop = 0;
      });
    }
  }

  /**
   * Assert that the dialog is open
   */
  async expectOpen() {
    const isOpen = await this.isOpen();
    if (!isOpen) {
      throw new Error('Expected dialog to be open');
    }
  }

  /**
   * Assert that the dialog is closed
   */
  async expectClosed() {
    const isClosed = await this.isClosed();
    if (!isClosed) {
      throw new Error('Expected dialog to be closed');
    }
  }

  /**
   * Assert that the dialog has a specific title
   */
  async expectTitle(title: string) {
    const currentTitle = await this.getTitle();
    if (currentTitle !== title) {
      throw new Error(`Expected dialog title to be "${title}" but got "${currentTitle}"`);
    }
  }

  /**
   * Assert that the dialog contains specific content
   */
  async expectContent(content: string) {
    const currentContent = await this.getContent();
    if (!currentContent?.includes(content)) {
      throw new Error(`Expected dialog content to contain "${content}" but got "${currentContent}"`);
    }
  }

  /**
   * Assert that the dialog has a specific aria-label
   */
  async expectAriaLabel(label: string) {
    await this.expectAttribute('aria-label', label);
  }

  /**
   * Assert that the dialog has a close button
   */
  async expectCloseButton() {
    const closeButton = this.getCloseButton();
    await closeButton.expectVisible();
  }

  /**
   * Assert that the dialog has a specific number of buttons
   */
  async expectButtonCount(count: number) {
    const buttons = this.getButtons();
    const buttonCount = await buttons.count();
    if (buttonCount !== count) {
      throw new Error(`Expected dialog to have ${count} buttons but got ${buttonCount}`);
    }
  }

  /**
   * Assert that the dialog has a specific button
   */
  async expectButton(text: string) {
    const button = this.getButtonByText(text);
    await button.expectVisible();
  }

  /**
   * Assert that the dialog is scrollable
   */
  async expectScrollable() {
    const isScrollable = await this.isScrollable();
    if (!isScrollable) {
      throw new Error('Expected dialog to be scrollable');
    }
  }

  /**
   * Assert that the dialog is not scrollable
   */
  async expectNotScrollable() {
    const isScrollable = await this.isScrollable();
    if (isScrollable) {
      throw new Error('Expected dialog to not be scrollable');
    }
  }
}
