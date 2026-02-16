# Dynamic Portfolio Upgrade - Todo

## Phase 1: Upgrade to full-stack
- [x] Run webdev_add_feature to add web-db-user
- [x] Review the upgraded project structure

## Phase 2: Database schema
- [x] Create tables: profile, projects, experiences, skillCategories
- [x] Run database migrations (pnpm db:push)

## Phase 3: Backend API routes
- [x] portfolio.getAll - public endpoint to fetch all portfolio data
- [x] adminProfile CRUD - get and update profile (admin only)
- [x] adminProjects CRUD - list, create, update, delete (admin only)
- [x] adminExperiences CRUD - list, create, update, delete (admin only)
- [x] adminSkills CRUD - list, create, update, delete (admin only)

## Phase 4: Admin dashboard
- [x] Create /admin route with auth gate
- [x] Profile editor (name, title, bio, avatar, social links, stats)
- [x] Projects manager (add/edit/delete with featured toggle)
- [x] Experience manager (add/edit/delete)
- [x] Skills manager (add/edit/delete with icon picker)
- [x] Admin gear icon in Navbar for admin users

## Phase 5: Connect public portfolio
- [x] Create usePortfolio hook with fallback defaults
- [x] Update all sections to accept dynamic data props
- [x] Handle empty states gracefully with defaults

## Phase 6: Test and deliver
- [x] Write vitest tests (12 tests passing)
- [x] Verify 0 TypeScript errors
- [x] Save checkpoint and deliver

## Phase 7: Migrate to Supabase (PostgreSQL)
- [x] Verify Supabase credentials (SUPABASE_URL + SUPABASE_KEY)
- [x] Install @supabase/supabase-js SDK
- [x] Create tables in Supabase via SQL Editor (profile, projects, experiences, skill_categories)
- [x] Enable Row Level Security with public read policies
- [x] Seed default profile data
- [x] Rewrite server/db.ts to use Supabase SDK with camelCase/snake_case conversion
- [x] Keep Drizzle/MySQL for built-in auth (users table)
- [x] Test connection - 13 tests passing (Supabase + auth + portfolio CRUD)
- [x] Save checkpoint

## Phase 8: Fix Supabase RLS Security Warnings
- [x] Drop overly permissive 'service_all_*' policies (ALL with true/true)
- [x] Create proper SELECT-only policies (public read for all 4 tables)
- [x] Writes handled via service_role key (bypasses RLS) — no INSERT/UPDATE/DELETE policies needed
- [x] Add SUPABASE_SERVICE_ROLE_KEY env var
- [x] Update server/db.ts — getSupabaseAdmin() for writes, getSupabase() for reads
- [x] All 15 tests passing (auth + supabase + service_role + portfolio CRUD)
- [x] Save checkpoint

## Phase 9: Fix Database Performance Issues
- [x] Checked Supabase dashboard — slow queries are all internal PostgreSQL system queries, not portfolio queries
- [x] Added 7 new indexes: sort_order (3 tables), featured partial index, featured+sort_order composite, created_at DESC (2 tables)
- [x] RLS policies already optimized in Phase 8 (SELECT-only public, service_role for writes)
- [x] Ran ANALYZE on all 4 tables to update query planner statistics
- [x] All 15 tests still passing after performance optimizations
- [x] Explain login/authentication system to user

## Phase 10: Replace Manus OAuth with GitHub OAuth (Self-Hostable)
- [x] Analyzed current Manus OAuth flow (sdk.ts, oauth.ts, context.ts)
- [x] Created GitHub OAuth App on GitHub (Client ID: Ov23liGVPdDWXOMVPCmV)
- [x] Implemented GitHub OAuth callback (/api/auth/github + /api/auth/github/callback)
- [x] JWT session management with jose (createSessionToken, verifySession)
- [x] Updated client login flow — getLoginUrl() now points to /api/auth/github
- [x] Admin auth uses GITHUB_OWNER_USERNAME to auto-assign admin role
- [x] Users table moved to Supabase (app_users) — no more Drizzle/MySQL for users
- [x] Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_OWNER_USERNAME env vars
- [x] All 19 tests passing (auth + supabase + service_role + github-oauth + portfolio CRUD)
- [ ] Update README with self-hosting instructions

