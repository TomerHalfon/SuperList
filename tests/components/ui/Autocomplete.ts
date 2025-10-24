import { Locator, expect } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';

/**
 * Page object model for MUI Autocomplete component
 * Handles interactions with Material-UI Autocomplete components
 */
export class Autocomplete extends BaseComponent {
  private input: Locator;
  private optionsList: Locator;
  private chips: Locator;

  constructor(page: Locator) {
    super(page);
    this.input = page.locator('.MuiAutocomplete-input, input[role="combobox"]');
    this.optionsList = page.locator('.MuiAutocomplete-popper, .MuiAutocomplete-listbox');
    this.chips = page.locator('.MuiChip-root');
  }

  /**
   * Get the input field
   */
  getInput() {
    return this.input;
  }

  /**
   * Get the options list/dropdown
   */
  getOptionsList() {
    return this.optionsList;
  }

  /**
   * Get all chips (for multiple selection)
   */
  getChips() {
    return this.chips;
  }

  /**
   * Get a specific chip by label
   */
  getChip(label: string) {
    return this.chips.filter({ hasText: label });
  }

  /**
   * Get all chip labels
   */
  async getChipLabels() {
    const count = await this.chips.count();
    const labels: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const chip = this.chips.nth(i);
      const label = await chip.textContent();
      if (label) {
        labels.push(label.trim());
      }
    }
    
    return labels;
  }

  /**
   * Click on the input to open the dropdown
   */
  async click() {
    await this.input.click();
  }

  /**
   * Focus the input field
   */
  async focus() {
    await this.input.focus();
  }

  /**
   * Type text into the input
   */
  async type(text: string) {
    await this.input.fill(text);
  }

  /**
   * Clear the input field
   */
  async clear() {
    await this.input.clear();
  }

  /**
   * Fill the input with text
   */
  async fill(text: string) {
    await this.input.fill(text);
  }

  /**
   * Press a key in the input
   */
  async press(key: string) {
    await this.input.press(key);
  }

  /**
   * Select an option from the dropdown by text
   */
  async selectOption(optionText: string) {
    await this.input.click();
    await this.optionsList.waitFor({ state: 'visible', timeout: 5000 });
    
    const option = this.optionsList.locator(`li:has-text("${optionText}")`);
    await option.click();
  }

  /**
   * Select an option by index
   */
  async selectOptionByIndex(index: number) {
    await this.input.click();
    await this.optionsList.waitFor({ state: 'visible', timeout: 5000 });
    
    const option = this.optionsList.locator('li').nth(index);
    await option.click();
  }

  /**
   * Get all available options
   */
  async getOptions() {
    await this.input.click();
    await this.optionsList.waitFor({ state: 'visible', timeout: 5000 });
    
    const optionElements = this.optionsList.locator('li');
    const count = await optionElements.count();
    const options: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const option = optionElements.nth(i);
      const text = await option.textContent();
      if (text) {
        options.push(text.trim());
      }
    }
    
    return options;
  }

  /**
   * Remove a chip by clicking its delete button
   */
  async removeChip(label: string) {
    const chip = this.getChip(label);
    const deleteButton = chip.locator('.MuiChip-deleteIcon, [aria-label*="delete" i]');
    await deleteButton.click();
  }

  /**
   * Remove all chips
   */
  async clearAllChips() {
    const count = await this.chips.count();
    
    for (let i = count - 1; i >= 0; i--) {
      const chip = this.chips.nth(i);
      const deleteButton = chip.locator('.MuiChip-deleteIcon, [aria-label*="delete" i]');
      await deleteButton.click();
    }
  }

  /**
   * Check if the dropdown is open
   */
  async isDropdownOpen() {
    return await this.optionsList.isVisible();
  }

  /**
   * Wait for the dropdown to open
   */
  async waitForDropdownOpen() {
    await this.optionsList.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Wait for the dropdown to close
   */
  async waitForDropdownClose() {
    await this.optionsList.waitFor({ state: 'hidden', timeout: 5000 });
  }

  /**
   * Close the dropdown by pressing Escape
   */
  async closeDropdown() {
    await this.input.press('Escape');
  }

  /**
   * Get the current input value
   */
  async getInputValue() {
    return await this.input.inputValue();
  }

  /**
   * Check if the input is disabled
   */
  async isDisabled() {
    return await this.input.isDisabled();
  }

  /**
   * Check if the input is enabled
   */
  async isEnabled() {
    return await this.input.isEnabled();
  }

  // Assertion methods

  /**
   * Assert that the input is visible
   */
  async expectVisible() {
    await expect(this.input).toBeVisible();
  }

  /**
   * Assert that the input is not visible
   */
  async expectNotVisible() {
    await expect(this.input).not.toBeVisible();
  }

  /**
   * Assert that the input has a specific value
   */
  async expectValue(value: string) {
    await expect(this.input).toHaveValue(value);
  }

  /**
   * Assert that the input is empty
   */
  async expectEmpty() {
    await expect(this.input).toHaveValue('');
  }

  /**
   * Assert that the input is disabled
   */
  async expectDisabled() {
    await expect(this.input).toBeDisabled();
  }

  /**
   * Assert that the input is enabled
   */
  async expectEnabled() {
    await expect(this.input).toBeEnabled();
  }

  /**
   * Assert that the dropdown is open
   */
  async expectDropdownOpen() {
    await expect(this.optionsList).toBeVisible();
  }

  /**
   * Assert that the dropdown is closed
   */
  async expectDropdownClosed() {
    await expect(this.optionsList).not.toBeVisible();
  }

  /**
   * Assert that a specific option is available
   */
  async expectOption(optionText: string) {
    await this.input.click();
    await this.waitForDropdownOpen();
    
    const option = this.optionsList.locator(`li:has-text("${optionText}")`);
    await expect(option).toBeVisible();
  }

  /**
   * Assert that a specific option is not available
   */
  async expectNoOption(optionText: string) {
    await this.input.click();
    await this.waitForDropdownOpen();
    
    const option = this.optionsList.locator(`li:has-text("${optionText}")`);
    await expect(option).not.toBeVisible();
  }

  /**
   * Assert that there are a specific number of chips
   */
  async expectChipCount(count: number) {
    await expect(this.chips).toHaveCount(count);
  }

  /**
   * Assert that a specific chip is visible
   */
  async expectChip(label: string) {
    const chip = this.getChip(label);
    await expect(chip).toBeVisible();
  }

  /**
   * Assert that a specific chip is not visible
   */
  async expectNoChip(label: string) {
    const chip = this.getChip(label);
    await expect(chip).not.toBeVisible();
  }

  /**
   * Assert that the chips contain specific labels
   */
  async expectChipLabels(expectedLabels: string[]) {
    const actualLabels = await this.getChipLabels();
    expect(actualLabels.sort()).toEqual(expectedLabels.sort());
  }

  /**
   * Assert that there are no chips
   */
  async expectNoChips() {
    await expect(this.chips).toHaveCount(0);
  }
}
