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
