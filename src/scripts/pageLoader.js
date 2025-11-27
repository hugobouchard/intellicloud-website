/**
 * pageLoader.js
 *
 * Initializes dynamic page content on the public website
 * Fetches data from Supabase via pageLoader lib functions
 */

import { loadPageBySlug, loadNavigation, loadSiteSettings } from '../lib/pageLoader.js'

/**
 * Extract slug from current URL path
 * Examples:
 *   /services/cloud-architecture/ → cloud-architecture
 *   /services/cloud-architecture/aws.html → aws
 *   / → home
 */
function getCurrentPageSlug() {
  const path = window.location.pathname
  const url = new URL(window.location.href)
  const pathname = url.pathname

  // Remove leading and trailing slashes
  let slug = pathname.replace(/^\//, '').replace(/\/$/, '')

  // Handle home page
  if (!slug || slug === 'src/pages/en/index.html' || pathname === '/') {
    return 'home'
  }

  // Extract last segment or filename without extension
  const segments = slug.split('/')
  let lastSegment = segments[segments.length - 1]

  // Remove .html extension if present
  if (lastSegment.endsWith('.html')) {
    lastSegment = lastSegment.replace('.html', '')
  }

  // Handle index pages - use parent segment
  if (lastSegment === 'index' && segments.length > 1) {
    lastSegment = segments[segments.length - 2]
  }

  return lastSegment || 'home'
}

/**
 * Update page meta tags (title, description, etc.)
 */
function updatePageMeta(page) {
  if (!page) return

  // Update title
  if (page.title) {
    document.title = page.title
    const titleTag = document.querySelector('title')
    if (titleTag) {
      titleTag.textContent = page.title
    }
  }

  // Update description meta tag
  if (page.description) {
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = page.description
  }

  // Update OG tags for social media
  if (page.title) {
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.content = page.title
  }

  if (page.description) {
    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.content = page.description
  }
}

/**
 * Update hero section with dynamic content
 * Looks for elements with data-dynamic attributes
 */
function updateHeroSection(page) {
  if (!page) return

  const heroHeading = document.querySelector('[data-dynamic="hero-title"]')
  if (heroHeading && page.content?.headline) {
    heroHeading.textContent = page.content.headline
  }

  const heroDescription = document.querySelector('[data-dynamic="hero-description"]')
  if (heroDescription && page.content?.excerpt) {
    heroDescription.textContent = page.content.excerpt
  }

  const heroCTA = document.querySelector('[data-dynamic="hero-cta"]')
  if (heroCTA && page.content?.call_to_action) {
    heroCTA.textContent = page.content.call_to_action
  }
}

/**
 * Update breadcrumbs to reflect current page
 */
function updateBreadcrumbs(slug, title) {
  const breadcrumbs = document.querySelector('[data-dynamic="breadcrumbs"]')
  if (!breadcrumbs) return

  // Simple breadcrumb update - can be enhanced
  const slugParts = slug.split('-')
  const formattedTitle = slugParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')

  breadcrumbs.innerHTML = `
    <a href="/" class="text-gray-600 hover:text-blue-600">Home</a>
    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
    <span class="text-gray-900 font-semibold">${title || formattedTitle}</span>
  `
}

/**
 * Log loading state for debugging
 */
function setLoadingState(isLoading) {
  if (isLoading) {
    document.body.classList.add('is-loading')
  } else {
    document.body.classList.remove('is-loading')
  }
}

/**
 * Initialize page with dynamic content
 * This is called automatically on page load
 */
export async function initializeDynamicPage() {
  const slug = getCurrentPageSlug()

  setLoadingState(true)

  try {
    // Fetch page content
    const page = await loadPageBySlug(slug, 'en')

    if (page) {
      console.log(`Loaded page: ${slug}`, page)

      // Update meta tags for SEO
      updatePageMeta(page)

      // Update hero section
      updateHeroSection(page)

      // Update breadcrumbs
      updateBreadcrumbs(slug, page.title)
    } else {
      console.warn(`Page not found in Supabase: ${slug}`)
      // Fall back to static content already on page
    }
  } catch (error) {
    console.error('Error loading page:', error)
    // Fall back to static content - page is already rendered
  } finally {
    setLoadingState(false)
  }
}

/**
 * Auto-initialize on DOM ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDynamicPage)
} else {
  initializeDynamicPage()
}
