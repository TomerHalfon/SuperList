import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Login page E2E tests
 * Tests the authentication flow and error handling
 */
test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form with all required elements', async () => {
    // Assert that the login form is visible and has all required elements
    await loginPage.expectLoaded();
    await loginPage.expectTitle('Sign In');
    await loginPage.expectSignInButton();
    await loginPage.expectGoogleSignInButton();
    await loginPage.expectSignUpLink();
    
    // Check form fields
    await loginPage.getLoginForm().expectEmail('');
    await loginPage.getLoginForm().expectPassword('');
    await loginPage.getLoginForm().expectRememberMeUnchecked();
  });

  test('should allow user to fill in login credentials', async () => {
    // Fill in the form
    await loginPage.fillEmail('test@example.com');
    await loginPage.fillPassword('testpassword123');
    await loginPage.checkRememberMe();
    
    // Verify the form values
    await loginPage.expectEmail('test@example.com');
    await loginPage.expectPassword('testpassword123');
    await loginPage.expectRememberMeChecked();
  });

  test('should show validation errors for empty fields', async () => {
    // Try to submit empty form
    await loginPage.submit();
    
    // Should show validation errors
    await loginPage.expectEmailError();
    await loginPage.expectPasswordError();
  });

  test('should show error for invalid credentials', async () => {
    // Fill in invalid credentials
    await loginPage.fillCredentials('invalid@example.com', 'wrongpassword');
    await loginPage.submit();
    
    // Should show error message
    await loginPage.waitForLoginError();
    await loginPage.expectError();
  });

  test('should handle successful login', async () => {
    // Use test user credentials
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123';
    
    await loginPage.fillCredentials(testEmail, testPassword);
    await loginPage.submit();
    
    // Should redirect to home page
    await loginPage.waitForLoginSuccess();
    await expect(loginPage.getPage()).toHaveURL(/.*\/$/);
  });

  test('should handle login with remember me checked', async () => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123';
    
    await loginPage.fillCredentials(testEmail, testPassword);
    await loginPage.checkRememberMe();
    await loginPage.submit();
    
    // Should redirect to home page
    await loginPage.waitForLoginSuccess();
    await expect(loginPage.getPage()).toHaveURL(/.*\/$/);
  });

  test('should redirect to signup page when clicking signup link', async () => {
    await loginPage.clickSignUpLink();
    await expect(loginPage.getPage()).toHaveURL(/.*\/signup/);
  });

  test('should handle redirect parameter', async () => {
    // Navigate to login with redirect parameter
    await loginPage.goto('/login?redirect=/lists/123');
    
    // Verify redirect parameter is present
    await loginPage.expectRedirectParam('/lists/123');
    
    // Login should redirect to the specified URL
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123';
    
    await loginPage.fillCredentials(testEmail, testPassword);
    await loginPage.submit();
    
    // Should redirect to the specified URL
    await loginPage.waitForLoginSuccess('/lists/123');
  });

  test('should show loading state during login', async () => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123';
    
    await loginPage.fillCredentials(testEmail, testPassword);
    
    // Submit and wait for loading state to appear
    const submitPromise = loginPage.submit();
    await loginPage.waitForLoading();
    
    // Verify loading state is visible
    await loginPage.expectLoading();
    
    // Wait for login to complete
    await submitPromise;
  });

  test('should disable form during loading', async () => {
    const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com';
    const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123';
    
    await loginPage.fillCredentials(testEmail, testPassword);
    
    // Submit and wait for loading state to appear
    const submitPromise = loginPage.submit();
    await loginPage.waitForLoading();
    
    // Check that form is disabled during loading
    await loginPage.expectDisabled();
    
    // Wait for login to complete
    await submitPromise;
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper ARIA labels and roles
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    
    // Check for proper form structure
    await expect(page.locator('form')).toBeVisible();
  });
});
