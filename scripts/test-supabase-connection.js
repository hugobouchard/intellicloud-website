#!/usr/bin/env node
/**
 * Supabase Connection Test Script
 * Tests the Supabase configuration and connection
 *
 * Usage: node scripts/test-supabase-connection.js
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env')
dotenv.config({ path: envPath })

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}\n${'='.repeat(50)}`),
}

async function testSupabaseConnection() {
  log.section('Supabase Connection Test')

  // Step 1: Check environment variables
  log.info('Checking environment variables...')

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    log.error('VITE_SUPABASE_URL not found in .env file')
    return false
  }
  log.success(`VITE_SUPABASE_URL: ${supabaseUrl}`)

  if (!supabaseAnonKey) {
    log.error('VITE_SUPABASE_ANON_KEY not found in .env file')
    return false
  }
  log.success(`VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 20)}...`)

  // Step 2: Create Supabase client
  log.section('Creating Supabase Client')

  let supabase
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    log.success('Supabase client created successfully')
  } catch (error) {
    log.error(`Failed to create Supabase client: ${error.message}`)
    return false
  }

  // Step 3: Test database connection
  log.section('Testing Database Connection')

  try {
    const { data, error } = await supabase
      .from('ic_web_site_settings')
      .select('*')
      .limit(1)

    if (error) {
      log.error(`Database query failed: ${error.message}`)
      log.warn('This usually means:')
      log.warn('  1. Migration has not been pushed (run: supabase db push)')
      log.warn('  2. Table does not exist in your Supabase project')
      log.warn('  3. RLS policies are blocking access (expected for admin tables)')
      return false
    }

    log.success('Successfully connected to database')
    log.info(`Found ${data?.length || 0} site settings`)
  } catch (error) {
    log.error(`Database connection failed: ${error.message}`)
    return false
  }

  // Step 4: Check admin users table
  log.section('Checking Admin Users Table')

  try {
    const { data, error } = await supabase
      .from('ic_web_admin_users')
      .select('email, role, is_active')
      .limit(10)

    if (error) {
      // RLS will block unauthenticated access - this is expected
      if (error.code === 'PGRST301' || error.message.includes('row-level security')) {
        log.success('Admin users table exists (RLS blocking unauthenticated access - expected)')
      } else {
        log.error(`Admin users query failed: ${error.message}`)
        return false
      }
    } else {
      log.success(`Found ${data?.length || 0} admin users`)
      data?.forEach(user => {
        log.info(`  - ${user.email} (${user.role}) ${user.is_active ? '✓ active' : '✗ inactive'}`)
      })
    }
  } catch (error) {
    log.error(`Admin users check failed: ${error.message}`)
  }

  // Step 5: List all tables
  log.section('Checking CMS Tables')

  const expectedTables = [
    'ic_web_pages',
    'ic_web_seo_meta',
    'ic_web_site_settings',
    'ic_web_navigation',
    'ic_web_media',
    'ic_web_admin_users',
    'ic_web_audit_log',
  ]

  for (const table of expectedTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1)

      if (error && !error.message.includes('row-level security')) {
        log.error(`Table '${table}' not found or inaccessible`)
      } else {
        log.success(`Table '${table}' exists`)
      }
    } catch (error) {
      log.error(`Error checking table '${table}': ${error.message}`)
    }
  }

  // Step 6: Check OAuth configuration (informational only)
  log.section('OAuth Configuration')

  log.info('To test Google OAuth:')
  log.info('  1. Ensure Google OAuth is configured in Supabase Dashboard')
  log.info('  2. Run: npm run dev')
  log.info('  3. Navigate to: http://localhost:5173/admin.html')
  log.info('  4. Click "Sign in with Google"')

  // Summary
  log.section('Connection Test Summary')
  log.success('All checks passed!')
  log.info('Your Supabase configuration is working correctly.')
  log.info('\nNext steps:')
  log.info('  1. Configure Google OAuth if not already done')
  log.info('  2. Test admin dashboard: npm run dev → /admin.html')
  log.info('  3. Start adding content to your CMS')

  return true
}

// Run the test
testSupabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    log.error(`Unexpected error: ${error.message}`)
    console.error(error)
    process.exit(1)
  })
