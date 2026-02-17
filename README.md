# Portfolio Template

A reusable, fully dynamic software engineer portfolio with a full-stack architecture, admin panel, and zero hardcoded content. Built with React 19, Express 4, tRPC 11, Supabase, and Tailwind CSS 4. Every piece of content — profile, projects, experience, skills, education, and visual theme — is managed through a protected admin panel.

## Key Features

- **Dynamic Content Management** — Full CRUD for profile, projects, experiences, skills, and education via a tabbed admin panel
- **Theme Customization** — Change fonts, accent color, section visibility, section titles, and layout from the admin panel
- **Dark Mode** — Toggle between light and dark themes with localStorage persistence
- **Scroll Animations** — IntersectionObserver-driven fade-in/slide-up on all sections
- **Drag-and-Drop Reordering** — Reorder projects, skills, and experiences with @dnd-kit
- **Project Analytics** — Track clicks on live demo and GitHub links
- **Responsive Design** — Mobile-first with hamburger nav, adaptive grids, and touch-friendly interactions
- **Warm Editorial Design** — DM Serif Display + DM Sans typography, terracotta accents, cream backgrounds
- **Bulk Operations** — Update all project tags or tile sizes at once
- **Contact Form** — Email-based contact with owner notification
- **Resume Upload** — PDF upload and download link
- **Image Upload** — S3-backed image storage for project screenshots and avatars

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React | 19.2.1 |
| **Styling** | Tailwind CSS | 4.x |
| **UI Components** | shadcn/ui (Radix UI) | Latest |
| **Routing** | wouter | 3.3.5 |
| **API Layer** | tRPC | 11.6.0 |
| **Server** | Express | 4.21.2 |
| **Content Database** | Supabase (PostgreSQL) | — |
| **Auth Database** | MySQL/TiDB (Drizzle ORM) | — |
| **File Storage** | AWS S3 | — |
| **Authentication** | Manus OAuth + JWT | — |
| **Build Tool** | Vite | 6.x |
| **Testing** | Vitest + Playwright | — |
| **Language** | TypeScript | 5.9.3 |

---

## Prerequisites

- **Node.js** 22 or higher
- **pnpm** (recommended package manager)
- **Supabase account** with a project (for content storage)
- **Manus platform** account (for OAuth and deployment)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mltpascual/PortfolioTemplate.git
cd PortfolioTemplate
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

The following environment variables are required. On the Manus platform, these are injected automatically. For local development, create a `.env` file:

| Variable | Description | Required |
|---|---|---|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for admin writes) | Yes |
| `DATABASE_URL` | MySQL/TiDB connection string (for auth) | Yes |
| `JWT_SECRET` | Secret for signing session cookies | Yes |
| `VITE_APP_ID` | Manus OAuth application ID | Yes |
| `OAUTH_SERVER_URL` | Manus OAuth backend URL | Yes |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal URL | Yes |
| `OWNER_OPEN_ID` | Portfolio owner's Manus OpenID | Yes |
| `OWNER_NAME` | Portfolio owner's display name | Yes |
| `BUILT_IN_FORGE_API_URL` | Manus Forge API URL | Optional |
| `BUILT_IN_FORGE_API_KEY` | Manus Forge API key | Optional |

### 4. Database Setup

#### Supabase Tables

Create the following tables in your Supabase project. You can run these SQL statements in the Supabase SQL Editor:

