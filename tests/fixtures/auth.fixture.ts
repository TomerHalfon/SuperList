import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Authentication fixture that provides authenticated pages
 * Uses Playwright storage state to persist session across tests
 */

// Test user credentials from environment variables
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';
const TEST_USER_2_EMAIL = process.env.TEST_USER_2_EMAIL || 'test2@example.com';
const TEST_USER_2_PASSWORD = process.env.TEST_USER_2_PASSWORD || 'testpassword123';

/**
 * Setup project that logs in once and stores the auth state
 */
export const setup = base.extend({
  // This fixture will be used by the setup project
  storageState: async ({ browser }, use) => {
    // Create a new context and page for authentication
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to login page
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Perform login
    await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    
    // Wait for successful login (redirect away from login page)
    await loginPage.waitForLoginSuccess();
    
    // Save the storage state
    const storageState = await context.storageState();
    await context.close();
    
    // Use the storage state
    await use(storageState);
  },
});

/**
 * Authenticated page fixture that reuses stored auth state
 */
export const authenticatedPage = base.extend({
  // Use the storage state from the setup project
  page: async ({ browser }, use) => {
    // Create a new context with the stored auth state
    const context = await browser.newContext({
      storageState: 'tests/fixtures/auth-state.json'
    });
    
    // Create a new page
    const page = await context.newPage();
    
    // Verify authentication by navigating to a protected route
    await page.goto('/');
    
    // Check if we're redirected to login (authentication failed)
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      throw new Error('Authentication failed - user was redirected to login page');
    }
    
    // Use the page
    await use(page);
    
    // Clean up
    await context.close();
  },
});

/**
 * Authenticated page fixture for second test user
 */
export const authenticatedPageUser2 = base.extend({
  page: async ({ browser }, use) => {
    // Create a new context and page for second user authentication
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to login page
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Perform login with second user
    await loginPage.login(TEST_USER_2_EMAIL, TEST_USER_2_PASSWORD);
    
    // Wait for successful login
    await loginPage.waitForLoginSuccess();
    
    // Use the page (keep context open for the test)
    await use(page);
    
    // Clean up after test
    await context.close();
  },
});

/**
 * Helper function to create authenticated context
 */
export async function createAuthenticatedContext(browser: any, userEmail?: string, userPassword?: string) {
  const email = userEmail || TEST_USER_EMAIL;
  const password = userPassword || TEST_USER_PASSWORD;
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);
  await loginPage.waitForLoginSuccess();
  
  return context;
}

/**
 * Helper function to login and get storage state
 */
export async function getAuthStorageState(browser: any, userEmail?: string, userPassword?: string) {
  const context = await createAuthenticatedContext(browser, userEmail, userPassword);
  const storageState = await context.storageState();
  await context.close();
  return storageState;
}

/**
 * Helper function to verify user is authenticated
 */
export async function verifyAuthentication(page: any) {
  // Check if we're on a protected route and not redirected to login
  const url = page.url();
  if (url.includes('/login')) {
    throw new Error('User is not authenticated - redirected to login page');
  }
  
  // Check for user menu or authenticated user indicators
  const userMenu = page.locator('[data-testid="user-menu-button"], button[aria-label*="user"]');
  if (await userMenu.isVisible()) {
    return true;
  }
  
  // Alternative check - look for logout button or user-specific content
  const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout")');
  if (await logoutButton.isVisible()) {
    return true;
  }
  
  throw new Error('User authentication could not be verified');
}

/**
 * Helper function to logout
 */
export async function logout(page: any) {
  // Click user menu
  const userMenu = page.locator('[data-testid="user-menu-button"], button[aria-label*="user"]');
  await userMenu.click();
  
  // Click logout button
  const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout")');
  await logoutButton.click();
  
  // Wait for redirect to login page
  await page.waitForURL(/.*\/login/);
}

/**
 * Helper function to switch between users
 */
export async function switchUser(page: any, userEmail: string, userPassword: string) {
  // First logout current user
  await logout(page);
  
  // Login with new user
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(userEmail, userPassword);
  await loginPage.waitForLoginSuccess();
}

/**
 * Test user credentials
 */
export const testUsers = {
  user1: {
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD
  },
  user2: {
    email: TEST_USER_2_EMAIL,
    password: TEST_USER_2_PASSWORD
  }
};

/**
 * Helper function to get test user credentials
 */
export function getTestUser(user: 'user1' | 'user2' = 'user1') {
  return testUsers[user];
}

/**
 * Helper function to create a test user context
 */
export async function createTestUserContext(browser: any, user: 'user1' | 'user2' = 'user1') {
  const credentials = getTestUser(user);
  return await createAuthenticatedContext(browser, credentials.email, credentials.password);
}

/**
 * Helper function to get test user storage state
 */
export async function getTestUserStorageState(browser: any, user: 'user1' | 'user2' = 'user1') {
  const credentials = getTestUser(user);
  return await getAuthStorageState(browser, credentials.email, credentials.password);
}

/**
 * Setup test that creates auth state file
 * This should be run once before other tests
 */
export const authSetup = setup.extend({
  // This will create the auth-state.json file
  storageState: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    await loginPage.waitForLoginSuccess();
    
    // Save storage state to file
    await context.storageState({ path: 'tests/fixtures/auth-state.json' });
    const storageState = await context.storageState();
    
    await context.close();
    await use(storageState);
  },
});

/**
 * Export the base test with auth fixtures
 */
export { test } from '@playwright/test';
