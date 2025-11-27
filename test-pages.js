import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env
function loadEnv() {
  const envPath = path.join(__dirname, '.env')
  const content = fs.readFileSync(envPath, 'utf-8')
  const lines = content.split('\n')

  const env = {}
  lines.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^['"']|['"']$/g, '')
      env[key] = value
    }
  })
  return env
}

const env = loadEnv()
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// Test some slugs
const testSlugs = ['home', 'cloud-technology', 'cloud-engineering']

console.log('Testing page retrieval...\n')

for (const slug of testSlugs) {
  const { data, error } = await supabase
    .from('ic_web_pages')
    .select('slug, title, description, content')
    .eq('slug', slug)
    .eq('language', 'en')
    .eq('status', 'published')
    .single()

  if (data) {
    console.log(`✓ Found: ${slug}`)
    console.log(`  Title: ${data.title}`)
    const headline = data.content && data.content.headline
      ? data.content.headline.substring(0, 50)
      : 'empty'
    console.log(`  Content headline: ${headline}`)
  } else {
    console.log(`✗ Not found: ${slug}`)
    if (error) console.log(`  Error: ${error.message}`)
  }
  console.log('')
}

// Count total pages
const { data: countResult, error: countError } = await supabase
  .from('ic_web_pages')
  .select('slug, title', { count: 'exact' })
  .eq('status', 'published')

console.log(`\nTotal published pages: ${countResult ? countResult.length : 0}`)

if (countResult && countResult.length > 0) {
  console.log('Sample pages:')
  countResult.slice(0, 10).forEach(p => {
    console.log(`  - ${p.slug}: ${p.title}`)
  })
}
