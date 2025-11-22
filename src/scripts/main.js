/**
 * Main JavaScript Entry Point
 * IntelliCloud Website
 */

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('IntelliCloud Design System Initialized')

  // Add any global event listeners or initialization code here

  // Mobile menu toggle
  const setupMobileMenu = () => {
    const mobileMenuButton = document.querySelector('button[aria-label="Toggle menu"]')
    const mobileMenu = document.getElementById('mobile-menu')

    if (mobileMenuButton && mobileMenu) {
      console.log('Mobile menu found, setting up toggle')

      mobileMenuButton.addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Toggle clicked')
        mobileMenu.classList.toggle('hidden')
      })

      // Close mobile menu when clicking on a link
      const mobileMenuLinks = mobileMenu.querySelectorAll('a')
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          console.log('Menu link clicked, closing menu')
          mobileMenu.classList.add('hidden')
        })
      })
    } else {
      console.log('Mobile menu elements not found', { button: !!mobileMenuButton, menu: !!mobileMenu })
    }
  }

  // Try to setup immediately and also after a small delay
  setupMobileMenu()
  setTimeout(setupMobileMenu, 100)

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
