# Tech Stack

## Primary Languages

| Language | Version | Usage |
|---|---|---|
| TypeScript | 5.9.3 | All application code (client + server + shared) |
| CSS | Tailwind 4 | Styling via utility classes and custom properties |
| SQL | MySQL 8+ | User auth schema (Drizzle ORM); PostgreSQL for content (Supabase) |

## Frontend Framework

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.1 | UI rendering with functional components and hooks |
| Vite | 6.x | Build tool and dev server with HMR |
| Tailwind CSS | 4.x | Utility-first styling with OKLCH color format |
| shadcn/ui | Latest | Pre-built accessible components (Radix UI + Tailwind) |
| wouter | 3.3.5 | Lightweight client-side routing |
| Framer Motion | 12.x | Animation library for scroll effects |
| Lucide React | 0.453.0 | Icon library |
| @dnd-kit | 6.x / 10.x | Drag-and-drop for admin panel reordering |

## Backend Framework

| Technology | Version | Purpose |
|---|---|---|
| Express | 4.21.2 | HTTP server |
| tRPC | 11.6.0 | End-to-end typesafe API layer |
| Zod | 4.1.12 | Input validation for all procedures |
| Superjson | 1.13.3 | Serialization (Date, Map, Set preserved) |
| jose | 6.1.0 | JWT session management |
| Helmet | 8.1.0 | Security headers |
| express-rate-limit | 8.2.1 | API rate limiting |

## Databases

| Database | ORM/Client | Purpose |
|---|---|---|
| Supabase (PostgreSQL) | @supabase/supabase-js 2.95.3 | Primary content store (profile, projects, experiences, skills, education, theme, analytics) |
| MySQL/TiDB | Drizzle ORM 0.44.5 | User authentication and session management |

## Infrastructure & Storage

| Service | Purpose |
|---|---|
| AWS S3 | File storage (images, resume PDFs) via `@aws-sdk/client-s3` |
| Manus OAuth | Authentication provider |
| Manus Forge API | Built-in LLM, image generation, notifications |

## Development Tools

| Tool | Version | Purpose |
|---|---|---|
| pnpm | Latest | Package manager |
| tsx | Latest | TypeScript execution for dev server |
| esbuild | Latest | Production server bundling |
| Prettier | Latest | Code formatting |
| TypeScript Compiler | 5.9.3 | Type checking (`tsc --noEmit`) |

## Testing Frameworks

| Framework | Version | Purpose |
|---|---|---|
| Vitest | Latest | Unit and integration tests (`server/*.test.ts`) |
| Playwright | 1.58.2 | End-to-end browser tests (`e2e/*.spec.ts`) |

## Key Dependencies

| Package | Purpose |
|---|---|
| `react-hook-form` + `@hookform/resolvers` | Form management in admin panel |
| `recharts` | Charts for analytics |
| `sonner` | Toast notifications |
| `next-themes` | Theme provider (light/dark) |
| `streamdown` | Markdown rendering with streaming |
| `nanoid` | Unique ID generation |
| `date-fns` | Date formatting utilities |
| `embla-carousel-react` | Carousel component |

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **Dual database** (Supabase + MySQL) | Supabase for content with RLS; MySQL/Drizzle for auth (template requirement) |
| **tRPC over REST** | End-to-end type safety eliminates API contract drift |
| **Supabase over direct PostgreSQL** | Built-in RLS, real-time capabilities, managed hosting |
| **S3 for files** | Scalable, CDN-friendly, no database bloat |
| **CSS custom properties** | Dynamic theming without rebuilding; dark mode via class toggle |
| **IntersectionObserver** | Native scroll animations without heavy libraries |
| **Zod validation** | Shared schemas between client and server; prevents injection |
