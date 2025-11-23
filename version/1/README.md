# IntelliCloud Website

Modern, minimalist website for IntelliCloud built with atomic design principles, Tailwind CSS, and Vite.

## Project Status

**Phase:** Initial Development
**Version:** 1.0.0
**Last Updated:** 2025-11-20

### Current Milestones

- [x] Repository setup and initialization
- [x] Folder structure created
- [x] Design system foundation
- [x] Atomic components (atoms)
- [ ] Molecular components
- [ ] Organism components
- [ ] Page templates
- [ ] Content integration
- [ ] Firebase deployment

## Architecture

### Technology Stack

- **Build Tool:** Vite 5.x
- **CSS Framework:** Tailwind CSS 3.4
- **Design System:** Atomic Design
- **Deployment:** Firebase Hosting
- **CI/CD:** GitHub Actions

### Folder Structure

```
intellicloud-website/
├── src/
│   ├── components/
│   │   ├── atoms/         # Basic building blocks (buttons, inputs, labels)
│   │   ├── molecules/     # Simple component groups
│   │   └── organisms/     # Complex component assemblies
│   ├── styles/
│   │   ├── design-tokens.css
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── scripts/           # JavaScript modules
│   ├── pages/
│   │   ├── en/           # English pages
│   │   └── fr/           # French pages
│   ├── images/
│   └── fonts/
├── public/               # Static assets
├── docs/                 # Documentation
├── config/               # Configuration files
├── tests/                # Test files
└── .github/workflows/    # CI/CD workflows
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Firebase CLI (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/hugobouchard/intellicloud-website.git
cd intellicloud-website

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## Design System

The project uses a comprehensive design system with:

- **Color Palette:** Blacks, whites, grays, and blue accent
- **Typography Scale:** Responsive font sizes and line heights
- **Spacing Scale:** Consistent spacing using 8px base unit
- **Shadows:** Layered shadow system for depth
- **Animations:** Smooth transitions and micro-interactions

See [DESIGN-SYSTEM.md](./docs/DESIGN-SYSTEM.md) for detailed guidelines.

## Component Library

All components are documented in [COMPONENT-LIBRARY.md](./docs/COMPONENT-LIBRARY.md).

### Atomic Design Levels

1. **Atoms:** Buttons, inputs, labels, headings, paragraphs, badges, icons
2. **Molecules:** Form groups, cards, navigation items
3. **Organisms:** Headers, footers, forms, feature sections

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the design system guidelines
3. Test thoroughly across browsers
4. Submit a pull request with detailed description

## License

MIT License - See [LICENSE](./LICENSE) file for details.

## Contact

- **Website:** https://intellicloud.com (coming soon)
- **Email:** contact@intellicloud.com
- **GitHub:** https://github.com/hugobouchard/intellicloud-website

---

Built with precision by IntelliCloud
