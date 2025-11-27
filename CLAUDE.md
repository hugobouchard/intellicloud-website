# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev           # Start Vite dev server on localhost:5173
npm run build         # Build for production to dist/
npm run preview       # Preview production build on localhost:4173
```

### Code Quality
```bash
npm run lint          # Run ESLint on all files
npm run format        # Format code with Prettier
```

### Deployment
```bash
npm run deploy:staging     # Build and deploy to Firebase staging
npm run deploy:production  # Build and deploy to Firebase production
```

**Live URL:** https://site-web-ic.web.app/

## Architecture Overview

### Technology Stack
- **Build Tool:** Vite 5.x with multi-page support
- **CSS Framework:** Tailwind CSS 3.4 with extensive custom design system
- **Design Pattern:** Atomic Design (Atoms → Molecules → Organisms → Pages)
- **Deployment:** Firebase Hosting
- **CMS:** Supabase with Google OAuth (admin dashboard at /admin.html)

### Multi-Page Application
This is a Vite-based multi-page application (MPA), not an SPA:
- Vite config (vite.config.js:6-14) dynamically discovers all HTML files in src/pages/
- Each page is a separate entry point, including admin.html for the CMS
- Navigation uses traditional anchor links, not client-side routing
- When adding new pages, place them in src/pages/ and they'll be auto-detected by the build

### Bilingual Structure
The site supports English and French with parallel page structures:
- English pages: src/pages/en/
- French pages: src/pages/fr/
- Language switcher in header links between parallel pages

### Design System
The project uses a comprehensive atomic design system with three levels of components:

1. **Atoms** (src/components/atoms/): Basic building blocks
   - button.html, input.html, label.html, heading.html, paragraph.html, badge.html, icon.html
   - Each atom has multiple variants (e.g., btn-primary, btn-outline, btn-ghost)

2. **Molecules** (src/components/molecules/): Simple component groups
   - card.html, form-group.html, feature-block.html, service-card.html, testimonial-card.html

3. **Organisms** (src/components/organisms/): Complex assemblies
   - header.html, footer.html, hero-section.html, contact-form.html, pricing-table.html

All components follow strict CSS class naming conventions documented in docs/COMPONENT-LIBRARY.md.

### Styling Architecture
Three-layer CSS system:
1. **design-tokens.css**: CSS custom properties for all design tokens (colors, spacing, typography)
2. **globals.css**: Global resets, typography defaults, utility classes, animations
3. **tailwind.css**: Tailwind integration with extended theme (tailwind.config.js)

Design tokens are defined as CSS variables (e.g., --color-blue-600, --space-4, --text-base) and integrated with Tailwind, enabling both custom properties and utility classes.

### Version Management
- Current version: 1.0.0 (working toward v2.0)
- version/1/ directory contains stable v1.x codebase
- Root directory is active development for v2.0+
- Version branching structure established per commit f1658c6

### CMS Integration
Recent addition (commit 53d10cc):
- Supabase backend with Google OAuth authentication
- Admin dashboard at /admin.html (must be included in Vite build config)
- Admin script at src/scripts/admin.js

## Key Architectural Patterns

### Component Usage
When building pages, compose from existing atoms/molecules/organisms rather than creating inline styles:
```html
<!-- Good: Use existing components -->
<button class="btn btn-primary btn-lg">Click Me</button>

