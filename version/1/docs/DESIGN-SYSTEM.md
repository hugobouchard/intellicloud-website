# Design System

IntelliCloud's comprehensive design system documentation, including design tokens, principles, and usage guidelines.

## Table of Contents

- [Design Principles](#design-principles)
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing](#spacing)
- [Shadows](#shadows)
- [Border Radius](#border-radius)
- [Animations](#animations)
- [Breakpoints](#breakpoints)
- [Accessibility](#accessibility)

---

## Design Principles

### Minimalism

The IntelliCloud design system embraces minimalism:
- Clean, uncluttered interfaces
- Purposeful use of white space
- Focus on essential elements
- Reduced visual noise

### Consistency

Consistency across all touchpoints:
- Unified color palette
- Standardized spacing scale
- Consistent component behavior
- Predictable interactions

### Accessibility

Designed for everyone:
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- Sufficient color contrast

### Performance

Optimized for speed:
- Minimal CSS footprint
- Efficient JavaScript
- Optimized assets
- Fast load times

---

## Color Palette

### Primary Colors

#### Black
- **Primary Black:** `#000000`
  - Use for: Main text, primary buttons, high-contrast elements
  - CSS Variable: `--color-black`

- **Soft Black:** `#1a1a1a`
  - Use for: Hover states, subtle variations
  - CSS Variable: `--color-black-soft`

#### White
- **Primary White:** `#FFFFFF`
  - Use for: Backgrounds, light text on dark backgrounds
  - CSS Variable: `--color-white`

- **Soft White:** `#F9FAFB`
  - Use for: Alternative backgrounds, subtle sections
  - CSS Variable: `--color-white-soft`

### Gray Scale

Neutral colors for UI elements, text, and backgrounds:

| Shade | Hex Code | Use Case |
|-------|----------|----------|
| 50 | `#F9FAFB` | Lightest backgrounds |
| 100 | `#F3F4F6` | Light backgrounds, hover states |
| 200 | `#E5E7EB` | Borders, dividers |
| 300 | `#D1D5DB` | Input borders, inactive elements |
| 400 | `#9CA3AF` | Placeholder text, icons |
| 500 | `#6B7280` | Secondary text |
| 600 | `#4B5563` | Body text |
| 700 | `#374151` | Headings, emphasis |
| 800 | `#1F2937` | Strong emphasis |
| 900 | `#111827` | Darkest elements |

CSS Variables: `--color-gray-50` through `--color-gray-900`

### Accent Blue

Primary accent color for interactive elements and highlights:

| Shade | Hex Code | Use Case |
|-------|----------|----------|
| 50 | `#EFF6FF` | Light backgrounds, badges |
| 100 | `#DBEAFE` | Subtle highlights |
| 200 | `#BFDBFE` | Light accents |
| 300 | `#93C5FD` | Soft interactive states |
| 400 | `#60A5FA` | Secondary buttons |
| 500 | `#3B82F6` | Primary interactive elements |
| 600 | `#2563EB` | Links, focus states |
| 700 | `#1D4ED8` | Hover states, active links |
| 800 | `#1E40AF` | Strong emphasis |
| 900 | `#1E3A8A` | Darkest accent |

CSS Variables: `--color-blue-50` through `--color-blue-900`

### Semantic Colors

#### Success (Green)
- Light: `#D1FAE5`
- Dark: `#065F46`
- Use for: Success messages, positive confirmations

#### Warning (Yellow)
- Light: `#FEF3C7`
- Dark: `#92400E`
- Use for: Warnings, cautionary messages

#### Error (Red)
- Light: `#FEE2E2`
- Dark: `#991B1B`
- Use for: Error messages, validation errors

### Color Usage Guidelines

1. **Text on White Background:**
   - Primary: Black (`#000000`)
   - Secondary: Gray 600 (`#4B5563`)
   - Muted: Gray 500 (`#6B7280`)

2. **Text on Dark Background:**
   - Primary: White (`#FFFFFF`)
   - Secondary: Gray 200 (`#E5E7EB`)

3. **Interactive Elements:**
   - Primary action: Black background, white text
   - Secondary action: Gray background, black text
   - Links: Blue 600 (`#2563EB`)

4. **Contrast Ratios:**
   - Normal text: Minimum 4.5:1
   - Large text: Minimum 3:1
   - UI components: Minimum 3:1

---

## Typography

### Font Families

#### Sans-Serif (Default)
System font stack for optimal performance and native feel:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
             Roboto, Helvetica, Arial, sans-serif;
```
CSS Variable: `--font-sans`

#### Monospace
For code and technical content:
```css
font-family: 'SF Mono', Monaco, 'Inconsolata',
             'Fira Code', monospace;
```
CSS Variable: `--font-mono`

### Font Sizes

| Name | Size | Line Height | Use Case |
|------|------|-------------|----------|
| xs | 0.75rem (12px) | 1rem | Small labels, captions |
| sm | 0.875rem (14px) | 1.25rem | Secondary text |
| base | 1rem (16px) | 1.5rem | Body text (default) |
| lg | 1.125rem (18px) | 1.75rem | Emphasized text |
| xl | 1.25rem (20px) | 1.75rem | Lead paragraphs |
| 2xl | 1.5rem (24px) | 2rem | H4 |
| 3xl | 1.875rem (30px) | 2.25rem | H3 |
| 4xl | 2.25rem (36px) | 2.5rem | H2 |
| 5xl | 3rem (48px) | 1 | H1 |
| 6xl | 3.75rem (60px) | 1 | Hero headings |

CSS Variables: `--text-xs` through `--text-9xl`

### Font Weights

| Weight | Value | Use Case |
|--------|-------|----------|
| Light | 300 | Decorative headings |
| Normal | 400 | Body text |
| Medium | 500 | Buttons, labels |
| Semibold | 600 | Emphasis |
| Bold | 700 | Headings |

CSS Variables: `--font-light` through `--font-black`

### Line Heights

| Name | Value | Use Case |
|------|-------|----------|
| None | 1 | Large headings |
| Tight | 1.25 | Headings |
| Snug | 1.375 | Short text blocks |
| Normal | 1.5 | Body text (default) |
| Relaxed | 1.625 | Long-form content |
| Loose | 2 | Spacious text |

CSS Variables: `--leading-none` through `--leading-loose`

### Typography Best Practices

1. **Hierarchy:** Use size and weight to establish clear visual hierarchy
2. **Line Length:** Keep lines between 50-75 characters for readability
3. **Paragraph Spacing:** Use consistent spacing between paragraphs (1rem)
4. **Headings:** Apply appropriate heading levels (h1-h6) semantically
5. **Contrast:** Ensure sufficient contrast between text and background

---

## Spacing

### Spacing Scale

Based on 8px grid system for visual consistency:

| Name | Size | Pixels | Use Case |
|------|------|--------|----------|
| 0 | 0 | 0px | No spacing |
| 1 | 0.25rem | 4px | Minimal gaps |
| 2 | 0.5rem | 8px | Base unit |
| 3 | 0.75rem | 12px | Small spacing |
| 4 | 1rem | 16px | Default spacing |
| 5 | 1.25rem | 20px | Medium spacing |
| 6 | 1.5rem | 24px | Section spacing |
| 8 | 2rem | 32px | Large spacing |
| 10 | 2.5rem | 40px | Section dividers |
| 12 | 3rem | 48px | Major sections |
| 16 | 4rem | 64px | Page sections |
| 20 | 5rem | 80px | Hero sections |
| 24 | 6rem | 96px | Large sections |

CSS Variables: `--space-0` through `--space-64`

### Spacing Guidelines

1. **Component Padding:** Use consistent padding (space-4 or space-6)
2. **Section Spacing:** Large sections use space-16 or space-24
3. **Element Gaps:** Use space-2 or space-4 between related elements
4. **Margins:** Bottom margins on typography elements
5. **Grid Gaps:** Use space-4, space-6, or space-8 in grid layouts

---

## Shadows

Layered shadow system for depth and elevation:

| Name | CSS Value | Use Case |
|------|-----------|----------|
| sm | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle elevation |
| base | `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)` | Cards, buttons |
| md | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | Dropdowns, modals |
| lg | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Popovers |
| xl | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | Modals |
| 2xl | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` | Overlays |
| inner | `inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)` | Pressed buttons |

CSS Variables: `--shadow-sm` through `--shadow-2xl`

---

## Border Radius

Consistent rounding for elements:

| Name | Size | Use Case |
|------|------|----------|
| none | 0 | Sharp corners |
| sm | 0.125rem (2px) | Subtle rounding |
| base | 0.25rem (4px) | Default (buttons, inputs) |
| md | 0.375rem (6px) | Cards |
| lg | 0.5rem (8px) | Large cards |
| xl | 0.75rem (12px) | Featured elements |
| 2xl | 1rem (16px) | Images |
| 3xl | 1.5rem (24px) | Large images |
| full | 9999px | Circles, pills |

CSS Variables: `--radius-none` through `--radius-full`

---

## Animations

### Durations

| Name | Duration | Use Case |
|------|----------|----------|
| 75 | 75ms | Instant feedback |
| 100 | 100ms | Quick transitions |
| 150 | 150ms | Default (hover, focus) |
| 200 | 200ms | Smooth transitions |
| 300 | 300ms | Noticeable animations |
| 500 | 500ms | Fade in/out |
| 700 | 700ms | Slow transitions |
| 1000 | 1000ms | Very slow |

CSS Variables: `--duration-75` through `--duration-1000`

### Timing Functions

| Name | Function | Use Case |
|------|----------|----------|
| linear | `linear` | Consistent speed |
| ease-in | `cubic-bezier(0.4, 0, 1, 1)` | Accelerating |
| ease-out | `cubic-bezier(0, 0, 0.2, 1)` | Decelerating |
| ease-in-out | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth start and end |

CSS Variables: `--ease-linear` through `--ease-in-out`

### Predefined Animations

```css
/* Fade In */
animation: fadeIn 0.5s ease-out;

/* Slide Up */
animation: slideUp 0.5s ease-out;

/* Slide Down */
animation: slideDown 0.5s ease-out;
```

### Animation Guidelines

1. **Performance:** Use `transform` and `opacity` for best performance
2. **Accessibility:** Respect `prefers-reduced-motion` setting
3. **Subtlety:** Keep animations subtle and purposeful
4. **Duration:** Most UI animations should be 150-300ms
5. **Consistency:** Use standard timing functions

---

## Breakpoints

Responsive design breakpoints:

| Name | Pixels | Use Case |
|------|--------|----------|
| sm | 640px | Small tablets, large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops, small desktops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

CSS Variables: `--breakpoint-sm` through `--breakpoint-2xl`

### Mobile-First Approach

Design for mobile first, then enhance for larger screens:

```css
/* Mobile (default) */
.element {
  font-size: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    font-size: 1.125rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    font-size: 1.25rem;
  }
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

All components meet WCAG 2.1 Level AA standards:

1. **Color Contrast:**
   - Text: Minimum 4.5:1 ratio
   - Large text: Minimum 3:1 ratio
   - UI components: Minimum 3:1 ratio

2. **Keyboard Navigation:**
   - All interactive elements focusable
   - Logical tab order
   - Visible focus indicators

3. **Screen Readers:**
   - Semantic HTML
   - ARIA labels where needed
   - Descriptive link text

4. **Motion:**
   - Respect `prefers-reduced-motion`
   - Disable animations when requested

### Accessibility Checklist

- [ ] Sufficient color contrast
- [ ] Keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA attributes where needed
- [ ] Semantic HTML structure
- [ ] Alt text for images
- [ ] Form labels properly associated
- [ ] Error messages clear and helpful

---

## Design Tokens Reference

All design tokens are available as CSS custom properties in `src/styles/design-tokens.css`.

### Usage Example

```css
.my-component {
  color: var(--color-black);
  background-color: var(--color-white);
  padding: var(--space-4);
  font-size: var(--text-base);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-base);
  transition: var(--transition-all);
}
```

### Tailwind Integration

All tokens are integrated with Tailwind CSS:

```html
<div class="bg-white text-black p-4 text-base rounded-md shadow">
  Content
</div>
```

---

**Last Updated:** 2025-11-20
