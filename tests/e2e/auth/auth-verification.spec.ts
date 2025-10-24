import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

/**
 * Authentication verification tests
 * These tests verify that the authentication setup is working correctly
 */
test.describe('Authentication Verification', () => {
  test('should be authenticated and able to access protected routes', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to home page
    await homePage.goto();
    
    // Verify we're not redirected to login page
    await expect(page).not.toHaveURL(/.*\/login/);
    
    // Verify we can see authenticated content
    // Check for the create list floating action button
    await expect(page.locator('button[aria-label="Create new shopping list"]')).toBeVisible();
  });

  test('should be able to create a shopping list when authenticated', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Navigate to home page
    await homePage.goto();
    
    // Verify we can access the create list functionality
    await homePage.clickCreateList();
    
    // Verify we're not redirected to login
    await expect(page).not.toHaveURL(/.*\/login/);
  });

  test('should be able to access list detail pages when authenticated', async ({ page }) => {
    // Navigate to a list detail page (this should work if authenticated)
    await page.goto('/lists/test-list-id');
    
    // Verify we're not redirected to login
    await expect(page).not.toHaveURL(/.*\/login/);
  });
});
