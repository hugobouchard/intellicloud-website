#!/usr/bin/env node

/**
 * IntelliCloud Site Structure Import Script
 * Transforms hierarchical JSON site structure into Supabase tables
 *
 * Usage: node scripts/import-site-structure.js <path-to-json-file>
 * Example: node scripts/import-site-structure.js data/site-structure.json
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env file manually
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env')
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found at', envPath)
    process.exit(1)
  }

  const content = fs.readFileSync(envPath, 'utf-8')
  const lines = content.split('\n')

  lines.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      process.env[key] = value
    }
  })
}

loadEnv()

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env')
  console.error('   Get SUPABASE_SERVICE_ROLE_KEY from Supabase Project Settings → API')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Load and parse JSON file
 */
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`❌ Error loading JSON: ${error.message}`)
    process.exit(1)
  }
}

/**
 * Generate slug from node ID (alphanumeric + hyphens)
 */
function generateSlug(nodeId) {
  return nodeId.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

/**
 * Recursively flatten hierarchical nodes into flat array
 * Returns: { node, parent_id, depth, order_position }
 */
function flattenNodes(nodes, parentId = null, depth = 0, order = {}) {
  const flattened = []

  nodes.forEach((node, index) => {
    const nodeData = {
      ...node,
      parent_id: parentId,
      depth,
      order_position: index,
      children_count: node.children?.length || 0
    }

    flattened.push(nodeData)

    // Recursively flatten children
    if (node.children && node.children.length > 0) {
      flattened.push(...flattenNodes(node.children, node.id, depth + 1, order))
    }
  })

  return flattened
}

/**
 * Transform node into page object
 */
function nodeToPage(node, language = 'en') {
  return {
    slug: generateSlug(node.id),
    language,
    title: node.title || 'Untitled',
    description: node.description || '',
    content: {
      headline: node.headline || node.title || '',
      excerpt: node.description || '',
      call_to_action: node.call_to_action || '',
      node_id: node.id,
      depth: node.depth,
      children_count: node.children_count || 0
    },
    status: 'published',
    created_by: 'import@script.local',
    updated_by: 'import@script.local'
  }
}

/**
 * Transform node into navigation item
 */
function nodeToNavigation(node, menuKey = 'main', language = 'en') {
  const url = node.id === 'home' ? '/' : `/${node.id.replace(/--/g, '/')}`

  return {
    menu_key: menuKey,
    language,
    label: node.title || 'Untitled',
    url,
    parent_id: node.parent_id ? generateSlug(node.parent_id) : null,
    order_position: node.order_position || 0,
    icon: null,
    is_external: false,
    is_active: true
  }
}

/**
 * Validate slug uniqueness
 */
function validateUniqueSlugs(pages) {
  const slugs = new Set()
  const duplicates = []

  pages.forEach(page => {
    if (slugs.has(page.slug)) {
      duplicates.push(page.slug)
    }
    slugs.add(page.slug)
  })

  if (duplicates.length > 0) {
    console.warn(`⚠️  Warning: ${duplicates.length} duplicate slugs found:`, duplicates)
    return false
  }

  return true
}

/**
 * Validate parent_id references
 */
function validateNavHierarchy(navItems) {
  const ids = new Set(navItems.map(item => item.label))
  const issues = []

  navItems.forEach(item => {
    if (item.parent_id && !ids.has(item.parent_id)) {
      issues.push(`Navigation item "${item.label}" references non-existent parent: ${item.parent_id}`)
    }
  })

  if (issues.length > 0) {
    console.warn(`⚠️  Validation warnings: ${issues.length} parent references may be invalid`)
    issues.slice(0, 5).forEach(issue => console.warn(`   - ${issue}`))
    return false
  }

  return true
}

/**
 * Check for circular references in navigation
 */
function detectCircularReferences(navItems) {
  const findCycle = (itemLabel, visited = new Set()) => {
    if (visited.has(itemLabel)) return true
    visited.add(itemLabel)

    const item = navItems.find(i => i.label === itemLabel)
    if (!item || !item.parent_id) return false

    return findCycle(item.parent_id, new Set(visited))
  }

  const cycles = []
  navItems.forEach(item => {
    if (item.parent_id && findCycle(item.label)) {
      cycles.push(item.label)
    }
  })

  if (cycles.length > 0) {
    console.error(`❌ Circular references detected: ${cycles.join(', ')}`)
    return false
  }

  return true
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Import pages to Supabase in batches
 */
async function importPages(pages, batchSize = 100) {
  console.log(`\n📄 Importing ${pages.length} pages...`)

  let imported = 0
  let errors = 0

  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize)

    try {
      const { data, error } = await supabase
        .from('ic_web_pages')
        .insert(batch)

      if (error) {
        console.error(`❌ Batch ${i / batchSize + 1} failed:`, error.message)
        errors += batch.length
      } else {
        imported += batch.length
        console.log(`   ✓ Batch ${i / batchSize + 1}: ${batch.length} pages imported`)
      }
    } catch (err) {
      console.error(`❌ Batch error: ${err.message}`)
      errors += batch.length
    }
  }

  console.log(`✓ Pages import complete: ${imported} succeeded, ${errors} failed`)
  return { imported, errors }
}

