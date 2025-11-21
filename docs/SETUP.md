# Development Environment Setup

Complete guide for setting up the IntelliCloud website development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js:** Version 18.x or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm:** Version 9.x or higher (comes with Node.js)
  - Verify installation: `npm --version`

- **Git:** Latest version
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Optional but Recommended

- **VS Code:** Recommended code editor
  - Download from [code.visualstudio.com](https://code.visualstudio.com/)
  - Recommended extensions:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - Live Server

- **Firebase CLI:** For deployment
  - Install: `npm install -g firebase-tools`
  - Login: `firebase login`

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/hugobouchard/intellicloud-website.git
cd intellicloud-website
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Vite (build tool)
- Tailwind CSS (utility-first CSS framework)
- PostCSS & Autoprefixer (CSS processing)
- ESLint (code linting)
- Prettier (code formatting)
- Firebase Tools (deployment)

### 3. Start Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:3000` and automatically open in your browser.

---

## Available Scripts

### Development

```bash
# Start development server with hot reload
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Code Quality

```bash
# Lint JavaScript files
npm run lint

# Format code with Prettier
npm run format
```

### Deployment

```bash
# Deploy to staging environment
npm run deploy:staging

# Deploy to production environment
npm run deploy:production
```

---

## Project Structure

```
intellicloud-website/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD workflows
├── dist/                   # Build output (generated)
├── docs/                   # Project documentation
│   ├── COMPONENT-LIBRARY.md
│   ├── DESIGN-SYSTEM.md
│   └── SETUP.md
├── public/                 # Static assets (copied as-is)
├── src/
│   ├── components/
│   │   ├── atoms/         # Basic UI elements
│   │   ├── molecules/     # Simple component groups
│   │   └── organisms/     # Complex component assemblies
│   ├── pages/
│   │   ├── en/           # English pages
│   │   └── fr/           # French pages
│   ├── scripts/          # JavaScript modules
│   ├── styles/
│   │   ├── design-tokens.css  # CSS custom properties
│   │   ├── globals.css        # Global styles
│   │   └── tailwind.css       # Tailwind directives
│   ├── images/           # Image assets
│   └── fonts/            # Font files
├── tests/                # Test files
├── config/               # Additional configuration files
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore rules
├── .prettierrc          # Prettier configuration
├── firebase.json        # Firebase hosting configuration
├── index.html           # Main HTML entry point
├── package.json         # NPM dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.js       # Vite build configuration
└── README.md            # Project overview
```

---

## Configuration Files

### Tailwind CSS (`tailwind.config.js`)

Customizes Tailwind with IntelliCloud's design tokens:
- Custom color palette (blacks, whites, grays, blue accent)
- Typography scale
- Spacing scale
- Shadows and animations

### Vite (`vite.config.js`)

Build tool configuration:
- Development server settings
- Build output configuration
- Entry points for multi-page support

### ESLint (`.eslintrc.json`)

Code quality rules:
- ES2021+ syntax support
- Browser and Node environments
- Code style enforcement

### Prettier (`.prettierrc`)

Code formatting rules:
- No semicolons
- Single quotes
- 2-space indentation
- 100 character line width

### Firebase (`firebase.json`)

Hosting configuration:
- Production and staging targets
- Cache control headers
- Rewrite rules

---

## Development Workflow

### 1. Create a New Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Edit files in the `src/` directory. The development server will automatically reload.

### 3. Test Your Changes

- Visual testing: Check appearance in multiple browsers
- Code quality: Run `npm run lint`
- Format code: Run `npm run format`

### 4. Build for Production

```bash
npm run build
```

Verify the build output in the `dist/` directory.

### 5. Commit Your Changes

```bash
git add .
git commit -m "Description of your changes"
```

### 6. Push to GitHub

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

Open a pull request on GitHub for review.

---

## Common Tasks

### Adding a New Component

1. Create component file in appropriate directory:
   - Atoms: `src/components/atoms/`
   - Molecules: `src/components/molecules/`
   - Organisms: `src/components/organisms/`

2. Follow naming convention: `component-name.html`

3. Include component documentation in `COMPONENT-LIBRARY.md`

### Adding a New Page

1. Create HTML file in `src/pages/en/` or `src/pages/fr/`

2. Update `vite.config.js` to include new entry point

3. Link page from navigation

### Updating Design Tokens

1. Edit `src/styles/design-tokens.css`

2. Update `tailwind.config.js` if needed

3. Document changes in `DESIGN-SYSTEM.md`

### Adding Dependencies

```bash
# Add development dependency
npm install --save-dev package-name

# Add production dependency
npm install package-name
```

---

## Troubleshooting

### Development Server Won't Start

1. Check Node.js version: `node --version` (should be 18+)
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check for port conflicts (default: 3000)

### Build Fails

1. Clear cache: `rm -rf dist node_modules/.vite`
2. Reinstall dependencies: `npm install`
3. Check for syntax errors in code

### Styles Not Updating

1. Restart development server
2. Clear browser cache
3. Check Tailwind configuration
4. Verify CSS import order

### Git Issues

1. Check remote: `git remote -v`
2. Pull latest changes: `git pull origin main`
3. Resolve merge conflicts if any

---

## Environment Variables

Create a `.env` file in the project root for environment-specific configuration:

```bash
# Example .env file
VITE_API_URL=https://api.intellicloud.com
VITE_ENVIRONMENT=development
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

**Note:** Never commit `.env` files to Git. They're already in `.gitignore`.

---

## Browser Support

### Target Browsers

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

### Testing

Test in multiple browsers during development:
1. Chrome DevTools for primary development
2. Firefox Developer Tools for cross-browser testing
3. Safari for macOS/iOS testing
4. BrowserStack for comprehensive testing (optional)

---

## Performance Optimization

### Development

- Use Vite's fast HMR (Hot Module Replacement)
- Enable source maps for debugging
- Use browser DevTools for profiling

### Production

- Minimize bundle size
- Optimize images (WebP, compression)
- Use lazy loading for images
- Enable caching with proper headers
- Use CDN for static assets

---

## Getting Help

### Resources

- **Project Documentation:** `/docs` folder
- **Component Library:** `docs/COMPONENT-LIBRARY.md`
- **Design System:** `docs/DESIGN-SYSTEM.md`
- **README:** Project overview and quick start

### Common Questions

**Q: How do I add a new color to the design system?**
A: Update both `src/styles/design-tokens.css` and `tailwind.config.js`, then document in `DESIGN-SYSTEM.md`.

**Q: How do I create a bilingual page?**
A: Create two versions: one in `src/pages/en/` and one in `src/pages/fr/`.

**Q: How do I deploy to staging?**
A: Run `npm run deploy:staging` (requires Firebase CLI setup).

---

**Last Updated:** 2025-11-20
