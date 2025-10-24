# E2E Test Setup Guide

This guide explains how to set up and run the E2E tests for the SuperList application.

## Prerequisites

1. **Test Supabase Project**: Create a separate Supabase project for testing to avoid polluting your development data.

2. **Test Users**: Create test users in your test Supabase project with the following credentials:
   - Email: `test@example.com`, Password: `testpassword123`
   - Email: `test2@example.com`, Password: `testpassword123`

## Environment Setup

1. **Copy the environment template**:
   ```bash
   cp env.test.example .env.test
   ```

2. **Configure your test environment** in `.env.test`:
   ```bash
   # Test Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-test-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-supabase-anon-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Test User Credentials (create these users in your test Supabase project)
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=testpassword123
   TEST_USER_2_EMAIL=test2@example.com
   TEST_USER_2_PASSWORD=testpassword123

   # Storage Configuration for Tests
   STORAGE_TYPE=supabase
   ```

## Running Tests

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Run the E2E tests**:
   ```bash
   # Run all tests
   npx playwright test

   # Run specific test file
   npx playwright test tests/e2e/auth/auth-verification.spec.ts

   # Run tests in headed mode (see browser)
   npx playwright test --headed

   # Run tests in debug mode
   npx playwright test --debug
   ```

## Test Structure

- **Setup**: `tests/e2e/auth.setup.ts` - Creates authentication state for all tests
- **Auth Tests**: `tests/e2e/auth/` - Authentication-related tests
- **Feature Tests**: `tests/e2e/items/`, `tests/e2e/lists/` - Feature-specific tests
- **Fixtures**: `tests/fixtures/` - Reusable test utilities and data
- **Page Objects**: `tests/pages/` - Page object models for test pages
- **Components**: `tests/components/` - Component models for test components

## Authentication Flow

1. **Setup Phase**: The `auth.setup.ts` test runs first and:
   - Logs in with test credentials
   - Saves authentication state to `tests/fixtures/auth-state.json`
   - This state is reused by all other tests

2. **Test Phase**: Each test project:
   - Loads the saved authentication state
   - Verifies authentication is working
   - Runs the actual test scenarios

## Troubleshooting

### Tests stuck on login page
- Verify your `.env.test` file has correct Supabase credentials
- Ensure test users exist in your test Supabase project
- Check that `STORAGE_TYPE=supabase` is set in `.env.test`

### Authentication failures
- Verify the test users have the correct email/password
- Check that the Supabase project is accessible
- Ensure the development server is running on the correct port

### Test data issues
- Tests use a separate test Supabase project to avoid data conflicts
- Test data is cleaned up after each test run
- Use the `TEST_DATA_PREFIX=e2e_test_` to identify test data

## Test Data Management

- Tests create their own data and clean it up afterward
- Use the `TestDataFactory` and `TestDataUtils` for consistent test data
- Test data is prefixed with `e2e_test_` for easy identification
- All test data is cleaned up automatically after test completion
