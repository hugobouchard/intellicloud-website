import { createClient } from '@supabase/supabase-js'

// For testing, we'll use the credentials directly
// In production, these should come from .env file
const supabaseUrl = 'https://qbvtpfcfcxgrusfxfqhd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFidnRwZmNmY3hncnVzZnhmcWhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODI4NjcsImV4cCI6MjA3Nzg1ODg2N30.xwyXGBaiidJnBaCqUJusFvnImB5LYh4_wZj2nhs7KRw'

console.log('Testing admin access check...')
console.log('Supabase URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey?.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

async function testAdminAccess() {
  try {
    console.log('\n1. Checking for existing sessions...')
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Current session:', session ? 'Active' : 'None')

    console.log('\n2. Querying ic_web_admin_users table...')
    const { data, error, status } = await supabase
      .from('ic_web_admin_users')
      .select('*')

    if (error) {
      console.error('Error querying table:')
      console.error('  Status:', status)
      console.error('  Code:', error.code)
      console.error('  Message:', error.message)
      return
    }

    console.log('Success! Found', data?.length || 0, 'admin users:')
    data?.forEach(user => {
      console.log(`  - ${user.email} (${user.role}, active: ${user.is_active})`)
    })

    console.log('\n3. Checking specific user (hugo@intellicloud.com)...')
    const { data: hugoData, error: hugoError } = await supabase
      .from('ic_web_admin_users')
      .select('*')
      .eq('email', 'hugo@intellicloud.com')
      .eq('is_active', true)
      .single()

    if (hugoError) {
      console.error('Error querying hugo user:')
      console.error('  Status:', hugoError.code)
      console.error('  Message:', hugoError.message)
      return
    }

    console.log('Found hugo user:', hugoData)

  } catch (err) {
    console.error('Exception:', err)
  }
}

testAdminAccess()