<!-- Avoid: Custom inline styles -->
<button style="background: black; padding: 16px;">Click Me</button>
```

### Navigation Structure
The site has three main navigation categories:
1. **Technology**: CRM (Salesforce, HubSpot), AI, Cloud, API
2. **Services**: Cloud Architecture, Website Creation, eCommerce, Mobile, API Integration, UI/UX
3. **Lead Generation**: SEM (Google Ads, PPC), SEO (On-page, Technical, Content), Local Listing (Google Business, Local SEO)

All dropdowns in the header (index.html:24-116) follow consistent structure with grouped subsections.

### Responsive Design
Mobile-first approach with Tailwind breakpoints:
- Base styles apply to mobile (< 640px)
- sm: (640px+), md: (768px+), lg: (1024px+), xl: (1280px+), 2xl: (1536px+)
- Container has responsive padding: 1rem (mobile) → 1.5rem (sm) → 2rem (lg)

### Animation System
Three predefined animations using CSS custom properties:
- `animate-fade-in`: Opacity transition (500ms ease-out)
- `animate-slide-up`: Slide from bottom with fade (500ms ease-out)
- `animate-slide-down`: Slide from top with fade (500ms ease-out)

All animations respect prefers-reduced-motion for accessibility.

## Development Guidelines

### Adding New Pages
1. Create HTML file in src/pages/en/ (and src/pages/fr/ for bilingual)
2. Vite will automatically detect and build it (no manual config needed)
3. Add navigation links in header/footer if needed
4. Follow existing page structure (header inclusion, consistent meta tags)

### Modifying Components
1. Check docs/COMPONENT-LIBRARY.md for existing variants before creating new ones
2. Atoms should remain pure and stateless
3. When editing components, verify usage across all pages with search
4. Maintain consistent class naming: .component-variant-size pattern

### Working with the Design System
1. Use design tokens (CSS variables) for colors, spacing, and typography
2. Reference docs/DESIGN-SYSTEM.md for token values
3. Extend Tailwind config (tailwind.config.js) for new utilities if needed
4. New design tokens should be added to both design-tokens.css and Tailwind config

### Firebase Deployment
Before deploying:
1. Ensure all changes are committed to Git
2. Run `npm run build` locally to verify build succeeds
3. Firebase config (firebase.json) serves from dist/ directory
4. Use staging environment for testing before production

## Specialized Agents

### webmaster-coordinator
Use this agent at the start of each development session to:
- Verify Git status across all branches
- Check Firebase deployment state synchronization
- Ensure no conflicting work exists on remote branches
- Coordinate backups before major version releases
- Update project documentation and agent definitions

Agent config: .claude/agents/webmaster-coordinator.md

## Project Context

### Business Focus
IntelliCloud positions itself as "engineering revenue, not just software" with a focus on:
- Salesforce dashboards and CRM implementations
- Enterprise AI agents for automation
- Custom client portals and cloud infrastructure
- Lead generation through SEM, SEO, and local listing services

### Content Tone
- Professional, technical, confident
- Emphasis on business outcomes and ROI (e.g., "$500M+ Client Revenue", "3.8x Avg ROI")
- Minimal corporate jargon, direct value propositions

### Important Files
- docs/DESIGN-SYSTEM.md: Complete design token reference
- docs/COMPONENT-LIBRARY.md: Component documentation
- docs/SETUP.md: Setup instructions
- REBRAND-STATUS.md: Historical rebrand tracking
- NAVIGATION_UPDATE_SUMMARY.md: Navigation structure documentation

## Testing & Quality Assurance

### Build Verification
Always run `npm run build` before committing major changes:
- Verifies all page entry points are correctly configured
- Checks for broken imports or missing assets
- Ensures Tailwind purges unused styles correctly

### Cross-Browser Testing
Test on live URL (site-web-ic.web.app) in:
- Chrome/Edge (primary)
- Safari (mobile and desktop)
- Firefox

### Accessibility Checklist
- All interactive elements have focus states
- Color contrast meets WCAG 2.1 AA standards
- Keyboard navigation works for all dropdowns and forms
- Animations respect prefers-reduced-motion

## Common Pitfalls

1. **Forgetting admin.html in Vite config**: After commit f83434b, admin.html must be explicitly included in vite.config.js input object
2. **Breaking CSS custom properties**: Design tokens are used extensively; changing variable names breaks styling across the site
3. **Navigation dropdown z-index**: Dropdowns use z-50 to stay above sticky header (z-50); maintain this hierarchy
4. **Language switcher links**: Must manually update parallel page paths when adding new pages
5. **Component isolation**: Atoms should never import molecules or organisms; maintain strict hierarchy
