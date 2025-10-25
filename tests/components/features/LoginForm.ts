import { Locator } from '@playwright/test';
import { BaseComponent } from '../BaseComponent';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';

/**
 * Component model for LoginForm feature component
 * Wraps src/components/features/auth/LoginForm.tsx
 */
export class LoginForm extends BaseComponent {
  private emailField: TextField;
  private passwordField: TextField;
  private rememberMeCheckbox: Checkbox;
  private signInButton: Button;
  private googleSignInButton: Button;

  constructor(locator: Locator) {
    super(locator);
    
    // Initialize component models
    this.emailField = new TextField(this.locator.getByLabel('Email'));
    this.passwordField = new TextField(this.locator.getByLabel('Password'));
    this.rememberMeCheckbox = new Checkbox(this.locator.locator('input[type="checkbox"]'));
    this.signInButton = new Button(this.locator.getByRole('button', { name: 'Sign In', exact: true }));
    this.googleSignInButton = new Button(this.locator.getByRole('button', { name: /sign in with google/i }));
  }

  /**
   * Fill the email field
   */
  async fillEmail(email: string) {
    await this.emailField.fill(email);
  }

  /**
   * Fill the password field
   */
  async fillPassword(password: string) {
    await this.passwordField.fill(password);
  }

  /**
   * Fill both email and password fields
   */
  async fillCredentials(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  /**
   * Get the password field (for test access)
   */
  getPasswordField() {
    return this.passwordField;
  }

  /**
   * Check the remember me checkbox
   */
  async checkRememberMe() {
    await this.rememberMeCheckbox.check();
  }

  /**
   * Uncheck the remember me checkbox
   */
  async uncheckRememberMe() {
    await this.rememberMeCheckbox.uncheck();
  }

  /**
   * Toggle the remember me checkbox
   */
  async toggleRememberMe() {
    await this.rememberMeCheckbox.toggle();
  }

  /**
   * Check if remember me is checked
   */
  async isRememberMeChecked() {
    return await this.rememberMeCheckbox.isChecked();
  }

  /**
   * Submit the form by clicking the sign in button
   */
  async submit() {
    await this.signInButton.click();
  }

  /**
   * Click the Google sign in button
   */
  async clickGoogleSignIn() {
    await this.googleSignInButton.click();
  }

  /**
   * Get the current email value
   */
  async getEmail() {
    return await this.emailField.getValue();
  }

  /**
   * Get the current password value
   */
  async getPassword() {
    return await this.passwordField.getValue();
  }

  /**
   * Get the error message (if any)
   */
  async getErrorMessage() {
    const errorAlert = this.locator.getByTestId('login-error-alert');
    if (await errorAlert.isVisible()) {
      return await errorAlert.textContent();
    }
    return null;
  }

  /**
   * Check if there's an error message displayed
   */
  async hasError() {
    const errorAlert = this.locator.getByTestId('login-error-alert');
    return await errorAlert.isVisible();
  }

  /**
   * Get the form title
   */
  async getTitle() {
    const titleElement = this.locator.locator('h1, h2, h3, h4, h5, h6');
    if (await titleElement.isVisible()) {
      return await titleElement.textContent();
    }
    return null;
  }

  /**
   * Check if the form is in loading state
   */
  async isLoading() {
    return await this.signInButton.isLoading();
  }

  /**
   * Wait for the form to enter loading state
   */
  async waitForLoading(timeout: number = 5000) {
    await this.signInButton.waitForLoading(timeout);
  }

  /**
   * Check if the Google sign in is in loading state
   */
  async isGoogleSignInLoading() {
    return await this.googleSignInButton.isLoading();
  }

  /**
   * Check if the form is disabled
   */
  async isDisabled() {
    return await this.emailField.isDisabled() && 
           await this.passwordField.isDisabled() && 
           await this.signInButton.isDisabled();
  }

  /**
   * Clear all form fields
   */
  async clear() {
    await this.emailField.clear();
    await this.passwordField.clear();
    await this.uncheckRememberMe();
  }

  /**
   * Focus the email field
   */
  async focusEmail() {
    await this.emailField.focus();
  }

  /**
   * Focus the password field
   */
  async focusPassword() {
    await this.passwordField.focus();
  }

  /**
   * Press Tab to move to next field
   */
  async pressTab() {
    await this.locator.press('Tab');
  }

  /**
   * Press Enter to submit the form
   */
  async pressEnter() {
    await this.locator.press('Enter');
  }

  /**
   * Get the email field validation state
   */
  async getEmailValidationState() {
    return {
      hasError: await this.emailField.hasError(),
      errorMessage: await this.emailField.getErrorMessage(),
      helperText: await this.emailField.getHelperText()
    };
  }

  /**
   * Get the password field validation state
   */
  async getPasswordValidationState() {
    return {
      hasError: await this.passwordField.hasError(),
      errorMessage: await this.passwordField.getErrorMessage(),
      helperText: await this.passwordField.getHelperText()
    };
  }

  /**
   * Complete login flow with credentials
   */
  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.fillCredentials(email, password);
    if (rememberMe) {
      await this.checkRememberMe();
    }
    await this.submit();
  }

