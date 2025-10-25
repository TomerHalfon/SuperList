import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.test file for test environment variables
config({ path: resolve(__dirname, '.env.test') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Global timeout for each action */
    actionTimeout: 10000,
    
    /* Global timeout for navigation */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        // Use a single browser for setup to avoid multiple auth state files
        ...devices['Desktop Chrome'],
        // Increase timeouts for auth setup
        actionTimeout: 30000,
        navigationTimeout: 60000,
      },
    },
    // Login tests - run independently without auth setup
    {
      name: 'login-tests-chromium',
      testMatch: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // No storage state - fresh browser context for each test
      },
    },
    {
      name: 'login-tests-firefox',
      testMatch: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        // No storage state - fresh browser context for each test
      },
    },
    {
      name: 'login-tests-webkit',
      testMatch: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Desktop Safari'],
        // No storage state - fresh browser context for each test
      },
    },
    {
      name: 'login-tests-mobile-chrome',
      testMatch: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Pixel 5'],
        // No storage state - fresh browser context for each test
      },
    },
    {
      name: 'login-tests-mobile-safari',
      testMatch: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['iPhone 12'],
        // No storage state - fresh browser context for each test
      },
    },
    // Authenticated tests - use auth setup
    {
      name: 'chromium',
      testIgnore: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        // Use the auth state file created by setup
        storageState: 'tests/fixtures/auth-state.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testIgnore: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'tests/fixtures/auth-state.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      testIgnore: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Desktop Safari'],
        storageState: 'tests/fixtures/auth-state.json',
      },
      dependencies: ['setup'],
    },
    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      testIgnore: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Pixel 5'],
        storageState: 'tests/fixtures/auth-state.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'Mobile Safari',
      testIgnore: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['iPhone 12'],
        storageState: 'tests/fixtures/auth-state.json',
      },
      dependencies: ['setup'],
    },
    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      testIgnore: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge',
        storageState: 'tests/fixtures/auth-state.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'Google Chrome',
      testIgnore: /.*\/auth\/login\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        storageState: 'tests/fixtures/auth-state.json',
      },
      dependencies: ['setup'],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
