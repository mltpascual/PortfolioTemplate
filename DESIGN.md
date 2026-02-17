# Design System: Portfolio Template

**Tech Stack:** React 19 + Tailwind CSS 4 + shadcn/ui (Radix UI)
**CSS Approach:** Tailwind utility-first with CSS custom properties (OKLCH color format)
**Last Updated:** February 2026

---

## 1. Visual Theme & Atmosphere

The portfolio embodies a **Warm Monochrome Editorial** aesthetic — the kind of refined, unhurried elegance found in high-end architecture magazines. The atmosphere is spacious and intentional, with generous white space that lets content breathe. The overall mood is warm, professional, and quietly confident.

The design avoids the cold, clinical feel of typical developer portfolios. Instead, it uses cream backgrounds, terracotta accents, and serif typography to create something that feels handcrafted rather than assembled. The visual density is moderate — content sections are well-separated with ample padding, but information-rich enough to be substantive.

**Light mode** is the default, featuring warm cream backgrounds with charcoal text. **Dark mode** inverts the palette to deep charcoal backgrounds with warm ivory text, while preserving the terracotta accent color. The theme is toggled via a moon/sun icon in the navbar and persists in localStorage.

The design style is best described as **editorial minimalism with warmth** — clean lines and structured layouts softened by organic color tones and expressive serif typography.

---

## 2. Color Palette & Roles

### Core Colors

| Role | Name | Value (OKLCH) | CSS Variable | Usage |
|---|---|---|---|---|
| Background | Warm Cream | `oklch(0.97 0.008 80)` | `--background`, `--t-cream` | Page background, section backgrounds |
| Foreground | Deep Charcoal | `oklch(0.25 0.01 60)` | `--foreground`, `--t-charcoal` | Primary body text, headings |
| Primary | Burnt Terracotta | `oklch(0.58 0.15 35)` | `--primary`, `--t-terracotta` | CTAs, active nav links, accent elements |
| Primary Foreground | Warm White | `oklch(0.98 0.005 85)` | `--primary-foreground` | Text on terracotta buttons |
| Secondary | Soft Warm Gray | `oklch(0.94 0.01 70)` | `--secondary` | Secondary backgrounds, hover states |
| Muted | Warm Mist | `oklch(0.94 0.01 70)` | `--muted` | Disabled states, subtle backgrounds |
| Muted Foreground | Warm Gray | `oklch(0.50 0.02 55)` | `--muted-foreground` | Secondary text, captions |
| Destructive | Alert Red | `oklch(0.577 0.245 27.325)` | `--destructive` | Delete buttons, error states |

### Warm Editorial Palette

| Name | Value (OKLCH) | CSS Variable | Usage |
|---|---|---|---|
| Warm 50 | `oklch(0.98 0.005 70)` | `--color-warm-50` | Lightest background tint |
| Warm 100 | `oklch(0.96 0.01 65)` | `--color-warm-100` | Tag backgrounds, subtle fills |
| Warm 200 | `oklch(0.92 0.015 60)` | `--color-warm-200` | Borders, dividers |
| Warm 300 | `oklch(0.85 0.03 55)` | `--color-warm-300` | Placeholder icons |
| Warm 400 | `oklch(0.72 0.06 50)` | `--color-warm-400` | Secondary icons |
| Terracotta Light | `oklch(0.68 0.12 38)` | `--color-terracotta-light` | Hover states, active pill backgrounds |
| Terracotta | `oklch(0.58 0.15 35)` | `--color-terracotta` | Primary accent |
| Terracotta Dark | `oklch(0.48 0.16 32)` | `--color-terracotta-dark` | Pressed states, dark accent |
| Ivory | `oklch(0.98 0.005 85)` | `--color-ivory` | Card backgrounds |
| Charcoal Light | `oklch(0.40 0.01 60)` | `--color-charcoal-light` | Secondary text |

### Dark Mode Adjustments

In dark mode, the palette inverts while preserving warmth:

