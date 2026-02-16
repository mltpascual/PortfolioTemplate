# RLS Fix Results

SQL executed successfully! All 4 tables now have proper SELECT-only policies:

| Table | Policy Name | Permissive | Roles | Command | Qual | With Check |
|-------|------------|------------|-------|---------|------|------------|
| experiences | public_read_experiences | PERMISSIVE | {public} | SELECT | true | NULL |
| profile | public_read_profile | PERMISSIVE | {public} | SELECT | true | NULL |
| projects | public_read_projects | PERMISSIVE | {public} | SELECT | true | NULL |
| skill_categories | public_read_skill_categories | PERMISSIVE | {public} | SELECT | true | NULL |

- Old `service_all_*` policies (ALL with true) have been DROPPED
- New `public_read_*` policies only allow SELECT (read) access
- INSERT/UPDATE/DELETE are now blocked for anon key users
- Server-side writes will use service_role key which bypasses RLS

Next: Update server/db.ts to use service_role key for admin write operations
