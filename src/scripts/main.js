/**
 * Main JavaScript Entry Point
 * IntelliCloud Website
 */

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('IntelliCloud Design System Initialized')

  // Add any global event listeners or initialization code here

  // Mobile menu toggle
  const mobileMenuButton = document.querySelector('button[aria-label="Toggle menu"]')
  const mobileMenu = document.getElementById('mobile-menu')

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden')
    })

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a')
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden')
      })
    })
  }

  // Example: Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href')
      if (href === '#') return

      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
})