| Token | Light Value | Dark Value | Effect |
|---|---|---|---|
| `--t-cream` | `oklch(0.97 0.008 80)` | `oklch(0.18 0.01 60)` | Cream → Deep charcoal |
| `--t-ivory` | `oklch(0.98 0.005 85)` | `oklch(0.22 0.01 55)` | Ivory → Dark slate |
| `--t-charcoal` | `oklch(0.25 0.01 60)` | `oklch(0.92 0.01 70)` | Charcoal → Warm white |
| `--t-charcoal-light` | `oklch(0.40 0.01 60)` | `oklch(0.75 0.02 65)` | Gray → Light warm gray |
| `--t-warm-50` | `oklch(0.98 0.005 70)` | `oklch(0.22 0.015 55)` | Near-white → Near-black |
| `--t-warm-100` | `oklch(0.96 0.01 65)` | `oklch(0.26 0.02 50)` | Light → Dark |
| `--t-terracotta` | Unchanged | Unchanged | Accent stays consistent |

Dark mode is applied by toggling the `.dark` class on the `<html>` element via `useThemeSettings` hook. The `@custom-variant dark (&:is(.dark *))` directive in Tailwind 4 handles conditional styling.

---

## 3. Typography System

### Font Stack

| Role | Family | Fallback | CSS Variable | Character |
|---|---|---|---|---|
| Display / Headings | DM Serif Display | Georgia, serif | `--font-display` | Elegant, editorial, high-contrast serifs |
| Body / UI | DM Sans | system-ui, sans-serif | `--font-body` | Clean, geometric, highly readable |

Fonts are loaded via Google Fonts CDN in `client/index.html`. The heading font is customizable through the admin panel (15 options including Playfair Display, Montserrat, Space Grotesk). The body font is also customizable (15 options including Inter, Poppins, Outfit).

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Hero Heading | `text-5xl` to `text-7xl` | 400 (serif natural) | 1.1 | Main hero tagline |
| Section Heading | `text-3xl` to `text-4xl` | 400 | 1.2 | Section titles (About, Skills, etc.) |
| Card Title | `text-lg` to `text-xl` | 600 | 1.3 | Project titles, experience roles |
| Body | `text-base` (16px) | 400 | 1.5–1.75 | Paragraphs, descriptions |
| Caption | `text-sm` (14px) | 400–500 | 1.5 | Tags, metadata, secondary info |
| Micro | `text-xs` (12px) | 500 | 1.4 | Badges, timestamps, admin labels |

### Typographic Treatments

- Section headings use a decorative underline via `::after` pseudo-element with terracotta color
- Hero tagline uses the display font at maximum size with tight line-height for dramatic impact
- Skill category titles use the display font for visual hierarchy
- Admin panel uses the body font exclusively for functional clarity

---

## 4. Spacing & Layout

### Spacing Scale

The project uses Tailwind's default spacing scale (4px base unit):

| Token | Value | Common Usage |
|---|---|---|
| `p-1` / `gap-1` | 4px | Tight icon spacing |
| `p-2` / `gap-2` | 8px | Inline element gaps |
| `p-3` / `gap-3` | 12px | Card internal padding (compact) |
| `p-4` / `gap-4` | 16px | Standard card padding, section gaps |
| `p-6` / `gap-6` | 24px | Section internal padding |
| `p-8` / `gap-8` | 32px | Major section separation |
| `py-16` / `py-20` | 64px–80px | Section vertical padding |
| `py-24` / `py-32` | 96px–128px | Hero section padding |

### Grid & Container

| Property | Value | Notes |
|---|---|---|
| Max width | 1280px (`max-w-7xl`) | Applied at `lg` breakpoint |
| Container padding | 1rem (mobile), 1.5rem (sm), 2rem (lg) | Auto-centered with `mx-auto` |
| Project grid | 1 col (mobile) → 2 col (md) → 3 col (lg) | Responsive CSS grid |
| Skills grid | 1 col (mobile) → 2 col (md) | Two-column layout |
| Experience layout | Single column, stacked cards | Timeline-style |

### Breakpoints

| Name | Value | Behavior |
|---|---|---|
| `sm` | 640px | Tablet portrait — expanded padding |
| `md` | 768px | Tablet landscape — 2-column grids |
| `lg` | 1024px | Desktop — 3-column grids, max-width container |
| `xl` | 1280px | Wide desktop — no additional changes |

