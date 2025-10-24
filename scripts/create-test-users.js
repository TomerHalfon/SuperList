#!/usr/bin/env node

/**
 * Script to create test users in Supabase for E2E testing
 * 
 * This script creates the test users needed for E2E tests.
 * Run this script after setting up your test Supabase project.
 * 
 * Usage:
 *   node scripts/create-test-users.js
 * 
 * Environment variables required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.test' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.test file');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
  {
    email: 'test@example.com',
    password: 'testpassword123',
    name: 'Test User 1'
  },
  {
    email: 'test2@example.com',
    password: 'testpassword123',
    name: 'Test User 2'
  }
];

async function createTestUsers() {
  console.log('🚀 Creating test users for E2E tests...\n');

  for (const user of testUsers) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(`✅ User ${user.email} already exists`);
        } else {
          console.error(`❌ Error creating user ${user.email}:`, error.message);
        }
      } else {
        console.log(`✅ User ${user.email} created successfully`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error creating user ${user.email}:`, err.message);
    }
  }

  console.log('\n🎉 Test user creation completed!');
  console.log('\nYou can now run your E2E tests with:');
  console.log('  npx playwright test');
}

// Run the script
createTestUsers().catch(console.error);
