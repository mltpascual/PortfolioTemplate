"""
Execute SQL on Supabase using the REST API.
Uses SUPABASE_URL and SUPABASE_KEY env vars.
"""
import os
import requests

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("Missing SUPABASE_URL or SUPABASE_KEY")
    exit(1)

# Read SQL file
with open("scripts/supabase-schema.sql", "r") as f:
    sql = f.read()

# Use the Supabase REST SQL endpoint
# The /rest/v1/rpc endpoint won't work for DDL, so we use the pg REST approach
# We'll execute via the Supabase SQL API
headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Split SQL into individual statements and execute each
statements = [s.strip() for s in sql.split(";") if s.strip() and not s.strip().startswith("--")]

print(f"Found {len(statements)} SQL statements to execute")

# Try using the Supabase SQL endpoint (available with service_role key)
for i, stmt in enumerate(statements):
    # Skip empty or comment-only statements
    lines = [l for l in stmt.split("\n") if l.strip() and not l.strip().startswith("--")]
    clean_stmt = "\n".join(lines).strip()
    if not clean_stmt:
        continue
    
    print(f"\n[{i+1}] Executing: {clean_stmt[:80]}...")
    
    # Use the pg-meta SQL execution endpoint
    resp = requests.post(
        f"{supabase_url}/rest/v1/rpc",
        headers=headers,
        json={"query": clean_stmt}
    )
    
    if resp.status_code in [200, 201, 204]:
        print(f"  ✓ Success")
    else:
        print(f"  Status: {resp.status_code}")
        print(f"  Response: {resp.text[:200]}")

print("\nDone!")
