# Development Guidelines

> **Portfolio Template** — A reusable, dynamic software engineer portfolio with full-stack architecture (React + Express + tRPC + Supabase). These guidelines synthesize 8 specialized development skills into a single reference for all contributors and AI agents.

---

## Table of Contents

1. [UI/UX & Frontend Design](#1-uiux--frontend-design)
2. [Code Quality & Best Practices](#2-code-quality--best-practices)
3. [Security](#3-security)
4. [Testing](#4-testing)
5. [Project-Specific Conventions](#5-project-specific-conventions)

---

## 1. UI/UX & Frontend Design

*Synthesized from: frontend-design, ui-ux-pro-max, web-design-guidelines*

### 1.1 Design Philosophy

This portfolio follows a **Warm Monochrome Editorial** aesthetic — intentional, memorable, and production-grade. Every design decision must satisfy four criteria:

| Criterion | Description |
|---|---|
| **Intentional Aesthetic** | Named design stance: warm editorial with terracotta accents on cream backgrounds |
| **Technical Correctness** | Real, working React/Tailwind code — not mockups |
| **Visual Memorability** | DM Serif Display typography and terracotta color story create instant recognition |
| **Cohesive Restraint** | No random decoration; every flourish serves the editorial thesis |

### 1.2 Typography Rules

- **Display font**: DM Serif Display (expressive, editorial)
- **Body font**: DM Sans (restrained, readable)
- Use typography structurally — scale, rhythm, and contrast define hierarchy
- Minimum 16px body text on mobile; line-height 1.5–1.75 for body text
- Limit line length to 65–75 characters per line

### 1.3 Color System

- **Dominant tone**: Warm cream (`--color-cream`) and charcoal (`--color-charcoal`)
- **Accent**: Terracotta (`--color-terracotta`) for CTAs and highlights
- **Neutral system**: Warm grays (`--color-warm-*`)
- All colors defined as CSS custom properties in `client/src/index.css`
- Dark mode supported via `.dark` class with inverted variables
- Maintain 4.5:1 minimum contrast ratio for all text

### 1.4 Spatial Composition & Layout

- Use asymmetric layouts for the hero section; avoid generic centered patterns
- White space is a design element, not absence
- Consistent spacing rhythm via Tailwind utility classes
- All sections use IntersectionObserver-driven fade-in/slide-up animations
- Reserve space for async content to prevent content jumping

### 1.5 Motion & Animation

- Motion must be purposeful, sparse, and high-impact
- One strong entrance sequence per section (scroll-triggered)
- Meaningful hover states on interactive elements (scale, color transitions)
- Use CSS `transform` and `opacity` for performant animations (150–300ms)
- Respect `prefers-reduced-motion` media query

### 1.6 Accessibility (Critical Priority)

| Rule | Requirement |
|---|---|
| Color contrast | 4.5:1 ratio minimum for normal text |
| Focus states | Visible focus rings on all interactive elements |
| Alt text | Descriptive alt text for meaningful images |
| ARIA labels | `aria-label` for icon-only buttons (dark mode toggle, social links) |
| Keyboard navigation | Tab order matches visual order |
| Form labels | Use `<label>` with `for` attribute |
| Touch targets | Minimum 44×44px on mobile |

### 1.7 Responsive Design

- Mobile-first approach with thoughtful breakpoints (`sm`, `md`, `lg`)
- Navbar collapses to hamburger menu on mobile
- Project grid adapts from 1 to 3 columns
- Skills grid adapts from 1 to 2 columns
- Test on viewport widths: 320px, 768px, 1024px, 1440px

### 1.8 Component Standards

- Use shadcn/ui components from `@/components/ui/*` for consistent interactions
- Compose Tailwind utilities with component variants for layout and states
- Extract shared UI into `client/src/components/` for reuse
- Show loading states at component level (spinners, skeletons)
- Handle loading, empty, and error states in every data-fetching component

---

## 2. Code Quality & Best Practices

*Synthesized from: clean-code, code-reviewer*

### 2.1 Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Variables/functions | camelCase, intention-revealing | `elapsedTimeInDays`, `isPasswordValid` |
| React components | PascalCase, noun-based | `ProjectsSection`, `SortableProjectItem` |
| Database columns | snake_case | `full_name`, `hero_tagline` |
| CSS variables | kebab-case with prefix | `--color-terracotta`, `--font-display` |
| Test files | `*.test.ts` alongside source | `server/theme.test.ts` |
| Constants | UPPER_SNAKE_CASE | `UNAUTHED_ERR_MSG` |

### 2.2 Function Design

- Functions should be shorter than 20 lines when possible
- Each function does exactly one thing
- 0–2 arguments is ideal; 3+ requires strong justification
- No side effects — functions should not secretly change global state
- Use descriptive names: `bulkUpdateProjectTags` not `updateTags`

### 2.3 File Organization

```
client/src/
  pages/          ← Page-level components (Home, Admin, NotFound)
  components/     ← Reusable UI (sections, layout, shared)
  hooks/          ← Custom hooks (useThemeSettings, usePortfolio)
  contexts/       ← React contexts (ThemeContext)
  lib/            ← Utilities (trpc client, utils)

server/
  _core/          ← Framework plumbing (DO NOT EDIT)
  db.ts           ← All Supabase query helpers
  routers.ts      ← All tRPC procedures
  storage.ts      ← S3 file storage helpers
  *.test.ts       ← Vitest test files

drizzle/          ← Schema & migrations (MySQL/TiDB)
shared/           ← Shared types and constants
```

### 2.4 Code Review Checklist

Before merging any change:

- [ ] Names are searchable and intention-revealing
- [ ] Functions do one thing and are under 20 lines
- [ ] No dead code, unused imports, or commented-out blocks
- [ ] Error states are handled (try-catch, error boundaries)
- [ ] Loading and empty states exist for async data
- [ ] No `any` types unless absolutely necessary
- [ ] Database queries use parameterized inputs (Supabase client handles this)
- [ ] Sensitive data is not exposed in client-side code

### 2.5 Comments Policy

- Don't comment bad code — rewrite it
- Good comments: legal headers, regex intent, external library clarification, TODOs
- Bad comments: redundant, misleading, noise, position markers
- Express intent through code structure, not comments

### 2.6 Error Handling

- Use exceptions instead of return codes
- Never return `null` from functions that should return data — return empty arrays/objects
- Sanitize error messages before sending to clients (no stack traces, no internal paths)
- Log errors server-side with context (`console.error('[DB] Failed to...')`)

---

## 3. Security

*Synthesized from: api-security-best-practices, find-bugs*

### 3.1 Authentication & Authorization

This project uses Manus OAuth with JWT session cookies:

- All protected routes use `protectedProcedure` which injects `ctx.user`
- Admin-only operations use `adminProcedure` with role check (`ctx.user.role === 'admin'`)
- Never hardcode domains in OAuth redirect URLs — use `window.location.origin`
- Session cookies are HttpOnly, Secure, SameSite=Lax

### 3.2 Input Validation (Critical)

Every tRPC procedure must validate inputs with Zod:

| Validation | Implementation |
|---|---|
| Text fields | `z.string().min(1).max(limit)` with `.trim()` |
| URLs | `z.string().url()` with protocol whitelist (`https://`) |
| Numbers | `z.number().int().min(0).max(limit)` |
| Enums | `z.enum([...allowed])` for constrained values |
| Optional fields | `.optional()` or `.nullable()` |

### 3.3 Security Checklist

For every code change, verify:

- [ ] **Injection**: All inputs validated with Zod schemas; Supabase client parameterizes queries
- [ ] **XSS**: User-generated content sanitized before rendering; URLs validated
- [ ] **Authentication**: Auth checks on all protected operations via `protectedProcedure`
- [ ] **Authorization/IDOR**: Access control verified — admin routes check `ctx.user.role`
- [ ] **Information disclosure**: Error messages sanitized; no stack traces in responses
- [ ] **DoS**: Input length limits on all text fields; file size limits on uploads
- [ ] **Business logic**: Edge cases handled (empty arrays, null values, concurrent updates)

### 3.4 Data Protection

- All API traffic over HTTPS
- Sensitive environment variables managed through `webdev_request_secrets`
- Never store secrets in code or `.env` files committed to git
- Database credentials use service role key only on server side
- Public Supabase client (anon key) respects Row Level Security

### 3.5 File Upload Security

- Validate file types and sizes before upload
- Use S3 (`storagePut`) for file storage — never store file bytes in database
- Add random suffixes to file keys to prevent enumeration
- Store metadata (path, URL, mime type, size) in database; S3 for bytes only

---

## 4. Testing

*Synthesized from: e2e-testing-patterns*

### 4.1 Testing Strategy

| Layer | Tool | Location | Purpose |
|---|---|---|---|
| Unit/Integration | Vitest | `server/*.test.ts` | Backend logic, API procedures, database helpers |
| E2E | Playwright | `e2e/*.spec.ts` | Critical user journeys, full-stack flows |

### 4.2 Vitest Standards

- Every new feature must have corresponding tests before delivery
- Tests follow the pattern in `server/auth.logout.test.ts` (reference file)
- Mock external dependencies (Supabase) at the module level
- Test both success and error paths
- Use descriptive test names: `"returns 401 when not authenticated"`

### 4.3 Test Organization

```typescript
describe('Feature Name', () => {
  describe('Happy Path', () => {
    it('creates a project with valid input', async () => { ... });
    it('updates project tags in bulk', async () => { ... });
  });
  
  describe('Error Handling', () => {
    it('rejects invalid URLs', async () => { ... });
    it('requires admin role for mutations', async () => { ... });
  });
});
```

### 4.4 E2E Testing Principles

- Test critical user journeys: portfolio viewing, admin CRUD, theme changes
- Use stable selectors (`data-testid`, semantic roles) over CSS classes
- Implement retries for flaky network-dependent tests
- Run in CI with parallelization and artifact capture
- Never run destructive tests against production data

### 4.5 What to Test

| Must Test | Nice to Test | Don't Test |
|---|---|---|
| API input validation | Animation timing | Framework internals |
| Auth/admin guards | Responsive breakpoints | shadcn/ui components |
| CRUD operations | Dark mode toggle | Third-party libraries |
| Error responses | Scroll behavior | CSS styling |
| Data transformations | Image loading | |

---

## 5. Project-Specific Conventions

### 5.1 Database Pattern

This project uses a **dual-database** architecture:

- **Supabase (PostgreSQL)**: Primary data store for portfolio content (profile, projects, experiences, skills, education, theme settings)
- **MySQL/TiDB (Drizzle)**: User authentication and session management

All Supabase queries go through helper functions in `server/db.ts`. Every helper:
1. Uses the appropriate client (public for reads, admin for writes)
2. Converts between snake_case (DB) and camelCase (API)
3. Returns typed results

### 5.2 tRPC Procedure Pattern

```typescript
// Public data (no auth required)
publicProcedure → getProjects(), getProfile()

// Authenticated user required
protectedProcedure → ctx.user available

// Admin only (role check)
adminProcedure → ctx.user.role === 'admin'
```

### 5.3 Theme Settings

Theme settings (font, accent color, section visibility, section titles, layout) are stored in Supabase `theme_settings` table and applied dynamically via the `useThemeSettings` hook. Changes in the admin panel take effect immediately.

### 5.4 Adding New Sections

To add a new portfolio section:

1. Create `client/src/components/NewSection.tsx` with `customTitle` prop
2. Add section to `Home.tsx` with visibility check from theme settings
3. Add section to navbar links in `Navbar.tsx`
4. Add section key to `SECTION_LABELS` in `Admin.tsx` LayoutTab
5. Add default title to the section titles system
6. Write tests for any new API procedures

### 5.5 Reusability

This template is designed to be reusable. When forking for a new portfolio:

1. Update Supabase credentials via environment variables
2. Populate portfolio data through the admin panel (no code changes needed)
3. Customize theme (font, colors, accent) through admin Layout tab
4. All content is database-driven — zero hardcoded portfolio data in components
