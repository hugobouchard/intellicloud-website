/**
 * pageLoader.js
 *
 * Handles fetching page content and navigation from Supabase
 * with caching and fallback to static content
 */

import { supabase } from './supabaseClient.js'

// Cache with 5-minute TTL (300,000ms)
const CACHE_TTL = 300000
const cache = new Map()

/**
 * Get cached value if not expired
 */
function getFromCache(key) {
  const cached = cache.get(key)
  if (!cached) return null

  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }

  return cached.value
}

/**
 * Set value in cache with timestamp
 */
function setInCache(key, value) {
  cache.set(key, {
    value,
    timestamp: Date.now()
  })
}

/**
 * Load page content by slug from Supabase
 * Falls back to null if unavailable
 *
 * @param {string} slug - Page slug (e.g., 'cloud-engineering')
 * @param {string} language - Language code (default: 'en')
 * @returns {Promise<Object|null>} Page object or null on error
 */
export async function loadPageBySlug(slug, language = 'en') {
  const cacheKey = `page:${slug}:${language}`

  // Check cache first
  const cached = getFromCache(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const { data, error } = await supabase
      .from('ic_web_pages')
      .select('*')
      .eq('slug', slug)
      .eq('language', language)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      console.warn(`Page not found: ${slug} (${language})`)
      return null
    }

    setInCache(cacheKey, data)
    return data
  } catch (err) {
    console.error(`Error loading page ${slug}:`, err.message)
    return null
  }
}

/**
 * Load navigation menu by menu_key
 * Builds hierarchical structure from flat parent_id references
 *
 * @param {string} menuKey - Menu identifier (default: 'main')
 * @param {string} language - Language code (default: 'en')
 * @returns {Promise<Array|null>} Hierarchical navigation items or null on error
 */
export async function loadNavigation(menuKey = 'main', language = 'en') {
  const cacheKey = `nav:${menuKey}:${language}`

  // Check cache first
  const cached = getFromCache(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const { data, error } = await supabase
      .from('ic_web_navigation')
      .select('*')
      .eq('menu_key', menuKey)
      .eq('language', language)
      .eq('is_active', true)
      .order('order_position', { ascending: true })

    if (error || !data) {
      console.warn(`Navigation not found: ${menuKey}`)
      return null
    }

    // Build hierarchy: top-level items with nested children
    const hierarchy = buildNavHierarchy(data)
    setInCache(cacheKey, hierarchy)
    return hierarchy
  } catch (err) {
    console.error(`Error loading navigation ${menuKey}:`, err.message)
    return null
  }
}

/**
 * Build hierarchical navigation structure from flat parent_id references
 *
 * @param {Array} items - Flat array of navigation items
 * @returns {Array} Hierarchical navigation structure
 */
function buildNavHierarchy(items) {
  const itemMap = new Map()
  const roots = []

  // Create map for quick lookup
  items.forEach(item => {
    itemMap.set(item.id, {
      ...item,
      children: []
    })
  })

  // Build hierarchy
  itemMap.forEach(item => {
    if (item.parent_id) {
      const parent = itemMap.get(item.parent_id)
      if (parent) {
        parent.children.push(item)
      }
    } else {
      roots.push(item)
    }
  })

  // Sort children by order_position
  roots.forEach(sortChildren)

  return roots
}

/**
 * Recursively sort children by order_position
 */
function sortChildren(item) {
  if (item.children && item.children.length > 0) {
    item.children.sort((a, b) => a.order_position - b.order_position)
    item.children.forEach(sortChildren)
  }
}

/**
 * Load all site settings
 *
 * @returns {Promise<Object|null>} Settings object keyed by setting name or null on error
 */
export async function loadSiteSettings() {
  const cacheKey = 'settings:site'

  // Check cache first
  const cached = getFromCache(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const { data, error } = await supabase
      .from('ic_web_site_settings')
      .select('*')

    if (error || !data) {
      console.warn('Settings not found')
      return null
    }

    // Convert array to object keyed by setting_name
    const settings = {}
    data.forEach(setting => {
      settings[setting.setting_name] = setting.setting_value
    })

    setInCache(cacheKey, settings)
    return settings
  } catch (err) {
    console.error('Error loading settings:', err.message)
    return null
  }
}

/**
 * Load SEO metadata for a page
 *
 * @param {string} pageSlug - Page slug
 * @param {string} language - Language code (default: 'en')
 * @returns {Promise<Object|null>} SEO metadata or null on error
 */
export async function loadPageSEO(pageSlug, language = 'en') {
  const cacheKey = `seo:${pageSlug}:${language}`

  // Check cache first
  const cached = getFromCache(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const { data, error } = await supabase
      .from('ic_web_seo_meta')
      .select('*')
      .eq('page_slug', pageSlug)
      .eq('language', language)
      .single()

    if (error || !data) {
      return null
    }

    setInCache(cacheKey, data)
    return data
  } catch (err) {
    console.error(`Error loading SEO for ${pageSlug}:`, err.message)
    return null
  }
}

/**
 * Clear all caches (useful for admin updates)
 */
export function clearCache() {
  cache.clear()
}

/**
 * Clear specific cache key
 */
export function clearCacheKey(key) {
  cache.delete(key)
}
