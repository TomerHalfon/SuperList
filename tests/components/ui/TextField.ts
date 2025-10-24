import { Locator } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';

/**
 * Component model for TextField UI component
 * Wraps src/components/ui/TextField.tsx
 */
export class TextField extends BaseComponent {
  constructor(locator: Locator) {
    super(locator);
  }

  /**
   * Fill the text field with a value
   */
  async fill(value: string) {
    await this.locator.fill(value);
  }

  /**
   * Clear the text field
   */
  async clear() {
    await this.locator.clear();
  }

  /**
   * Type text into the field (simulates typing)
   */
  async type(text: string) {
    await this.locator.type(text);
  }

  /**
   * Press a key in the text field
   */
  async pressKey(key: string) {
    await this.locator.press(key);
  }

  /**
   * Get the current value of the text field
   */
  async getValue() {
    return await this.locator.inputValue();
  }

  /**
   * Get the placeholder text
   */
  async getPlaceholder() {
    return await this.locator.getAttribute('placeholder');
  }

  /**
   * Get the label text
   */
  async getLabel() {
    const label = this.locator.locator('label');
    return await label.textContent();
  }

  /**
   * Get the field type (text, email, password, etc.)
   */
  async getType() {
    return await this.locator.getAttribute('type') || 'text';
  }

  /**
   * Check if the field is required
   */
  async isRequired() {
    return await this.locator.getAttribute('required') !== null;
  }

  /**
   * Check if the field is disabled
   */
  async isDisabled() {
    return await this.locator.isDisabled();
  }

  /**
   * Check if the field is readonly
   */
  async isReadonly() {
    return await this.locator.getAttribute('readonly') !== null;
  }

  /**
   * Get the field's name attribute
   */
  async getName() {
    return await this.locator.getAttribute('name');
  }

  /**
   * Get the field's id attribute
   */
  async getId() {
    return await this.locator.getAttribute('id');
  }

  /**
   * Get the field's aria-label
   */
  async getAriaLabel() {
    return await this.locator.getAttribute('aria-label');
  }

  /**
   * Get the field's aria-describedby
   */
  async getAriaDescribedBy() {
    return await this.locator.getAttribute('aria-describedby');
  }

  /**
   * Get the error message (if any)
   */
  async getErrorMessage() {
    // Look for error in the parent FormControl
    const parentFormControl = this.locator.locator('xpath=ancestor::div[contains(@class, "MuiFormControl-root")]');
    const errorElement = parentFormControl.locator('.MuiFormHelperText-root.Mui-error');
    if (await errorElement.isVisible().catch(() => false)) {
      return await errorElement.textContent();
    }
    return null;
  }

  /**
   * Get the helper text
   */
  async getHelperText() {
    // Look for helper text in the parent FormControl
    const parentFormControl = this.locator.locator('xpath=ancestor::div[contains(@class, "MuiFormControl-root")]');
    const helperElement = parentFormControl.locator('.MuiFormHelperText-root:not(.Mui-error)');
    if (await helperElement.isVisible().catch(() => false)) {
      return await helperElement.textContent();
    }
    return null;
  }

  /**
   * Check if the field has an error state
   */
  async hasError() {
    // Look for error in the parent FormControl
    const parentFormControl = this.locator.locator('xpath=ancestor::div[contains(@class, "MuiFormControl-root")]');
    const errorElement = parentFormControl.locator('.MuiFormHelperText-root.Mui-error');
    return await errorElement.isVisible().catch(() => false);
  }

  /**
   * Focus the text field
   */
  async focus() {
    await this.locator.focus();
  }

  /**
   * Blur the text field
   */
  async blur() {
    await this.locator.blur();
  }

  /**
   * Select all text in the field
   */
  async selectAll() {
    await this.locator.selectText();
  }

  /**
   * Get the selected text
   */
  async getSelectedText() {
    return await this.locator.evaluate((el: HTMLInputElement) => {
      return el.value.substring(el.selectionStart || 0, el.selectionEnd || 0);
    });
  }

  /**
   * Set the cursor position
   */
  async setCursorPosition(position: number) {
    await this.locator.evaluate((el: HTMLInputElement, pos: number) => {
      el.setSelectionRange(pos, pos);
    }, position);
  }

  /**
   * Assert that the field has a specific value
   */
  async expectValue(value: string) {
    await this.expectAttribute('value', value);
  }

  /**
   * Assert that the field is empty
   */
  async expectEmpty() {
    const currentValue = await this.getValue();
    if (currentValue !== '') {
      throw new Error(`Expected field to be empty but got "${currentValue}"`);
    }
  }

  /**
   * Assert that the field has a specific placeholder
   */
  async expectPlaceholder(placeholder: string) {
    await this.expectAttribute('placeholder', placeholder);
  }

  /**
   * Assert that the field has a specific label
   */
  async expectLabel(label: string) {
    const currentLabel = await this.getLabel();
    if (currentLabel !== label) {
      throw new Error(`Expected field label to be "${label}" but got "${currentLabel}"`);
    }
  }

  /**
   * Assert that the field is required
   */
  async expectRequired() {
    const isRequired = await this.isRequired();
    if (!isRequired) {
      throw new Error('Expected field to be required');
    }
  }

  /**
   * Assert that the field is not required
   */
  async expectNotRequired() {
    const isRequired = await this.isRequired();
    if (isRequired) {
      throw new Error('Expected field to not be required');
    }
  }

  /**
   * Assert that the field is disabled
   */
  async expectDisabled() {
    await this.expectDisabled();
  }

  /**
   * Assert that the field is enabled
   */
  async expectEnabled() {
    await this.expectEnabled();
  }

  /**
   * Assert that the field has an error
   */
  async expectError() {
    const hasError = await this.hasError();
    if (!hasError) {
      throw new Error('Expected field to have an error');
    }
  }

  /**
   * Assert that the field does not have an error
   */
  async expectNoError() {
    const hasError = await this.hasError();
    if (hasError) {
      throw new Error('Expected field to not have an error');
    }
  }

  /**
   * Assert that the field has a specific error message
   */
  async expectErrorMessage(message: string) {
    const errorMessage = await this.getErrorMessage();
    if (errorMessage !== message) {
      throw new Error(`Expected error message to be "${message}" but got "${errorMessage}"`);
    }
  }

  /**
   * Assert that the field has specific helper text
   */
  async expectHelperText(text: string) {
    const helperText = await this.getHelperText();
    if (helperText !== text) {
      throw new Error(`Expected helper text to be "${text}" but got "${helperText}"`);
    }
  }
}
