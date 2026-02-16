"""
Create portfolio tables in Supabase using the Supabase Python SDK.
Uses SUPABASE_URL and SUPABASE_KEY env vars.
"""
import os
import requests

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("Missing SUPABASE_URL or SUPABASE_KEY")
    exit(1)

# The Supabase client SDK doesn't support DDL (CREATE TABLE).
# But we can use the Supabase Management API or the pg-meta API.
# The pg-meta API is available at /pg/query for executing raw SQL.
# Let's try the Supabase SQL execution endpoint.

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
}

sql_statements = [
    # Profile table
    """
    CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(200) NOT NULL DEFAULT 'Alex Chen',
        title VARCHAR(300) NOT NULL DEFAULT 'Full-stack Software Engineer',
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
        client_satisfaction VARCHAR(20) DEFAULT '99%%',
        available_for_work BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )
    """,
    # Projects table
    """
    CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(300) NOT NULL,
        description TEXT,
        image_url TEXT,
        live_url VARCHAR(500) DEFAULT '',
        github_url VARCHAR(500) DEFAULT '',
        tags TEXT,
        featured BOOLEAN DEFAULT false,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )
    """,
    # Experiences table
    """
    CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        role VARCHAR(300) NOT NULL,
        company VARCHAR(300) NOT NULL,
        period VARCHAR(100) NOT NULL,
        description TEXT,
        tags TEXT,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )
    """,
    # Skill categories table
    """
    CREATE TABLE IF NOT EXISTS skill_categories (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        icon VARCHAR(50) NOT NULL DEFAULT 'Code2',
        skills TEXT,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )
    """,
    # RLS policies
    "ALTER TABLE profile ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE projects ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE experiences ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY",
    # Public read policies
    "CREATE POLICY IF NOT EXISTS \"public_read_profile\" ON profile FOR SELECT USING (true)",
    "CREATE POLICY IF NOT EXISTS \"public_read_projects\" ON projects FOR SELECT USING (true)",
    "CREATE POLICY IF NOT EXISTS \"public_read_experiences\" ON experiences FOR SELECT USING (true)",
    "CREATE POLICY IF NOT EXISTS \"public_read_skill_categories\" ON skill_categories FOR SELECT USING (true)",
    # Full access policies (for service role key)
    "CREATE POLICY IF NOT EXISTS \"service_insert_profile\" ON profile FOR INSERT WITH CHECK (true)",
    "CREATE POLICY IF NOT EXISTS \"service_update_profile\" ON profile FOR UPDATE USING (true)",
    "CREATE POLICY IF NOT EXISTS \"service_delete_profile\" ON profile FOR DELETE USING (true)",
    "CREATE POLICY IF NOT EXISTS \"service_insert_projects\" ON projects FOR INSERT WITH CHECK (true)",
    "CREATE POLICY IF NOT EXISTS \"service_update_projects\" ON projects FOR UPDATE USING (true)",
    "CREATE POLICY IF NOT EXISTS \"service_delete_projects\" ON projects FOR DELETE USING (true)",
    "CREATE POLICY IF NOT EXISTS \"service_insert_experiences\" ON experiences FOR INSERT WITH CHECK (true)",
    "CREATE POLICY IF NOT EXISTS \"service_update_experiences\" ON experiences FOR UPDATE USING (true)",
    "CREATE POLICY IF NOT EXISTS \"service_delete_experiences\" ON experiences FOR DELETE USING (true)",
    "CREATE POLICY IF NOT EXISTS \"service_insert_skill_categories\" ON skill_categories FOR INSERT WITH CHECK (true)",
    "CREATE POLICY IF NOT EXISTS \"service_update_skill_categories\" ON skill_categories FOR UPDATE USING (true)",
    "CREATE POLICY IF NOT EXISTS \"service_delete_skill_categories\" ON skill_categories FOR DELETE USING (true)",
]

print("Creating tables in Supabase...\n")

# Try multiple API endpoints that Supabase might expose for SQL execution

# Method 1: Try /rest/v1/rpc with a custom function
# Method 2: Try the pg-meta query endpoint
# Method 3: Try the SQL endpoint directly

endpoints_to_try = [
    f"{supabase_url}/pg/query",
    f"{supabase_url}/rest/v1/rpc/exec_sql",
]

# First, let's try creating a helper function via the pg endpoint
full_sql = ";\n".join(sql_statements)

# Try the pg-meta query endpoint (available in self-hosted and some plans)
for endpoint in endpoints_to_try:
    print(f"Trying endpoint: {endpoint}")
    try:
        resp = requests.post(
            endpoint,
            headers=headers,
            json={"query": full_sql} if "pg" in endpoint else {"sql_query": full_sql},
            timeout=30
        )
        print(f"  Status: {resp.status_code}")
        if resp.status_code in [200, 201, 204]:
            print(f"  ✅ Success!")
            print(f"  Response: {resp.text[:500]}")
            break
        else:
            print(f"  Response: {resp.text[:300]}")
    except Exception as e:
        print(f"  Error: {e}")

# If none of the above worked, try executing statements one by one
# via a different approach - use the Supabase Python SDK to create an RPC function
print("\n--- Trying individual SQL statements via Python SDK ---\n")

from supabase import create_client

sb = create_client(supabase_url, supabase_key)

# Check if tables exist already
for table_name in ["profile", "projects", "experiences", "skill_categories"]:
    try:
        result = sb.table(table_name).select("id").limit(1).execute()
        print(f"✅ Table '{table_name}' exists ({len(result.data)} rows)")
    except Exception as e:
        print(f"❌ Table '{table_name}' missing: {e}")

print("\nDone checking tables.")
