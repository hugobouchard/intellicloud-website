/**
 * Main JavaScript Entry Point
 * IntelliCloud Website
 */

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('IntelliCloud Design System Initialized')

  // Add any global event listeners or initialization code here

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
