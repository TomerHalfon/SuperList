import { test as setup, expect } from '@playwright/test';
import { authSetup } from '../fixtures/auth.fixture';

/**
 * Setup test that creates authentication state for other tests
 * This test runs once and creates the auth-state.json file
 */
setup('authenticate', async ({ page }) => {
  // This test will create the auth state file
  // The authSetup fixture handles the login process
  await page.goto('/');
  
  // Verify we're redirected to login page
  await expect(page).toHaveURL(/.*\/login/);
  
  // The authSetup fixture will handle the login and save the state
  // This test just needs to run to trigger the setup
});
