import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginForm } from '../components/features/LoginForm';

/**
 * Page object model for the Login page
 * Represents /login route
 */
export class LoginPage extends BasePage {
  private loginForm: LoginForm;

  constructor(page: Page) {
    super(page);
    this.loginForm = new LoginForm(page.locator('form'));
  }

  /**
   * Get the URL path for this page
   */
  getUrl(): string {
    return '/login';
  }

  /**
   * Navigate to the login page
   */
  async goto(url?: string) {
    await super.goto(url);
    await this.waitForLoad();
  }

  /**
   * Get the login form component
   */
  getLoginForm() {
    return this.loginForm;
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string) {
    await this.loginForm.fillEmail(email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string) {
    await this.loginForm.fillPassword(password);
  }

  /**
   * Fill both email and password
   */
  async fillCredentials(email: string, password: string) {
    await this.loginForm.fillCredentials(email, password);
  }

  /**
   * Check remember me checkbox
   */
  async checkRememberMe() {
    await this.loginForm.checkRememberMe();
  }

  /**
   * Uncheck remember me checkbox
   */
  async uncheckRememberMe() {
    await this.loginForm.uncheckRememberMe();
  }

  /**
   * Submit the login form
   */
  async submit() {
    await this.loginForm.submit();
  }

  /**
   * Click Google sign in button
   */
  async clickGoogleSignIn() {
    await this.loginForm.clickGoogleSignIn();
  }

  /**
   * Complete login flow
   */
  async login(email: string, password: string, rememberMe: boolean = false) {
    await this.loginForm.login(email, password, rememberMe);
  }

  /**
   * Get the current email value
   */
  async getEmail() {
    return await this.loginForm.getEmail();
  }

  /**
   * Get the current password value
   */
  async getPassword() {
    return await this.loginForm.getPassword();
  }

  /**
   * Get error message if any
   */
  async getErrorMessage() {
    return await this.loginForm.getErrorMessage();
  }

  /**
   * Check if there's an error
   */
  async hasError() {
    return await this.loginForm.hasError();
  }

  /**
   * Get the page title
   */
  async getPageTitle() {
    return await this.loginForm.getTitle();
  }

  /**
   * Check if the form is loading
   */
  async isLoading() {
    return await this.loginForm.isLoading();
  }

  /**
   * Check if Google sign in is loading
   */
  async isGoogleSignInLoading() {
    return await this.loginForm.isGoogleSignInLoading();
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.loginForm.clear();
  }

  /**
   * Check if remember me is checked
   */
  async isRememberMeChecked() {
    return await this.loginForm.isRememberMeChecked();
  }

  /**
   * Get the redirect parameter from URL
   */
  getRedirectParam() {
    const url = new URL(this.page.url());
    return url.searchParams.get('redirect');
  }

  /**
   * Check if there's a redirect parameter
   */
  hasRedirectParam() {
    return this.getRedirectParam() !== null;
  }

  /**
   * Get the sign up link
   */
  getSignUpLink() {
    return this.page.locator('a[href*="/signup"]');
  }

  /**
   * Focus the email field
   */
  async focusEmail() {
    await this.loginForm.focusEmail();
  }

  /**
   * Press Tab key
   */
  async pressTab() {
    await this.page.keyboard.press('Tab');
  }

  /**
   * Press Enter key
   */
  async pressEnter() {
    await this.page.keyboard.press('Enter');
  }

  /**
   * Click the sign up link
   */
  async clickSignUpLink() {
    await this.getSignUpLink().click();
  }

  /**
   * Get the forgot password link (if exists)
   */
  getForgotPasswordLink() {
    return this.page.locator('a[href*="/forgot-password"]');
  }

  /**
   * Click the forgot password link
   */
  async clickForgotPasswordLink() {
    await this.getForgotPasswordLink().click();
  }

  /**
   * Wait for successful login (redirect to home or specified redirect)
   */
  async waitForLoginSuccess(redirectUrl?: string) {
    if (redirectUrl) {
      await this.waitForUrl(redirectUrl);
    } else {
      // Wait for redirect away from login page
      await this.page.waitForURL(url => !url.pathname.includes('/login'));
    }
  }

  /**
   * Wait for login error to appear
   */
  async waitForLoginError() {
    await this.page.waitForSelector('[role="alert"]', { state: 'visible' });
  }

  /**
   * Assert that the page is loaded
   */
  async expectLoaded() {
    await this.expectUrl(/.*\/login/);
    await this.loginForm.expectVisible();
  }

  /**
   * Assert that the page has a specific title
   */
  async expectTitle(title: string) {
    await this.loginForm.expectTitle(title);
  }

  /**
   * Assert that the email field has a specific value
   */
  async expectEmail(email: string) {
    await this.loginForm.expectEmail(email);
  }

  /**
   * Assert that the password field has a specific value
   */
  async expectPassword(password: string) {
    await this.loginForm.expectPassword(password);
  }

  /**
   * Assert that remember me is checked
   */
  async expectRememberMeChecked() {
    await this.loginForm.expectRememberMeChecked();
  }

  /**
   * Assert that remember me is unchecked
   */
  async expectRememberMeUnchecked() {
    await this.loginForm.expectRememberMeUnchecked();
  }

  /**
   * Assert that there's an error message
   */
  async expectError() {
    await this.loginForm.expectError();
  }

  /**
   * Assert that there's no error message
   */
  async expectNoError() {
    await this.loginForm.expectNoError();
  }

  /**
   * Assert that there's a specific error message
   */
  async expectErrorMessage(message: string) {
    await this.loginForm.expectErrorMessage(message);
  }

  /**
   * Assert that the form is in loading state
   */
  async expectLoading() {
    await this.loginForm.expectLoading();
  }

  /**
   * Assert that the form is not in loading state
   */
  async expectNotLoading() {
    await this.loginForm.expectNotLoading();
  }

  /**
   * Assert that the form is disabled
   */
  async expectDisabled() {
    await this.loginForm.expectDisabled();
  }

  /**
   * Assert that the form is enabled
   */
  async expectEnabled() {
    await this.loginForm.expectEnabled();
  }

  /**
   * Assert that the sign in button is visible
   */
  async expectSignInButton() {
    await this.loginForm.expectSignInButton();
  }

  /**
   * Assert that the Google sign in button is visible
   */
  async expectGoogleSignInButton() {
    await this.loginForm.expectGoogleSignInButton();
  }

  /**
   * Assert that the sign up link is visible
   */
  async expectSignUpLink() {
    await expect(this.getSignUpLink()).toBeVisible();
  }

  /**
   * Assert that the forgot password link is visible
   */
  async expectForgotPasswordLink() {
    await expect(this.getForgotPasswordLink()).toBeVisible();
  }

  /**
   * Assert that there's a redirect parameter
   */
  async expectRedirectParam(expectedRedirect: string) {
    const redirect = this.getRedirectParam();
    if (redirect !== expectedRedirect) {
      throw new Error(`Expected redirect parameter to be "${expectedRedirect}" but got "${redirect}"`);
    }
  }

  /**
   * Assert that the email field has an error
   */
  async expectEmailError() {
    await this.loginForm.expectEmailError();
  }

  /**
   * Assert that the password field has an error
   */
  async expectPasswordError() {
    await this.loginForm.expectPasswordError();
  }

  /**
   * Assert that the email field has no error
   */
  async expectNoEmailError() {
    await this.loginForm.expectNoEmailError();
  }

  /**
   * Assert that the password field has no error
   */
  async expectNoPasswordError() {
    await this.loginForm.expectNoPasswordError();
  }
}
