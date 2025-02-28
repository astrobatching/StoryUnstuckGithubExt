# Story Unstuck Design System

## 1. Color Palette

### Primary Colors
```css
--color-primary: #000000;     /* Pure Black - Main actions, text */
--color-primary-hover: #1a1a1a;
--color-primary-active: #333333;

--color-accent: #00FFF0;      /* Cyan - Highlights, active states */
--color-accent-hover: #00e6d9;
--color-accent-active: #00ccc2;
```

### Secondary Colors
```css
--color-secondary-1: #FF3AF2; /* Pink - Storylines, emphasis */
--color-secondary-2: #FFE600; /* Yellow - Warnings, highlights */
--color-secondary-3: #4DFF4D; /* Green - Success states */
```

### Neutral Colors
```css
--color-gray-50: #fafafa;
--color-gray-100: #f5f5f5;
--color-gray-200: #e5e5e5;
--color-gray-300: #d4d4d4;
--color-gray-400: #a3a3a3;
--color-gray-500: #737373;
--color-gray-600: #525252;
--color-gray-700: #404040;
--color-gray-800: #262626;
--color-gray-900: #171717;
```

### Semantic Colors
```css
--color-success: #4DFF4D;
--color-warning: #FFE600;
--color-error: #FF4D4D;
--color-info: #00FFF0;
```

## 2. Typography

### Font Families
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## 3. Spacing

### Base Spacing
```css
--spacing-px: 1px;
--spacing-0: 0;
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
```

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

### Breakpoints
```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

## 4. Components

### Buttons

#### Base Button
```css
.btn {
  padding: 0.5rem 1rem;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border-radius: 0;
  border-width: 2px;
  transition: all 200ms;
}
```

#### Variants
```css
.btn-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-ghost {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Cards
```css
.card {
  border: 4px solid var(--color-primary);
  background: white;
  transition: transform 200ms, box-shadow 200ms;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

## 5. Layout

### Grid System
- Use CSS Grid for main layouts
- 12-column grid system
- Gap (gutter) width: 1rem (16px) default

```css
.grid {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(12, minmax(0, 1fr));
}
```

### Container
```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

@media (min-width: 640px) {
  .container {
    max-width: var(--container-sm);
  }
}

@media (min-width: 768px) {
  .container {
    max-width: var(--container-md);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: var(--container-lg);
  }
}
```

## 6. Icons

### Icon Sizes
```css
--icon-xs: 0.75rem;  /* 12px */
--icon-sm: 1rem;     /* 16px */
--icon-md: 1.25rem;  /* 20px */
--icon-lg: 1.5rem;   /* 24px */
--icon-xl: 2rem;     /* 32px */
```

### Usage Guidelines
- Use Lucide React icons consistently
- Match icon weight/style with typography
- Maintain consistent padding/margins around icons
- Use appropriate sizes based on context:
  - Navigation: --icon-sm
  - Buttons: --icon-xs to --icon-sm
  - Headers: --icon-md to --icon-lg
  - Features: --icon-xl

## 7. Design Principles

### Minimalism
- Clean, uncluttered layouts
- Generous whitespace
- Strong typography hierarchy
- Bold, high-contrast elements

### Consistency
- Maintain consistent spacing
- Use established color patterns
- Follow typography scale
- Align to grid system

### Accessibility
- Maintain WCAG 2.1 AA standards
- Ensure sufficient color contrast
- Provide focus indicators
- Support keyboard navigation

### Responsiveness
- Mobile-first approach
- Fluid typography
- Flexible grids
- Breakpoint-based layouts

## 8. Implementation

### Tailwind Configuration
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        accent: '#00FFF0',
        secondary: {
          pink: '#FF3AF2',
          yellow: '#FFE600',
          green: '#4DFF4D'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderWidth: {
        '3': '3px',
        '6': '6px'
      }
    }
  }
}
```

### CSS Custom Properties
```css
/* styles/variables.css */
:root {
  /* Import all color variables */
  --color-primary: #000000;
  --color-accent: #00FFF0;
  /* ... other variables ... */
}
```

### Usage Examples

#### Button Component
```tsx
<Button
  variant="primary"
  size="default"
  className="flex items-center gap-2"
>
  <Plus className="h-4 w-4" />
  Add Item
</Button>
```

#### Card Component
```tsx
<Card className="border-4 border-black p-4 hover:-translate-y-1 transition-all">
  <CardHeader>
    <h3 className="font-bold text-lg">Card Title</h3>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

#### Layout Component
```tsx
<div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Grid items */}
  </div>
</div>
```

## 9. Best Practices

### Code Organization
- Use consistent naming conventions
- Group related styles
- Comment complex implementations
- Keep components focused and reusable

### Performance
- Minimize CSS specificity
- Use utility classes when possible
- Avoid deep nesting
- Optimize for code splitting

### Maintenance
- Document style changes
- Update style guide regularly
- Review for consistency
- Test across breakpoints

### Version Control
- Track style guide changes
- Document breaking changes
- Maintain changelog
- Use semantic versioning