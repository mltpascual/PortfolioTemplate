# Workflow

## Development Methodology

This project follows a **feature-driven development** approach with the following cycle:

1. **Schema first**: Update `drizzle/schema.ts` or Supabase tables, then run `pnpm db:push`
2. **Query helpers**: Add database functions in `server/db.ts`
3. **API procedures**: Create tRPC procedures in `server/routers.ts` with Zod validation
4. **Frontend UI**: Build React components consuming `trpc.*.useQuery/useMutation`
5. **Tests**: Write Vitest specs in `server/*.test.ts`
6. **Checkpoint**: Save via `webdev_save_checkpoint` and push to GitHub

## Git Workflow

| Convention | Standard |
|---|---|
| Branch strategy | Single `main` branch with checkpoints |
| Commit messages | Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:` |
| Push frequency | After each feature or fix is complete and tested |
| Remote | GitHub (`mltpascual/PortfolioTemplate`) |

## Code Review Requirements

All code changes should be validated against:

- TypeScript type checking (`pnpm check`)
- Vitest test suite (`pnpm test`) — all 78+ tests must pass
- No TypeScript errors in LSP
- Input validation on all tRPC procedures
- Admin-only operations behind `adminProcedure`

## Testing Requirements

| Type | Tool | Location | Coverage Target |
|---|---|---|---|
| Unit/Integration | Vitest | `server/*.test.ts` | All API procedures, input validation, auth guards |
| E2E | Playwright | `e2e/*.spec.ts` | Critical user journeys (portfolio view, admin CRUD) |

### Test Naming Convention

```
describe('Feature Name', () => {
  it('verb + expected behavior', () => { ... });
});
```

Examples: `"creates a project with valid input"`, `"rejects URLs with javascript: protocol"`

## Quality Assurance Gates

Before any checkpoint:

1. `pnpm test` — all tests pass
2. `pnpm check` — no TypeScript errors
3. Manual verification of changed UI in browser
4. `todo.md` updated with completed items marked `[x]`

## Deployment Procedures

| Step | Command/Action |
|---|---|
| Build | `pnpm build` (Vite client + esbuild server) |
| Start | `pnpm start` (Node.js production server) |
| Publish | Click "Publish" button in Manus Management UI |
| Environment | All secrets managed through `webdev_request_secrets` |

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React pages | PascalCase | `Admin.tsx`, `Home.tsx` |
| React components | PascalCase | `ProjectsSection.tsx`, `SortableProjectItem.tsx` |
| Hooks | camelCase with `use` prefix | `useThemeSettings.ts`, `usePortfolio.ts` |
| Server files | camelCase | `db.ts`, `routers.ts`, `storage.ts` |
| Test files | `*.test.ts` | `theme.test.ts`, `security.test.ts` |
| E2E tests | `*.spec.ts` | `admin.spec.ts`, `portfolio.spec.ts` |
| Shared types | camelCase | `types.ts`, `const.ts` |

## Environment Variables

All environment variables are injected by the platform. Never hardcode values or commit `.env` files. Key variables:

- `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — Database access
- `JWT_SECRET` — Session signing
- `VITE_APP_ID`, `OAUTH_SERVER_URL` — Authentication
- `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` — Platform APIs
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — GitHub OAuth (admin login)