  /**
   * Assert that the form is visible
   */
  async expectVisible() {
    await super.expectVisible();
  }

  /**
   * Assert that the form is hidden
   */
  async expectHidden() {
    await this.expectHidden();
  }

  /**
   * Assert that the form has a specific title
   */
  async expectTitle(title: string) {
    const currentTitle = await this.getTitle();
    if (currentTitle !== title) {
      throw new Error(`Expected form title to be "${title}" but got "${currentTitle}"`);
    }
  }

  /**
   * Assert that the email field has a specific value
   */
  async expectEmail(email: string) {
    await this.emailField.expectValue(email);
  }

  /**
   * Assert that the password field has a specific value
   */
  async expectPassword(password: string) {
    await this.passwordField.expectValue(password);
  }

  /**
   * Assert that remember me is checked
   */
  async expectRememberMeChecked() {
    await this.rememberMeCheckbox.expectChecked();
  }

  /**
   * Assert that remember me is unchecked
   */
  async expectRememberMeUnchecked() {
    await this.rememberMeCheckbox.expectUnchecked();
  }

  /**
   * Assert that there's an error message
   */
  async expectError() {
    const hasError = await this.hasError();
    if (!hasError) {
      throw new Error('Expected form to have an error message');
    }
  }

  /**
   * Assert that there's no error message
   */
  async expectNoError() {
    const hasError = await this.hasError();
    if (hasError) {
      throw new Error('Expected form to not have an error message');
    }
  }

  /**
   * Assert that there's a specific error message
   */
  async expectErrorMessage(message: string) {
    const errorMessage = await this.getErrorMessage();
    if (errorMessage !== message) {
      throw new Error(`Expected error message to be "${message}" but got "${errorMessage}"`);
    }
  }

  /**
   * Assert that the form is in loading state
   */
  async expectLoading() {
    const isLoading = await this.isLoading();
    if (!isLoading) {
      throw new Error('Expected form to be in loading state');
    }
  }

  /**
   * Assert that the form is not in loading state
   */
  async expectNotLoading() {
    const isLoading = await this.isLoading();
    if (isLoading) {
      throw new Error('Expected form to not be in loading state');
    }
  }

  /**
   * Assert that the form is disabled
   */
  async expectDisabled() {
    const isDisabled = await this.isDisabled();
    if (!isDisabled) {
      throw new Error('Expected form to be disabled');
    }
  }

  /**
   * Assert that the form is enabled
   */
  async expectEnabled() {
    const isDisabled = await this.isDisabled();
    if (isDisabled) {
      throw new Error('Expected form to be enabled');
    }
  }

  /**
   * Assert that the sign in button is visible
   */
  async expectSignInButton() {
    await this.signInButton.expectVisible();
  }

  /**
   * Assert that the Google sign in button is visible
   */
  async expectGoogleSignInButton() {
    await this.googleSignInButton.expectVisible();
  }

  /**
   * Assert that the email field has an error
   */
  async expectEmailError() {
    await this.emailField.expectError();
  }

  /**
   * Assert that the password field has an error
   */
  async expectPasswordError() {
    await this.passwordField.expectError();
  }

  /**
   * Assert that the email field has no error
   */
  async expectNoEmailError() {
    await this.emailField.expectNoError();
  }

  /**
   * Assert that the password field has no error
   */
  async expectNoPasswordError() {
    await this.passwordField.expectNoError();
  }
}