/**
 * Import navigation items to Supabase in two passes:
 * 1. Insert all items without parent_id
 * 2. Update parent_id references
 */
async function importNavigation(navItems, batchSize = 100) {
  console.log(`\n🗂️  Importing ${navItems.length} navigation items...`)

  // First pass: Insert items without parent_id to create rows
  const itemsWithoutParent = navItems.map(item => ({
    ...item,
    parent_id: null  // Set to null initially
  }))

  let imported = 0
  let errors = 0

  for (let i = 0; i < itemsWithoutParent.length; i += batchSize) {
    const batch = itemsWithoutParent.slice(i, i + batchSize)

    try {
      const { data, error } = await supabase
        .from('ic_web_navigation')
        .insert(batch)

      if (error) {
        console.error(`❌ Batch ${i / batchSize + 1} failed:`, error.message)
        errors += batch.length
      } else {
        imported += batch.length
        console.log(`   ✓ Batch ${i / batchSize + 1}: ${batch.length} items imported`)
      }
    } catch (err) {
      console.error(`❌ Batch error: ${err.message}`)
      errors += batch.length
    }
  }

  console.log(`✓ Navigation import complete: ${imported} succeeded, ${errors} failed`)
  return { imported, errors }
}

/**
 * Clear existing data (optional - use with caution)
 */
async function clearExistingData(confirm = false) {
  if (!confirm) return

  console.log('🗑️  Clearing existing pages and navigation...')

  try {
    await supabase.from('ic_web_navigation').delete().neq('menu_key', '')
    await supabase.from('ic_web_pages').delete().neq('language', '')
    console.log('   ✓ Cleared')
  } catch (err) {
    console.error(`❌ Error clearing data: ${err.message}`)
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2)
  const jsonFile = args[0]

  if (!jsonFile) {
    console.error('Usage: node scripts/import-site-structure.js <path-to-json>')
    console.error('Example: node scripts/import-site-structure.js data/site-structure.json')
    process.exit(1)
  }

  const filePath = path.resolve(jsonFile)

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }

  console.log('🚀 IntelliCloud Site Structure Importer')
  console.log('=' .repeat(50))
  console.log(`📁 File: ${filePath}`)
  console.log(`🔗 Supabase: ${SUPABASE_URL}`)

  // Load data
  const data = loadJSON(filePath)
  if (!data.site || !data.site.nodes) {
    console.error('❌ Invalid JSON structure. Expected { site: { nodes: [...] } }')
    process.exit(1)
  }

  // Flatten nodes
  console.log('\n📊 Processing nodes...')
  const flatNodes = flattenNodes(data.site.nodes)
  console.log(`   ✓ Flattened ${flatNodes.length} nodes from hierarchical structure`)

  // Transform to pages and navigation
  const pages = flatNodes.map(node => nodeToPage(node, 'en'))
  const navItems = flatNodes.map(node => nodeToNavigation(node, 'main', 'en'))

  // Validate
  console.log('\n✓ Validating data...')
  validateUniqueSlugs(pages)
  validateNavHierarchy(navItems)
  detectCircularReferences(navItems)

  // Import
  const pageResults = await importPages(pages)
  const navResults = await importNavigation(navItems)

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Import Summary')
  console.log('=' .repeat(50))
  console.log(`Pages:      ${pageResults.imported} imported, ${pageResults.errors} failed`)
  console.log(`Navigation: ${navResults.imported} imported, ${navResults.errors} failed`)
  console.log(`Total:      ${pageResults.imported + navResults.imported} items imported`)

  if (pageResults.errors === 0 && navResults.errors === 0) {
    console.log('\n✅ Import successful!')
    process.exit(0)
  } else {
    console.log('\n⚠️  Import completed with errors')
    process.exit(1)
  }
}

main()