## Phase 11: Deploy to Vercel
- [ ] Read Vercel deploy skill
- [ ] Adapt Express server for Vercel serverless
- [ ] Create vercel.json configuration
- [ ] Deploy to Vercel
- [ ] Set environment variables on Vercel
- [ ] Update GitHub OAuth callback URL to production domain
- [x] Test the full auth flow on production

## Phase 12: Theme Customization (Color Accent & Fonts)
- [x] Database schema for storing accent color and font settings
- [x] Backend tRPC API for get/update theme settings
- [x] Admin dashboard UI with color picker, font selector, and reset to default button
- [x] Frontend applies saved theme settings dynamically on portfolio pages
- [x] Push to GitHub and verify on Vercel

## Phase 13: Live Preview, Dark Mode, Actual Content
- [x] Live preview panel in Theme tab showing mini portfolio as settings change
- [x] Dark mode toggle in theme settings with separate dark color palette
- [x] Database schema update for dark mode setting
- [x] CSS variables updated to support dynamic dark/light mode switching via --t-* tokens
- [x] Replace placeholder content with actual portfolio data (Miguel Pascual)
- [x] Fix flash-of-default-content issue (Alex Chen shows briefly before real data loads)
- [x] Write tests for new features
- [x] Push to GitHub and verify on Vercel

## Phase 14: Project Screenshots, Avatar, and Resume
- [x] Capture/gather project screenshots for all 10 projects
- [x] Upload project screenshots to S3 and update database
- [x] Add avatar/headshot photo and upload to S3
- [x] Update resume link to open in new tab instead of download
- [x] Push to GitHub and verify on Vercel

## Phase 15: Resume, New Projects, Real Screenshots
- [x] Download resume PDF from mltpascual.vercel.app and upload to S3
- [x] Update existing project live URLs with actual Vercel deployments
- [x] Add new projects: CAD Studio, GentlyPure, MiniArcadeGames, ResumeForge, SkintillaBeauty, MultiGynPH, MakeItHappen, SkyPulseWeather, Portfolio2024
- [x] Capture real screenshots from live Vercel project URLs
- [x] Upload screenshots to S3 and update database
- [x] Add Resume button to Navbar (opens in new tab)
- [x] Add resume_url field to profile in database
- [x] Push to GitHub and verify on Vercel

## Phase 16: Live iframe preview for project cards
- [x] Replace static screenshots with live iframe preview of project sites
- [x] Add fallback to static image when site is down or iframe fails to load
- [x] Add toggle button to switch between live preview and static image
- [x] Push to GitHub and verify on Vercel

## Bug Fix: Blank Projects Section
- [x] Diagnose and fix blank Projects section (IntersectionObserver threshold too high for mobile)

## Bug Fix: Mobile Projects Section + CAD URL
- [x] Fix blank Projects section on mobile/phone view
- [x] Update CAD Studio live URL to https://cadclone.vercel.app/

## Phase 17: Move Live/Image toggle to Admin Dashboard
- [x] Add display_mode column to projects table in Supabase (live | image)
- [x] Update backend API to support display_mode per project
- [x] Add display mode toggle to admin project management UI
- [x] Remove toggle from public ProjectsSection — use admin-set display_mode
- [x] Push to GitHub and verify on Vercel

## Phase 18: Security Audit, E2E Testing, Orchestrator, Tile Layout
- [x] Security audit: SQL injection, API injection, XSS, CSRF, IDOR, auth bypass
- [x] Fix all critical and high severity security vulnerabilities
- [x] Add project tile arrangement to admin (square, rectangle, masonry grid styles)
- [x] Clean unused markdown files from project
- [ ] Run master orchestrator for project documentation
- [x] Set up E2E testing with Playwright
- [ ] Push to GitHub and verify on Vercel

## Phase 19: Tile Sizes, E2E Testing, Drag-and-Drop Reorder
- [x] Assign varied tile sizes to existing projects for a dynamic grid layout
- [x] Set up E2E testing with Playwright (install, configure, write tests)
- [x] E2E tests: login flow, admin CRUD, contact form submission, public portfolio rendering
- [x] Add drag-and-drop reordering in admin project list (replace manual sort_order editing)
- [x] Write vitest tests for new drag-and-drop reorder endpoint
- [ ] Push to GitHub and verify