---

## 5. Component Stylings

### Buttons

**Pill Primary** (`.pill-primary`): Full terracotta background, white text, `border-radius: 9999px`, `padding: 0.75rem 2rem`. On hover: darker terracotta, subtle upward translate (`-1px`), enhanced shadow. Used for primary CTAs ("View My Work", "Get In Touch").

**Pill Outline** (`.pill-outline`): Transparent background with charcoal border, `border-radius: 9999px`. On hover: warm-100 background fill. Used for secondary actions ("Let's Connect", "Resume").

**shadcn/ui Button**: Standard rectangular buttons with `border-radius: var(--radius)` (0.75rem). Variants: `default` (terracotta), `outline` (transparent), `ghost` (no border), `destructive` (red). Used in admin panel.

### Cards & Containers

**Warm Card** (`.warm-card`): Ivory background (`--color-ivory`), subtle warm border (`--color-warm-200`), generous rounded corners (`rounded-2xl` / 1rem), soft shadow (`0 1px 3px warm-900/5`). On hover: slight upward translate and enhanced shadow. Used for project cards, skill cards, experience cards.

**Admin Cards**: shadcn/ui Card component with standard `bg-card` background, `rounded-lg` corners, `border-border` borders.

**Admin List/Tile Toggle**: All admin tabs (Projects, Experience, Skills, Education) support switching between a tile grid view and a compact list view. The toggle uses `LayoutGrid` / `List` icons from Lucide. List view shows a thumbnail, title, metadata, and action buttons in a single row for efficient reordering.

**Duplicate Button**: Each item in all admin tabs has a copy icon button that creates a clone with "(Copy)" appended to the title.

### Inputs & Forms

- Border: `border-warm-200` (light mode), focus ring: `ring-terracotta`
- Focus state: 2px terracotta ring with slight shadow
- Error state: `border-destructive` with red text below
- Label: `text-sm font-medium text-charcoal` positioned above input
- Admin panel uses shadcn/ui Input, Select, Textarea components

### Navigation

**Desktop**: Horizontal nav bar with pill-shaped active indicator (`bg-terracotta-light/20 text-terracotta`). Links use `text-charcoal-light` with hover transition to `text-charcoal`. Fixed at top with `backdrop-blur-md` and warm cream background with 80% opacity.

**Mobile**: Hamburger menu (three-line icon) that opens a full-width dropdown panel. Same link styling as desktop. Menu icon animates to X on open.

**Scroll Spy**: Active section is highlighted in the nav based on IntersectionObserver detection of which section is in view.

### Modals & Dialogs

- shadcn/ui Dialog with `bg-popover` background
- Overlay: semi-transparent black backdrop
- Animation: fade-in with slight scale
- Close: X button in top-right corner

### Data Display

**Tags/Badges**: Small pill-shaped elements (`rounded-full`) with `bg-warm-100` background and `text-charcoal-light` text. Font size `text-xs` to `text-[9px]` for compact display.

**Admin Tables**: shadcn/ui Table with `bg-card` rows, `border-b` separators, hover highlight.

---

## 6. Depth & Elevation

The design uses a **whisper-soft shadow** approach — shadows are present but barely noticeable, creating subtle depth without heaviness.

| Level | Shadow | Usage |
|---|---|---|
| Level 0 | None | Flat elements, inline content |
| Level 1 | `0 1px 3px warm-900/5` | Cards at rest |
| Level 2 | `0 4px 12px warm-900/8` | Cards on hover, navbar |
| Level 3 | `0 8px 24px warm-900/12` | Modals, dropdowns |

The navbar uses `backdrop-blur-md` for a frosted glass effect over scrolled content. No glassmorphism or heavy blur effects elsewhere — the design relies on color and spacing for hierarchy rather than depth.

**Z-index scale**: Navbar at `z-50`, mobile menu overlay at `z-40`, modals at `z-50` (via Radix UI portal).

---

## 7. Motion & Animation

### Scroll Animations

Every section uses IntersectionObserver-driven entrance animations:

| Animation | Properties | Duration | Easing |
|---|---|---|---|
| Fade-in + Slide-up | `opacity: 0→1`, `translateY: 30px→0` | 600ms | `ease-out` |
| Trigger | When section enters viewport (10% threshold) | Once | Non-reversible |

### Hover Transitions

| Element | Effect | Duration |
|---|---|---|
| Buttons | Background color shift, `translateY(-1px)`, shadow enhance | 200ms `ease-out` |
| Cards | `translateY(-4px)`, shadow enhance | 300ms `ease-out` |
| Nav links | Color transition | 200ms |
| Social icons | Scale to 1.1, color shift | 200ms |

### Dark Mode Toggle

The moon/sun icon button uses a smooth rotation and scale animation on toggle.

### Drag-and-Drop

Admin panel reordering uses `@dnd-kit` with `DragOverlay` for a smooth visual experience. The dragged item lifts with `rotate(2deg)` and `scale(1.02)` while the original position shows reduced opacity. `TouchSensor` is enabled for mobile with a 5px activation distance.

### Motion Philosophy

Motion is purposeful and sparse. Each section gets one entrance animation. Interactive elements get subtle hover feedback. No decorative motion, no parallax, no continuous animations. Respects `prefers-reduced-motion` by disabling animations.

---

## 8. Iconography & Assets

**Icon Library**: Lucide React (`lucide-react` v0.453.0) — consistent line-weight icons with 24×24 default size.

**Icon Sizing**:

| Context | Size | Example |
|---|---|---|
| Inline with text | `w-4 h-4` (16px) | Nav items, button icons |
| Card icons | `w-5 h-5` (20px) | Social links, action buttons |
| Section icons | `w-6 h-6` to `w-8 h-8` | Skill category icons |
| Hero decorative | `w-10 h-10` | Feature highlights |

**Image Handling**: Project images use `object-cover object-top` to show the header/top portion of screenshots. Aspect ratio is `aspect-video` (16:9) for project cards.

**Logo & Favicon**: Custom MP monogram (terracotta circle with white interlocking M and P letters). Displayed at `w-8 h-8` in the navbar alongside the site name. Favicon generated at 16, 32, 48, 64, 128, 192, and 512px sizes plus ICO and apple-touch-icon.

---

## 9. Accessibility Notes

| Aspect | Implementation |
|---|---|
| Color contrast | OKLCH values chosen for 4.5:1+ ratio (charcoal on cream, white on terracotta) |
| Focus indicators | Default browser focus ring preserved via `outline-ring/50` on all elements |
| Keyboard navigation | Tab order follows visual order; all interactive elements reachable |
| ARIA labels | Dark mode toggle has `aria-label`; social links have descriptive titles |
| Semantic HTML | `<main>`, `<nav>`, `<section>`, `<footer>` used throughout |
| Alt text | All project images have `alt={project.title}` |
| Reduced motion | Animations can be disabled via `prefers-reduced-motion` |
| Touch targets | Mobile nav items and buttons meet 44×44px minimum |

---

## 10. Design Conventions & Rules

### Naming Conventions

- CSS custom properties use `--t-*` prefix for theme-overridable tokens
- Component classes use descriptive names: `.warm-card`, `.pill-primary`, `.pill-outline`
- Tailwind utilities are preferred over custom CSS for one-off styling

### Component Composition

- Sections follow a consistent pattern: `<section id="name">` → container → heading with decorative underline → content grid → spacer
- All section components accept a `customTitle` prop for admin-configurable headers
- Cards use the `.warm-card` base class with additional Tailwind utilities

### Responsive Strategy

- Mobile-first: base styles target mobile, then `sm:`, `md:`, `lg:` for larger screens
- Grid columns increase at breakpoints (1 → 2 → 3)
- Typography scales up at `md` breakpoint
- Navbar switches from hamburger to horizontal at `lg`

### Theme Customization

The admin panel allows customization of:

- Heading font (15 serif and sans-serif options)
- Body font (15 sans-serif options)
- Accent color (hex picker, replaces terracotta)
- Section visibility (show/hide any section)
- Section titles (rename any section header)
- Layout (section order and arrangement)

All customizations are applied dynamically via the `useThemeSettings` hook, which injects CSS custom properties into the document root.
