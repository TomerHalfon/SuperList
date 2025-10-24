import { Locator, expect } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { Autocomplete } from '../ui/Autocomplete';

/**
 * Page object model for the Edit Item Quantity Dialog
 * Represents the dialog that opens when editing an item's quantity and metadata
 */
export class EditItemQuantityDialog extends BaseComponent {
  private dialog: Locator;
  private quantityInput: TextField;
  private advancedSettingsToggle: Button;
  private tagsAutocomplete: Autocomplete;
  private saveButton: Button;
  private cancelButton: Button;
  private emojiPickerButton: Button;

  constructor(page: Locator) {
    super(page);
    this.dialog = page.locator('[role="dialog"]:has-text("Edit Quantity"), [role="dialog"]:has-text("edit quantity")');
    this.quantityInput = new TextField(this.dialog.locator('input[type="number"], input[placeholder*="quantity" i]'));
    this.advancedSettingsToggle = new Button(this.dialog.locator('button:has-text("Advanced"), button:has-text("advanced")'));
    this.tagsAutocomplete = new Autocomplete(this.dialog.locator('.MuiAutocomplete-root:has(.MuiInputBase-input)'));
    this.saveButton = new Button(this.dialog.locator('button:has-text("Save"), button[type="submit"]'));
    this.cancelButton = new Button(this.dialog.locator('button:has-text("Cancel"), button:has-text("Close")'));
    this.emojiPickerButton = new Button(this.dialog.locator('button:has-text("emoji"), button[aria-label*="emoji" i]'));
  }

  /**
   * Get the dialog container
   */
  getDialog() {
    return this.dialog;
  }

  /**
   * Get the quantity input field
   */
  getQuantityInput() {
    return this.quantityInput;
  }

  /**
   * Get the advanced settings toggle button
   */
  getAdvancedSettingsToggle() {
    return this.advancedSettingsToggle;
  }

  /**
   * Get the tags autocomplete component
   */
  getTagsAutocomplete() {
    return this.tagsAutocomplete;
  }

  /**
   * Get the save button
   */
  getSaveButton() {
    return this.saveButton;
  }

  /**
   * Get the cancel button
   */
  getCancelButton() {
    return this.cancelButton;
  }

  /**
   * Get the emoji picker button
   */
  getEmojiPickerButton() {
    return this.emojiPickerButton;
  }

  /**
   * Check if the dialog is open
   */
  async isOpen() {
    return await this.dialog.isVisible();
  }

  /**
   * Wait for the dialog to be open
   */
  async waitForOpen() {
    await this.dialog.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Wait for the dialog to be closed
   */
  async waitForClose() {
    await this.dialog.waitFor({ state: 'hidden', timeout: 5000 });
  }

  /**
   * Set the quantity value
   */
  async setQuantity(quantity: number) {
    await this.quantityInput.fill(quantity.toString());
  }

  /**
   * Get the current quantity value
   */
  async getQuantity() {
    const value = await this.quantityInput.getInputValue();
    return parseInt(value, 10);
  }

  /**
   * Toggle the advanced settings section
   */
  async toggleAdvancedSettings() {
    await this.advancedSettingsToggle.click();
  }

  /**
   * Check if advanced settings are visible
   */
  async isAdvancedSettingsVisible() {
    const advancedSection = this.dialog.locator('.MuiCollapse-root:has(.MuiAutocomplete-root)');
    return await advancedSection.isVisible();
  }

  /**
   * Add a new tag by typing in the autocomplete
   */
  async addNewTag(tagName: string) {
    await this.tagsAutocomplete.getInput().fill(tagName);
    await this.tagsAutocomplete.getInput().press('Enter');
  }

  /**
   * Add multiple new tags
   */
  async addMultipleNewTags(tagNames: string[]) {
    for (const tagName of tagNames) {
      await this.addNewTag(tagName);
    }
  }

  /**
   * Select an existing tag from the dropdown
   */
  async selectExistingTag(tagName: string) {
    await this.tagsAutocomplete.getInput().click();
    await this.tagsAutocomplete.selectOption(tagName);
  }

  /**
   * Get all tag chips currently displayed
   */
  getTagChips() {
    return this.dialog.locator('.MuiChip-root');
  }

  /**
   * Get the text content of all tag chips
   */
  async getTagChipLabels() {
    const chips = this.getTagChips();
    const count = await chips.count();
    const labels: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const chip = chips.nth(i);
      const label = await chip.textContent();
      if (label) {
        labels.push(label.trim());
      }
    }
    
    return labels;
  }

  /**
   * Get a specific tag chip by label
   */
  getTagChip(tagLabel: string) {
    return this.dialog.locator(`.MuiChip-root:has-text("${tagLabel}")`);
  }

