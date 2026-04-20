# @yca-software/design-system

Shared React component library built with shadcn/ui and Tailwind CSS. Published as a **public** npm package.

## Publishing to npm

Publishing is handled by GitHub Actions (`.github/workflows/publish.yml`).

- Configure npm Trusted Publishing for this package:
  - npm package settings -> Trusted publishers
  - Add GitHub repository `yca-software/design-system`
  - Add workflow `.github/workflows/publish.yml`
  - Add environment `github`
- Bump `version` in `package.json`
- Create and push a version tag (`vX.Y.Z`) to trigger publish
- Or run the workflow manually from GitHub Actions (`workflow_dispatch`)

## Available Components

### UI Components (shadcn/ui based)

- `Button` - Button component with variants (default, destructive, outline, secondary, ghost, link)
- `Input` - Input field component
- `Textarea` - Multi-line text input component
- `Label` - Label component for forms
- `Card` - Card container component (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- `Alert` - Alert/notification component
- `AlertDialog` - Alert dialog component
- `ConfirmDialog` - Reusable confirmation dialog wrapper
- `Dialog` - Modal dialog component
- `Form` - Form components (FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription)
- `FormDrawer` - Sheet-based drawer shell for forms
- `FormSubmitButton` - Submit button with built-in pending/loading state
- `DropdownMenu` - Dropdown menu component
- `Avatar` - Avatar component
- `Calendar` - Calendar component
- `Checkbox` - Checkbox form control
- `DatePicker` - Single-date picker input
- `DateRangePicker` - Date-range picker with optional presets
- `Link` - Link component
- `Popover` - Popover container component
- `ScrollArea` - Scrollable area component
- `Select` - Select/dropdown form control
- `Separator` - Separator/divider component
- `Sheet` - Side sheet component
- `Table` - Table component
- `Tooltip` - Tooltip component
- `Typography` - Typography components (Heading, Paragraph)

### Marketing Components

Landing-page blocks inspired by common marketing patterns (similar _categories_ to [Tailwind Plus marketing UI blocks](https://tailwindcss.com/plus/ui-blocks), but **original implementations**—do not paste licensed Plus source into this package). Application-shell and ecommerce blocks live under `ui/` or can be composed separately.

- `Navigation` - Fixed header with blur, shadow, and mobile drawer
- `Hero` - Centered hero with ambient mesh (`ds-mkt-hero-mesh`) + CTAs
- `HeroSplit` - Split hero with gradient frame around media (`ds-mkt-media-frame`)
- `Section` - Section wrapper; optional `variant`: `default` | `soft` | `spotlight`
- `FeatureMedia` - Alternating image + copy (`imagePosition`: left or right)
- `LogoCloud` - Partner logos inside elevated “rail” (`ds-mkt-logo-rail`)
- `StatsStrip` - Metrics with gradient numerals (`ds-mkt-stat-value`)
- `Testimonial` - Quote in frosted glass panel (`ds-mkt-glass-panel`)
- `VideoShowcase` - 16:9 embed or HTML5 `video` with glow
- `CtaBanner` - Ambient shell + frosted inner panel (`ds-mkt-cta-shell` / `ds-mkt-cta-panel`; solid: `ds-mkt-cta-solid-*`) and hero-style gradient CTAs
- `BentoFeatures` - Bento tiles (`ds-mkt-bento-tile`, `ds-mkt-bento-icon-wrap`) on a soft section background
- `ServiceCard` - Feature card with layered shadow / hover lift
- `Footer` - Footer with gradient depth (`ds-mkt-footer-depth`)
- `PricingSection` - Tiered pricing (optional monthly/annual toggle, savings badge, tier badges, feature comparison table)
- `FaqSection` - FAQ via native `<details>` / `<summary>`
- `Newsletter` - Email capture (wire `formAction` or `children`)
- `TeamGrid` - Team portraits with gradient media frames
- `ContactSection` - Contact channels + right column slot for a form
- `BlogTeaser` - Post grid with image hover and lift
- `PromoBanner` - Top announcement strip (optional dismiss)
- `TrustBadges` - Trust / compliance chips with optional icons

### Theme Components

- `ThemeProvider` - Theme context/provider for app-level theming
- `ThemeToggle` - UI toggle for switching themes

### Utilities

- `cn` - Utility function for merging Tailwind classes (clsx + tailwind-merge)
- `getFlagEmoji` - Maps language codes to flag emojis

## Adding New Components

1. Add the component file to:
   - `src/components/ui/` for basic UI components (shadcn/ui style)
   - `src/components/marketing/` for marketing site components
   - Or create a new subdirectory for component groups
2. Export it from `src/components/index.ts` (or the appropriate index file like `src/components/ui/index.ts` or `src/components/marketing/index.ts`)
3. Update this README

## Styling

Components use Tailwind CSS (v4) with CSS variables for theming.

Import the canonical theme tokens once in your app’s global CSS:

```css
@import "tailwindcss";
@import "@yca-software/design-system/styles.css";
```

Marketing blocks also ship **namespaced CSS utilities** (`ds-mkt-*`): motion (`ds-mkt-fade-up`, `ds-mkt-cta-gradient`, …), **depth** (`ds-mkt-surface-elevated`, `ds-mkt-glass-panel`, `ds-mkt-media-frame`, `ds-mkt-logo-rail`, `ds-mkt-footer-depth`, …), section backdrops (`ds-mkt-section-soft`, `ds-mkt-section-spotlight`, `ds-mkt-hero-mesh`), and CTA helpers (`ds-mkt-btn-primary`, `ds-mkt-btn-secondary`). They respect `prefers-reduced-motion` (including gradient stat text). Use them via the components above or in your own markup.

## Testing

The component library uses [Vitest](https://vitest.dev/) for unit testing and [React Testing Library](https://testing-library.com/react) for component testing.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Component Documentation (Storybook)

The component library uses [Storybook](https://storybook.js.org/) for interactive component documentation.

### Viewing Components

```bash
# Start the documentation server
pnpm dev:docs

# Build static documentation
pnpm build:docs

# Preview built documentation
pnpm preview:docs
```

The documentation will be available at `http://localhost:6006` by default.
