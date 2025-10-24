import { Locator } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';

/**
 * Component model for Checkbox UI component
 * Wraps src/components/ui/Checkbox.tsx
 */
export class Checkbox extends BaseComponent {
  constructor(locator: Locator) {
    super(locator);
  }

  /**
   * Check the checkbox
   */
  async check() {
    await this.locator.check();
  }

  /**
   * Uncheck the checkbox
   */
  async uncheck() {
    await this.locator.uncheck();
  }

  /**
   * Toggle the checkbox state
   */
  async toggle() {
    await this.locator.click();
  }

  /**
   * Check if the checkbox is checked
   */
  async isChecked() {
    return await this.locator.isChecked();
  }

  /**
   * Check if the checkbox is unchecked
   */
  async isUnchecked() {
    return !(await this.locator.isChecked());
  }

  /**
   * Check if the checkbox is indeterminate
   */
  async isIndeterminate() {
    return await this.locator.evaluate((el: HTMLInputElement) => el.indeterminate);
  }

  /**
   * Get the checkbox label text
   */
  async getLabel() {
    const label = this.locator.locator('label');
    if (await label.isVisible()) {
      return await label.textContent();
    }
    return null;
  }

  /**
   * Get the checkbox value
   */
  async getValue() {
    return await this.locator.inputValue();
  }

  /**
   * Get the checkbox name attribute
   */
  async getName() {
    return await this.locator.getAttribute('name');
  }

  /**
   * Get the checkbox id attribute
   */
  async getId() {
    return await this.locator.getAttribute('id');
  }

  /**
   * Check if the checkbox is disabled
   */
  async isDisabled() {
    return await this.locator.isDisabled();
  }

  /**
   * Check if the checkbox is required
   */
  async isRequired() {
    return await this.locator.getAttribute('required') !== null;
  }

  /**
   * Get the checkbox's aria-label
   */
  async getAriaLabel() {
    return await this.locator.getAttribute('aria-label');
  }

  /**
   * Get the checkbox's aria-describedby
   */
  async getAriaDescribedBy() {
    return await this.locator.getAttribute('aria-describedby');
  }

  /**
   * Get the checkbox's aria-labelledby
   */
  async getAriaLabelledBy() {
    return await this.locator.getAttribute('aria-labelledby');
  }

  /**
   * Click the checkbox label (if it exists)
   */
  async clickLabel() {
    const label = this.locator.locator('label');
    if (await label.isVisible()) {
      await label.click();
    } else {
      await this.locator.click();
    }
  }

  /**
   * Focus the checkbox
   */
  async focus() {
    await this.locator.focus();
  }

  /**
   * Blur the checkbox
   */
  async blur() {
    await this.locator.blur();
  }

  /**
   * Press a key while focused on the checkbox
   */
  async pressKey(key: string) {
    await this.locator.press(key);
  }

  /**
   * Get the checkbox's form control name
   */
  async getFormControlName() {
    return await this.locator.getAttribute('formControlName');
  }

  /**
   * Check if the checkbox is part of a form
   */
  async isInForm() {
    const form = this.locator.locator('xpath=ancestor::form');
    return await form.count() > 0;
  }

  /**
   * Get the parent form element
   */
  getParentForm() {
    return this.locator.locator('xpath=ancestor::form');
  }

  /**
   * Assert that the checkbox is checked
   */
  async expectChecked() {
    const isChecked = await this.isChecked();
    if (!isChecked) {
      throw new Error('Expected checkbox to be checked');
    }
  }

  /**
   * Assert that the checkbox is unchecked
   */
  async expectUnchecked() {
    const isUnchecked = await this.isUnchecked();
    if (!isUnchecked) {
      throw new Error('Expected checkbox to be unchecked');
    }
  }

  /**
   * Assert that the checkbox is indeterminate
   */
  async expectIndeterminate() {
    const isIndeterminate = await this.isIndeterminate();
    if (!isIndeterminate) {
      throw new Error('Expected checkbox to be indeterminate');
    }
  }

  /**
   * Assert that the checkbox is enabled
   */
  async expectEnabled() {
    await this.expectEnabled();
  }

  /**
   * Assert that the checkbox is disabled
   */
  async expectDisabled() {
    await this.expectDisabled();
  }

  /**
   * Assert that the checkbox has a specific label
   */
  async expectLabel(label: string) {
    const currentLabel = await this.getLabel();
    if (currentLabel !== label) {
      throw new Error(`Expected checkbox label to be "${label}" but got "${currentLabel}"`);
    }
  }

  /**
   * Assert that the checkbox has a specific value
   */
  async expectValue(value: string) {
    const currentValue = await this.getValue();
    if (currentValue !== value) {
      throw new Error(`Expected checkbox value to be "${value}" but got "${currentValue}"`);
    }
  }

  /**
   * Assert that the checkbox has a specific name
   */
  async expectName(name: string) {
    const currentName = await this.getName();
    if (currentName !== name) {
      throw new Error(`Expected checkbox name to be "${name}" but got "${currentName}"`);
    }
  }

  /**
   * Assert that the checkbox is required
   */
  async expectRequired() {
    const isRequired = await this.isRequired();
    if (!isRequired) {
      throw new Error('Expected checkbox to be required');
    }
  }

  /**
   * Assert that the checkbox is not required
   */
  async expectNotRequired() {
    const isRequired = await this.isRequired();
    if (isRequired) {
      throw new Error('Expected checkbox to not be required');
    }
  }

  /**
   * Assert that the checkbox has a specific aria-label
   */
  async expectAriaLabel(label: string) {
    await this.expectAttribute('aria-label', label);
  }

  /**
   * Assert that the checkbox is visible
   */
  async expectVisible() {
    await super.expectVisible();
  }

  /**
   * Assert that the checkbox is hidden
   */
  async expectHidden() {
    await this.expectHidden();
  }
}
