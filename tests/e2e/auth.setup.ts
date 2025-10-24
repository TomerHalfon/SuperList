import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Setup test that creates authentication state for other tests
 * This test runs once and creates the auth-state.json file
 */
setup('authenticate', async ({ browser }) => {
  // Create a new context and page for authentication
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to login page
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  
  // Verify we're on the login page
  await expect(page).toHaveURL(/.*\/login/);
  
  // Get test credentials from environment
  const email = process.env.TEST_USER_EMAIL || 'test@example.com';
  const password = process.env.TEST_USER_PASSWORD || 'testpassword123';
  
  // Perform login
  await loginPage.login(email, password);
  
  // Wait for successful login (redirect away from login page)
  await loginPage.waitForLoginSuccess();
  
  // Verify we're authenticated by checking we're not on login page
  await expect(page).not.toHaveURL(/.*\/login/);
  
  // Save the storage state to file for other tests to use
  await context.storageState({ path: 'tests/fixtures/auth-state.json' });
  
  // Clean up
  await context.close();
});