```sql
-- Profiles table (single row for portfolio owner)
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL DEFAULT 'Your Name',
  title VARCHAR(300) NOT NULL DEFAULT 'Software Engineer',
  bio TEXT,
  hero_tagline VARCHAR(500) NOT NULL DEFAULT 'Crafting digital experiences with purpose.',
  hero_subtitle TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  github_url VARCHAR(500) DEFAULT '',
  linkedin_url VARCHAR(500) DEFAULT '',
  twitter_url VARCHAR(500) DEFAULT '',
  email VARCHAR(320) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  location VARCHAR(200) DEFAULT '',
  years_experience VARCHAR(20) DEFAULT '5+',
  projects_delivered VARCHAR(20) DEFAULT '30+',
  open_source_contributions VARCHAR(20) DEFAULT '15+',
  client_satisfaction VARCHAR(20) DEFAULT '99%',
  available_for_work BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  image_url TEXT,
  live_url VARCHAR(500) DEFAULT '',
  github_url VARCHAR(500) DEFAULT '',
  tags TEXT,
  featured BOOLEAN DEFAULT false,
  tile_size VARCHAR(20) DEFAULT 'medium',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences table
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  role VARCHAR(300) NOT NULL,
  company VARCHAR(300) NOT NULL,
  period VARCHAR(100) NOT NULL,
  description TEXT,
  tags TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill categories table
CREATE TABLE skill_categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'Code2',
  skills TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education table
CREATE TABLE education (
  id SERIAL PRIMARY KEY,
  degree VARCHAR(300) NOT NULL,
  institution VARCHAR(300) NOT NULL,
  year VARCHAR(50) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theme settings table (single row)
CREATE TABLE theme_settings (
  id SERIAL PRIMARY KEY,
  heading_font VARCHAR(100) DEFAULT 'DM Serif Display',
  body_font VARCHAR(100) DEFAULT 'DM Sans',
  accent_color VARCHAR(7) DEFAULT '#B85C38',
  section_visibility TEXT DEFAULT '{}',
  layout TEXT DEFAULT '{}',
  section_titles TEXT DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project analytics table
CREATE TABLE project_analytics (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Row Level Security (RLS)

Enable RLS on all tables and add policies for public read access:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_analytics ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon key)
CREATE POLICY "Public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Public read" ON education FOR SELECT USING (true);
CREATE POLICY "Public read" ON theme_settings FOR SELECT USING (true);

-- Analytics insert policy (anyone can track clicks)
CREATE POLICY "Public insert" ON project_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read" ON project_analytics FOR SELECT USING (true);
```

#### MySQL Auth Database

Push the Drizzle schema for the users table:

```bash
pnpm db:push
```

### 5. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### 6. Access the Admin Panel

Navigate to `/admin` and log in with Manus OAuth. The first user to log in should be promoted to admin by updating the `role` field in the MySQL `users` table:

```sql
UPDATE users SET role = 'admin' WHERE openId = 'your-open-id';
```

---

## Project Structure

```
portfolio/
├── client/                     # Frontend (React SPA)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── _core/hooks/        # Auth hook
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── Navbar.tsx      # Navigation with dark mode toggle
│   │   │   ├── HeroSection.tsx # Hero banner
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── EducationSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── CombinedSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── contexts/           # ThemeContext
│   │   ├── hooks/              # usePortfolio, useThemeSettings
│   │   ├── lib/                # tRPC client
│   │   ├── pages/              # Home.tsx, Admin.tsx, NotFound.tsx
│   │   ├── App.tsx             # Router & providers
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles & theme tokens
│   └── index.html              # HTML template with Google Fonts
├── server/
│   ├── _core/                  # Framework plumbing (DO NOT EDIT)
│   │   ├── index.ts            # Server bootstrap
│   │   ├── context.ts          # tRPC context builder
│   │   ├── trpc.ts             # Procedure definitions
│   │   ├── oauth.ts            # OAuth callback
│   │   ├── llm.ts              # LLM helper
│   │   ├── notification.ts     # Owner notifications
│   │   └── ...
│   ├── db.ts                   # Supabase query helpers
│   ├── routers.ts              # All tRPC procedures
│   ├── storage.ts              # S3 file operations
│   └── *.test.ts               # Vitest test files
├── drizzle/
│   ├── schema.ts               # MySQL users table schema
│   ├── relations.ts            # Table relations
│   └── migrations/             # Generated migrations
├── shared/
│   ├── types.ts                # Shared TypeScript types
│   └── const.ts                # Shared constants
├── conductor/                  # Project context documentation
│   ├── product.md              # Product vision & features
│   ├── tech-stack.md           # Technology choices
│   ├── workflow.md             # Development practices
│   └── product-guidelines.md   # Brand & communication standards
├── C4-Documentation/           # Architecture documentation
│   ├── c4-context.md           # System context diagram
│   ├── c4-container.md         # Container diagram
│   ├── c4-component.md         # Component diagram
│   └── c4-code.md              # Code-level documentation
├── DESIGN.md                   # Visual design system
├── DEVELOPMENT_GUIDELINES.md   # Coding standards & best practices
├── todo.md                     # Feature tracking
└── package.json
```

---

## Architecture Overview

The application follows a **three-tier architecture** with end-to-end type safety:

