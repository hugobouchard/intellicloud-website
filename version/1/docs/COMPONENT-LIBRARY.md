# Component Library

Complete documentation for all IntelliCloud website components following atomic design principles.

## Table of Contents

- [Atoms](#atoms)
  - [Button](#button)
  - [Input](#input)
  - [Label](#label)
  - [Heading](#heading)
  - [Paragraph](#paragraph)
  - [Badge](#badge)
  - [Icon](#icon)
- [Molecules](#molecules)
- [Organisms](#organisms)

---

## Atoms

Atoms are the foundational building blocks of our design system. They are the smallest, most basic components that cannot be broken down further without losing their meaning.

### Button

**File:** `src/components/atoms/button.html`

Buttons trigger actions and events throughout the interface.

#### Variants

- **Primary:** Main call-to-action buttons with solid black background
- **Secondary:** Supporting actions with gray background
- **Outline:** Alternative style with border and transparent background
- **Ghost:** Minimal, text-only style with transparent background
- **Link:** Text link style without borders

#### Sizes

- **Small (sm):** Compact buttons for tight spaces
- **Medium (md):** Default size for most use cases
- **Large (lg):** Prominent buttons for primary actions

#### Usage

```html
<!-- Primary Button -->
<button class="btn btn-primary btn-md" type="button">
  Primary Button
</button>

<!-- Outline Button -->
<button class="btn btn-outline btn-md" type="button">
  Outline Button
</button>
```

#### CSS Classes

- `.btn` - Base button class (required)
- `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-link` - Variant classes
- `.btn-sm`, `.btn-md`, `.btn-lg` - Size classes

#### States

- Default
- Hover
- Active (pressed)
- Disabled
- Focus (keyboard navigation)

---

### Input

**File:** `src/components/atoms/input.html`

Form inputs for collecting user data.

#### Types

- **Text:** Standard text input
- **Email:** Email address input with validation
- **Password:** Masked password input
- **Number:** Numeric input
- **Search:** Search input with icon
- **Textarea:** Multi-line text input

#### States

- **Default:** Standard input state
- **Disabled:** Input cannot be edited
- **Error:** Invalid input with error styling
- **Success:** Valid input with success styling

#### Usage

```html
<!-- Text Input -->
<input type="text" class="input" placeholder="Enter text..." />

<!-- Search Input -->
<input type="search" class="input input-search" placeholder="Search..." />

<!-- Error State -->
<input type="text" class="input input-error" aria-invalid="true" />
```

#### CSS Classes

- `.input` - Base input class (required)
- `.input-search` - Search input with icon
- `.input-error` - Error state styling
- `.input-success` - Success state styling

---

### Label

**File:** `src/components/atoms/label.html`

Labels for form inputs providing context and instructions.

#### Variants

- **Default:** Standard label
- **Required:** Label with asterisk indicator
- **Optional:** Label with "(optional)" text
- **With Helper Text:** Label with additional descriptive text
- **With Error:** Label displaying error message

#### Usage

```html
<!-- Required Label -->
<label class="label label-required" for="input-id">
  Required Field
  <span class="label-asterisk">*</span>
</label>

<!-- Label with Helper Text -->
<label class="label" for="input-id">
  <span class="label-text">Email Address</span>
  <span class="label-helper">We'll never share your email</span>
</label>
```

#### CSS Classes

- `.label` - Base label class (required)
- `.label-required` - Required field styling
- `.label-text` - Main label text
- `.label-helper` - Helper text
- `.label-error` - Error state
- `.label-error-message` - Error message text

---

### Heading

**File:** `src/components/atoms/heading.html`

Hierarchical headings for content structure (h1-h6).

#### Levels

- **H1:** Main page title (largest)
- **H2:** Section titles
- **H3:** Subsection titles
- **H4:** Component titles
- **H5:** Small headings
- **H6:** Smallest headings

#### Weight Variants

- **Light:** Lighter font weight
- **Semibold:** Medium-heavy weight
- **Bold:** Default heavy weight

#### Color Variants

- **Default:** Black text
- **Accent:** Blue accent color
- **Muted:** Gray color

#### Usage

```html
<h1 class="heading heading-1">Main Page Heading</h1>
<h2 class="heading heading-2 heading-accent">Accent Section</h2>
```

#### CSS Classes

- `.heading` - Base heading class (required)
- `.heading-1` through `.heading-6` - Size classes
- `.heading-light`, `.heading-semibold`, `.heading-bold` - Weight variants
- `.heading-accent`, `.heading-muted` - Color variants

---

### Paragraph

**File:** `src/components/atoms/paragraph.html`

Text paragraphs for body content.

#### Variants

- **Default:** Standard paragraph text
- **Lead:** Larger, emphasized paragraph for introductions
- **Small:** Smaller text for captions and secondary content
- **Muted:** De-emphasized text with gray color
- **Bold:** Emphasized text with heavier weight

#### Usage

```html
<p class="paragraph">Standard paragraph text</p>
<p class="paragraph paragraph-lead">Lead paragraph for introduction</p>
<p class="paragraph paragraph-small">Small text for captions</p>
```

#### CSS Classes

- `.paragraph` - Base paragraph class (required)
- `.paragraph-lead` - Lead paragraph
- `.paragraph-small` - Small text
- `.paragraph-muted` - Muted color
- `.paragraph-bold` - Bold weight

---

### Badge

**File:** `src/components/atoms/badge.html`

Small labels and tags for categorization and status indication.

#### Variants

- **Default:** Gray background
- **Primary:** Blue background
- **Success:** Green background
- **Warning:** Yellow background
- **Error:** Red background
- **Info:** Light blue background
- **Outline:** Transparent with border

#### Sizes

- **Small (sm):** Compact badges
- **Medium (md):** Default size
- **Large (lg):** Larger badges

#### Shapes

- **Default:** Rounded corners
- **Pill:** Fully rounded (capsule shape)

#### Usage

```html
<span class="badge badge-primary badge-md">Primary</span>
<span class="badge badge-success badge-sm">Success</span>
<span class="badge badge-primary badge-md badge-pill">Pill</span>
```

#### CSS Classes

- `.badge` - Base badge class (required)
- `.badge-default`, `.badge-primary`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info` - Variant classes
- `.badge-sm`, `.badge-md`, `.badge-lg` - Size classes
- `.badge-pill` - Pill shape modifier

---

### Icon

**File:** `src/components/atoms/icon.html`

SVG icons for visual communication and UI enhancement.

#### Available Icons

- Chevron Right, Chevron Down
- Menu (Hamburger), Close (X)
- Search, Check, Arrow Right
- External Link, Mail, Phone
- User, Star

#### Sizes

- **XS:** 12px
- **SM:** 16px
- **MD:** 20px (default)
- **LG:** 24px
- **XL:** 32px
- **2XL:** 40px

#### Color Variants

- **Default:** Inherits current color
- **Primary:** Blue color
- **Success:** Green color
- **Error:** Red color
- **Warning:** Yellow color
- **Muted:** Gray color

#### Usage

```html
<!-- Search Icon -->
<svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"></circle>
  <path d="m21 21-4.35-4.35"></path>
</svg>
```

#### CSS Classes

- `.icon` - Base icon class (required)
- `.icon-xs`, `.icon-sm`, `.icon-md`, `.icon-lg`, `.icon-xl`, `.icon-2xl` - Size classes
- `.icon-primary`, `.icon-success`, `.icon-error`, `.icon-warning`, `.icon-muted` - Color variants

---

## Molecules

Coming soon. Molecules are combinations of atoms that form more complex UI components.

Planned molecules:
- Form groups (label + input)
- Cards
- Navigation items
- Feature blocks

---

## Organisms

Coming soon. Organisms are complex components built from molecules and atoms.

Planned organisms:
- Header with navigation
- Footer
- Forms
- Feature sections
- Hero sections

---

## Best Practices

### Accessibility

1. Always include appropriate ARIA attributes
2. Ensure keyboard navigation works properly
3. Use semantic HTML elements
4. Provide sufficient color contrast
5. Include focus states for interactive elements

### Performance

1. Use CSS custom properties for theming
2. Minimize JavaScript where possible
3. Optimize SVG icons
4. Use appropriate image formats
5. Lazy load images when applicable

### Consistency

1. Follow the established design tokens
2. Use standard spacing scale
3. Maintain consistent naming conventions
4. Document any custom variants
5. Keep components simple and focused

---

**Last Updated:** 2025-11-20
