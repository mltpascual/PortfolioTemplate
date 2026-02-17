# C4 Code Level — Portfolio Template

This document provides code-level detail for the most important modules. For the full codebase, refer to the source files directly.

---

## Server: Database Helpers (`server/db.ts`)

### Supabase Client Management

| Function | Visibility | Description |
|---|---|---|
| `getSupabase()` | Private | Returns singleton Supabase client with anon key (respects RLS) |
| `getSupabaseAdmin()` | Private | Returns singleton Supabase client with service role key (bypasses RLS) |

### Profile Operations

| Function | Signature | Description |
|---|---|---|
| `getProfile()` | `() → Promise<Profile \| null>` | Fetches the single profile row (id=1). Returns null if not found. |
| `upsertProfile(input)` | `(Record<string, any>) → Promise<Profile>` | Creates or updates the profile. Uses service role client. Converts camelCase keys to snake_case. |

### Project Operations

| Function | Signature | Description |
|---|---|---|
| `getProjects()` | `() → Promise<Project[]>` | Fetches all projects ordered by `sort_order` ascending. |
| `getProjectById(id)` | `(number) → Promise<Project \| null>` | Fetches single project by ID. |
| `createProject(input)` | `(Record<string, any>) → Promise<Project>` | Creates a new project. Tags stored as JSON string. |
| `updateProject(id, input)` | `(number, Record<string, any>) → Promise<Project>` | Updates project fields. Partial update supported. |
| `deleteProject(id)` | `(number) → Promise<void>` | Deletes project by ID. |
| `reorderProjects(items)` | `(Array<{id, sortOrder}>) → Promise<void>` | Batch updates sort_order for drag-and-drop reordering. |
| `bulkUpdateTileSize(tileSize)` | `(string) → Promise<void>` | Sets tile_size on all projects. |
| `bulkUpdateProjectTags(tags)` | `(string) → Promise<void>` | Sets tags on all projects to the same value. |

### Experience Operations

| Function | Signature | Description |
|---|---|---|
| `getExperiences()` | `() → Promise<Experience[]>` | Fetches all experiences ordered by `sort_order`. |
| `getExperienceById(id)` | `(number) → Promise<Experience \| null>` | Fetches single experience. |
| `createExperience(input)` | `(Record<string, any>) → Promise<Experience>` | Creates new experience entry. |
| `updateExperience(id, input)` | `(number, Record<string, any>) → Promise<Experience>` | Updates experience fields. |
| `deleteExperience(id)` | `(number) → Promise<void>` | Deletes experience by ID. |

### Skill Category Operations

| Function | Signature | Description |
|---|---|---|
| `getSkillCategories()` | `() → Promise<SkillCategory[]>` | Fetches all skill categories ordered by `sort_order`. |
| `getSkillCategoryById(id)` | `(number) → Promise<SkillCategory \| null>` | Fetches single category. |
| `createSkillCategory(input)` | `(Record<string, any>) → Promise<SkillCategory>` | Creates new skill category. Skills stored as JSON array. |
| `updateSkillCategory(id, input)` | `(number, Record<string, any>) → Promise<SkillCategory>` | Updates category fields. |
| `deleteSkillCategory(id)` | `(number) → Promise<void>` | Deletes category by ID. |

### Education Operations

| Function | Signature | Description |
|---|---|---|
| `getEducation()` | `() → Promise<Education[]>` | Fetches all education entries ordered by `sort_order`. |
| `getEducationById(id)` | `(number) → Promise<Education \| null>` | Fetches single entry. |
| `createEducation(input)` | `(Record<string, any>) → Promise<Education>` | Creates new education entry. |
| `updateEducation(id, input)` | `(number, Record<string, any>) → Promise<Education>` | Updates education fields. |
| `deleteEducation(id)` | `(number) → Promise<void>` | Deletes education entry. |

### Theme Settings Operations

| Function | Signature | Description |
|---|---|---|
| `getThemeSettings()` | `() → Promise<ThemeSettings>` | Fetches theme settings (id=1). Returns `DEFAULT_THEME` if not found. |
| `updateThemeSettings(input)` | `({headingFont?, bodyFont?, accentColor?, sectionVisibility?, layout?, sectionTitles?}) → Promise<ThemeSettings>` | Updates theme settings. Validates font names and hex colors server-side. |
| `resetThemeSettings()` | `() → Promise<ThemeSettings>` | Resets all theme settings to defaults. |

### Analytics Operations

| Function | Signature | Description |
|---|---|---|
| `trackProjectEvent(input)` | `({projectId, eventType, referrer?}) → Promise<void>` | Records a project click event (live_click or github_click). |
| `getProjectAnalyticsSummary()` | `() → Promise<AnalyticsSummary[]>` | Aggregated click counts per project. |
| `getProjectAnalyticsDetail(id)` | `(number) → Promise<AnalyticsDetail[]>` | Detailed event log for a specific project. |

### Portfolio Aggregation

| Function | Signature | Description |
|---|---|---|
| `getFullPortfolio()` | `() → Promise<FullPortfolio>` | Fetches all content in parallel (profile, projects, experiences, skills, education, theme) and returns a single object. Used by the public `portfolio.getAll` procedure. |

---

## Server: tRPC Routers (`server/routers.ts`)

### Input Validation Helpers

| Helper | Type | Description |
|---|---|---|
| `safeUrl` | `z.string()` | Validates HTTP(S) URLs only. Blocks `javascript:`, `data:` protocols. |
| `hexColor` | `z.string()` | Validates `#RRGGBB` hex format. |
| `safeText(maxLen)` | `z.string()` | Length-limited optional text. |
| `requiredText(maxLen)` | `z.string()` | Length-limited required text. |
| `ALLOWED_HEADING_FONTS` | `const[]` | Whitelist of 15 heading font names. |
| `ALLOWED_BODY_FONTS` | `const[]` | Whitelist of 15 body font names. |

### Procedure Access Levels

| Level | Guard | Description |
|---|---|---|
| `publicProcedure` | None | Accessible by anyone (visitors and admins) |
| `protectedProcedure` | JWT required | Requires valid session cookie |
| `adminProcedure` | JWT + role=admin | Requires admin role |

---

## Client: Theme Settings Hook (`client/src/hooks/useThemeSettings.ts`)

### Key Functions

| Function | Description |
|---|---|
| `useThemeSettings()` | Main hook. Fetches theme from `trpc.theme.get`, applies CSS variables to `:root`, manages dark mode state. |
| `applyThemeToDOM(theme, isDark)` | Injects CSS custom properties (`--t-*` tokens) into `document.documentElement.style`. Handles font loading via Google Fonts CDN link injection. |
| `toggleDarkMode()` | Toggles `.dark` class on `<html>`, updates localStorage, recalculates all color tokens for dark palette. |

### Dark Mode Color Mapping

The hook computes dark mode colors by inverting the warm palette:
- Cream backgrounds → Deep charcoal
- Charcoal text → Warm white
- Terracotta accent → Unchanged (consistent across modes)

---

## Client: Portfolio Data Hook (`client/src/hooks/usePortfolio.ts`)

| Function | Description |
|---|---|
| `usePortfolio()` | Wraps `trpc.portfolio.getAll.useQuery()`. Returns `{ data, isLoading, error }` with the full portfolio payload (profile, projects, experiences, skills, education, theme). |

---

## Drizzle Schema (`drizzle/schema.ts`)

### Users Table

```typescript
users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
```

The `role` field enables admin/user separation. Only users with `role = "admin"` can access admin procedures.