  /**
   * Remove a tag chip by clicking its delete button
   */
  async removeTag(tagLabel: string) {
    const chip = this.getTagChip(tagLabel);
    const deleteButton = chip.locator('.MuiChip-deleteIcon, [aria-label*="delete" i]');
    await deleteButton.click();
  }

  /**
   * Clear all tags
   */
  async clearAllTags() {
    const chips = this.getTagChips();
    const count = await chips.count();
    
    for (let i = count - 1; i >= 0; i--) {
      const chip = chips.nth(i);
      const deleteButton = chip.locator('.MuiChip-deleteIcon, [aria-label*="delete" i]');
      await deleteButton.click();
    }
  }

  /**
   * Save the changes and close the dialog
   */
  async save() {
    await this.saveButton.click();
    await this.waitForClose();
  }

  /**
   * Cancel and close the dialog
   */
  async cancel() {
    await this.cancelButton.click();
    await this.waitForClose();
  }

  /**
   * Close the dialog by pressing Escape
   */
  async closeWithEscape() {
    await this.dialog.press('Escape');
    await this.waitForClose();
  }

  /**
   * Get the item name displayed in the dialog
   */
  async getItemName() {
    const itemNameElement = this.dialog.locator('h6, .MuiTypography-h6, .MuiTypography-subtitle1');
    return await itemNameElement.textContent();
  }

  /**
   * Get the item emoji displayed in the dialog
   */
  async getItemEmoji() {
    const emojiElement = this.dialog.locator('span[style*="font-size"], .MuiTypography-root:has-text(/[\\p{Emoji}]/u)');
    return await emojiElement.textContent();
  }

  /**
   * Open the emoji picker
   */
  async openEmojiPicker() {
    await this.emojiPickerButton.click();
  }

  /**
   * Check if the emoji picker is visible
   */
  async isEmojiPickerVisible() {
    const emojiPicker = this.dialog.locator('.emoji-picker, [data-testid="emoji-picker"]');
    return await emojiPicker.isVisible();
  }

  /**
   * Select an emoji from the picker
   */
  async selectEmoji(emoji: string) {
    await this.openEmojiPicker();
    const emojiButton = this.dialog.locator(`button:has-text("${emoji}"), [data-emoji="${emoji}"]`);
    await emojiButton.click();
  }

  // Assertion methods

  /**
   * Assert that the dialog is open
   */
  async expectOpen() {
    await expect(this.dialog).toBeVisible();
  }

  /**
   * Assert that the dialog is closed
   */
  async expectClosed() {
    await expect(this.dialog).not.toBeVisible();
  }

  /**
   * Assert that the dialog has a specific item name
   */
  async expectItemName(itemName: string) {
    const currentName = await this.getItemName();
    expect(currentName).toBe(itemName);
  }

  /**
   * Assert that the dialog has a specific item emoji
   */
  async expectItemEmoji(emoji: string) {
    const currentEmoji = await this.getItemEmoji();
    expect(currentEmoji).toBe(emoji);
  }

  /**
   * Assert that the quantity input has a specific value
   */
  async expectQuantity(quantity: number) {
    const currentQuantity = await this.getQuantity();
    expect(currentQuantity).toBe(quantity);
  }

  /**
   * Assert that a specific tag chip is visible
   */
  async expectTagChip(tagLabel: string) {
    const chip = this.getTagChip(tagLabel);
    await expect(chip).toBeVisible();
  }

  /**
   * Assert that a specific tag chip is not visible
   */
  async expectNoTagChip(tagLabel: string) {
    const chip = this.getTagChip(tagLabel);
    await expect(chip).not.toBeVisible();
  }

  /**
   * Assert that there are a specific number of tag chips
   */
  async expectTagChipCount(count: number) {
    const chips = this.getTagChips();
    await expect(chips).toHaveCount(count);
  }

  /**
   * Assert that the tag chips contain specific labels
   */
  async expectTagChipLabels(expectedLabels: string[]) {
    const actualLabels = await this.getTagChipLabels();
    expect(actualLabels.sort()).toEqual(expectedLabels.sort());
  }

  /**
   * Assert that advanced settings are visible
   */
  async expectAdvancedSettingsVisible() {
    const isVisible = await this.isAdvancedSettingsVisible();
    expect(isVisible).toBe(true);
  }

  /**
   * Assert that advanced settings are not visible
   */
  async expectAdvancedSettingsHidden() {
    const isVisible = await this.isAdvancedSettingsVisible();
    expect(isVisible).toBe(false);
  }

  /**
   * Assert that the save button is enabled
   */
  async expectSaveButtonEnabled() {
    await expect(this.saveButton.getLocator()).toBeEnabled();
  }

  /**
   * Assert that the save button is disabled
   */
  async expectSaveButtonDisabled() {
    await expect(this.saveButton.getLocator()).toBeDisabled();
  }
}
