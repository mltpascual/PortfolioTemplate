# GitHub OAuth Migration Progress

## Supabase Tables (all 5 confirmed)
- app_users (NEW - for GitHub OAuth)
- experiences
- profile
- projects
- skill_categories

## app_users table structure:
- id SERIAL PRIMARY KEY
- github_id TEXT NOT NULL UNIQUE
- github_username TEXT
- name TEXT
- email TEXT
- avatar_url TEXT
- role TEXT DEFAULT 'user' CHECK ('user', 'admin')
- created_at, updated_at, last_signed_in TIMESTAMPTZ

## RLS: service_role only (no public access to users table)
## Index: idx_app_users_github_id on github_id

## Next: Rewrite server auth to use GitHub OAuth

## GitHub OAuth App Created
- **Client ID:** Ov23liGVPdDWXOMVPCmV
- **Owner:** mltpascual
- **Client Secret:** Need to generate next
- **Callback URL:** https://3000-ip8aok7c6zcvloazgif46-bf665469.us1.manus.computer/api/auth/github/callback
