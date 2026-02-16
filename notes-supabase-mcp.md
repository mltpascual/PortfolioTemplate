# Supabase MCP Server Notes

- Remote MCP URL: `https://mcp.supabase.com/mcp`
- Can scope to project: `https://mcp.supabase.com/mcp?project_ref=<project-ref>`
- Read-only mode: `?read_only=true`
- For write access (CREATE TABLE, etc): don't set read_only, or set `read_only=false`
- Tool: `execute_sql` - runs raw SQL in the database
- Tool: `apply_migration` - for schema changes
- Requires OAuth login to Supabase
- Project ref: ybaihvusfmoggnopudez
- Full URL for write access: `https://mcp.supabase.com/mcp?project_ref=ybaihvusfmoggnopudez`