```
┌─────────────────────────────────────────────┐
│  React SPA (Vite)                           │
│  Pages: Home, Admin, NotFound               │
│  Hooks: usePortfolio, useAuth, useTheme     │
│  UI: shadcn/ui + Tailwind CSS 4             │
└──────────────┬──────────────────────────────┘
               │ tRPC (Superjson over HTTP)
┌──────────────▼──────────────────────────────┐
│  Express + tRPC Server                      │
│  Routers: auth, portfolio, admin*           │
│  Guards: public, protected, admin           │
│  Validation: Zod schemas                    │
└──────┬───────────┬──────────┬───────────────┘
       │           │          │
┌──────▼──┐  ┌─────▼────┐  ┌─▼──────┐
│ Supabase │  │ MySQL    │  │ AWS S3 │
│ (Content)│  │ (Auth)   │  │ (Files)│
└──────────┘  └──────────┘  └────────┘
```

For detailed architecture diagrams, see [C4-Documentation/c4-context.md](./C4-Documentation/c4-context.md).

---

## Admin Panel

The admin panel at `/admin` provides a tabbed interface for managing all content:

| Tab | Features |
|---|---|
| **Profile** | Edit name, title, bio, tagline, social links, avatar upload, resume upload, stat counters |
| **Projects** | Create/edit/delete projects, image upload, drag-and-drop reorder, bulk tag update, bulk tile size |
| **Experience** | Create/edit/delete work history, tags, drag-and-drop reorder |
| **Skills** | Create/edit/delete skill categories, icon picker, drag-and-drop reorder |
| **Education** | Create/edit/delete education entries |
| **Layout** | Font selection (heading + body), accent color picker, section visibility toggles, custom section titles |

---

## Customization Guide

### Changing the Design

The visual design is controlled by CSS custom properties in `client/src/index.css`. The warm editorial palette uses OKLCH color format:

- **Accent color**: Change via admin panel or edit `--t-terracotta` in `:root`
- **Fonts**: Change via admin panel (15 heading + 15 body font options)
- **Dark mode colors**: Computed dynamically by `useThemeSettings` hook

### Adding a New Section

1. Create `client/src/components/NewSection.tsx` following the pattern of existing sections
2. Add the section to `client/src/pages/Home.tsx`
3. Add a visibility toggle key in the theme settings
4. Add a section title key in the admin Layout tab

### Adding New Content Types

1. Create a new table in Supabase
2. Add type definitions and query helpers in `server/db.ts`
3. Add tRPC procedures in `server/routers.ts`
4. Build the admin UI in `client/src/pages/Admin.tsx`
5. Build the public display component
6. Write tests in `server/*.test.ts`

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build for production (Vite client + esbuild server) |
| `pnpm start` | Start production server |
| `pnpm check` | TypeScript type checking |
| `pnpm test` | Run Vitest test suite |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm db:push` | Generate and run Drizzle migrations |
| `pnpm format` | Format code with Prettier |

---

## Testing

The project includes 78+ tests covering:

- **Auth procedures**: Login, logout, session management
- **CRUD operations**: All content types (projects, experiences, skills, education)
- **Input validation**: URL sanitization, text length limits, font whitelisting
- **Security**: XSS prevention, SQL injection guards, protocol validation
- **Theme settings**: Font validation, color validation, section titles

Run tests:

```bash
pnpm test           # Unit/integration tests (Vitest)
pnpm test:e2e       # E2E tests (Playwright)
```

---

## Deployment

### Manus Platform (Recommended)

1. Save a checkpoint via the Manus Management UI
2. Click the **Publish** button in the Management UI header
3. All environment variables are injected automatically

### Custom Deployment

1. Set all required environment variables
2. Build the application: `pnpm build`
3. Start the server: `pnpm start`
4. The server serves both the API and static frontend files

---

## Documentation

| Document | Description |
|---|---|
| [conductor/product.md](./conductor/product.md) | Product vision, features, and roadmap |
| [conductor/tech-stack.md](./conductor/tech-stack.md) | Technology choices and architecture decisions |
| [conductor/workflow.md](./conductor/workflow.md) | Development practices and conventions |
| [DESIGN.md](./DESIGN.md) | Visual design system (colors, typography, components, spacing) |
| [C4-Documentation/c4-context.md](./C4-Documentation/c4-context.md) | System context architecture diagram |
| [C4-Documentation/c4-container.md](./C4-Documentation/c4-container.md) | Container architecture diagram |
| [C4-Documentation/c4-component.md](./C4-Documentation/c4-component.md) | Component architecture diagram |
| [C4-Documentation/c4-code.md](./C4-Documentation/c4-code.md) | Code-level documentation |
| [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) | Coding standards, UI/UX rules, security, testing |

---

## License

MIT
