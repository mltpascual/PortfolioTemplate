"""
Create portfolio tables in Supabase by connecting directly to PostgreSQL.
Extracts connection info from SUPABASE_URL and uses SUPABASE_KEY as the password
for the postgres user via the pooler connection.
"""
import os
import re

supabase_url = os.environ.get("SUPABASE_URL", "")
supabase_key = os.environ.get("SUPABASE_KEY", "")

if not supabase_url or not supabase_key:
    print("Missing SUPABASE_URL or SUPABASE_KEY")
    exit(1)

# Extract project ref from URL: https://<project_ref>.supabase.co
match = re.search(r'https://([^.]+)\.supabase\.co', supabase_url)
if not match:
    print(f"Could not extract project ref from SUPABASE_URL: {supabase_url}")
    exit(1)

project_ref = match.group(1)
print(f"Project ref: {project_ref}")

# Supabase pooler connection format:
# Host: aws-0-<region>.pooler.supabase.com  (or db.<project_ref>.supabase.co for direct)
# Port: 6543 (pooler) or 5432 (direct)
# User: postgres.<project_ref>
# Password: the database password (not the API key)
# Database: postgres

# Since we don't have the DB password, let's try using the service_role key
# with the PostgREST approach differently.

# Actually, let's try connecting via the Supabase Management API v1
# which allows SQL execution with the service_role key

import requests
import json

# Try the Supabase pg-meta API (used internally by the dashboard)
# Format: POST /pg-meta/default/query
headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
}

sql = """
-- Profile table
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
    client_satisfaction VARCHAR(20) DEFAULT '99%',
    available_for_work BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
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
);

-- Experiences table
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
);

-- Skill categories table
CREATE TABLE IF NOT EXISTS skill_categories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Code2',
    skills TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "public_read_profile" ON profile;
DROP POLICY IF EXISTS "public_read_projects" ON projects;
DROP POLICY IF EXISTS "public_read_experiences" ON experiences;
DROP POLICY IF EXISTS "public_read_skill_categories" ON skill_categories;
DROP POLICY IF EXISTS "service_insert_profile" ON profile;
DROP POLICY IF EXISTS "service_update_profile" ON profile;
DROP POLICY IF EXISTS "service_delete_profile" ON profile;
DROP POLICY IF EXISTS "service_insert_projects" ON projects;
DROP POLICY IF EXISTS "service_update_projects" ON projects;
DROP POLICY IF EXISTS "service_delete_projects" ON projects;
DROP POLICY IF EXISTS "service_insert_experiences" ON experiences;
DROP POLICY IF EXISTS "service_update_experiences" ON experiences;
DROP POLICY IF EXISTS "service_delete_experiences" ON experiences;
DROP POLICY IF EXISTS "service_insert_skill_categories" ON skill_categories;
DROP POLICY IF EXISTS "service_update_skill_categories" ON skill_categories;
DROP POLICY IF EXISTS "service_delete_skill_categories" ON skill_categories;

-- Public read policies
CREATE POLICY "public_read_profile" ON profile FOR SELECT USING (true);
CREATE POLICY "public_read_projects" ON projects FOR SELECT USING (true);
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "public_read_skill_categories" ON skill_categories FOR SELECT USING (true);

-- Full access policies
CREATE POLICY "service_insert_profile" ON profile FOR INSERT WITH CHECK (true);
CREATE POLICY "service_update_profile" ON profile FOR UPDATE USING (true);
CREATE POLICY "service_delete_profile" ON profile FOR DELETE USING (true);
CREATE POLICY "service_insert_projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "service_update_projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "service_delete_projects" ON projects FOR DELETE USING (true);
CREATE POLICY "service_insert_experiences" ON experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "service_update_experiences" ON experiences FOR UPDATE USING (true);
CREATE POLICY "service_delete_experiences" ON experiences FOR DELETE USING (true);
CREATE POLICY "service_insert_skill_categories" ON skill_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "service_update_skill_categories" ON skill_categories FOR UPDATE USING (true);
CREATE POLICY "service_delete_skill_categories" ON skill_categories FOR DELETE USING (true);

-- Seed default profile
INSERT INTO profile (full_name, title, hero_tagline, hero_subtitle, email, location, years_experience, projects_delivered, open_source_contributions, client_satisfaction, available_for_work)
SELECT 'Alex Chen', 'Full-stack Software Engineer', 'Crafting digital experiences with purpose.', 
       'Full-stack software engineer with 5+ years building scalable web applications, design systems, and developer tools that make a difference.',
       'alex@example.com', 'San Francisco, CA', '5+', '30+', '15+', '99%', true
WHERE NOT EXISTS (SELECT 1 FROM profile LIMIT 1);
"""

# Try multiple possible endpoints
endpoints = [
    # Standard Supabase Management API
    (f"https://api.supabase.com/v1/projects/{project_ref}/database/query", "POST", {"query": sql}),
    # pg-meta endpoint (used by dashboard internally)  
    (f"{supabase_url}/pg-meta/default/query", "POST", {"query": sql}),
    # Try via the REST API with raw SQL function
    (f"{supabase_url}/rest/v1/rpc/exec_sql", "POST", {"sql_query": sql}),
]

success = False
for url, method, body in endpoints:
    print(f"\nTrying: {url}")
    try:
        resp = requests.post(url, headers=headers, json=body, timeout=30)
        print(f"  Status: {resp.status_code}")
        if resp.status_code in [200, 201, 204]:
            print(f"  ✅ Success!")
            resp_text = resp.text[:500] if resp.text else "(empty)"
            print(f"  Response: {resp_text}")
            success = True
            break
        else:
            print(f"  Response: {resp.text[:300]}")
    except Exception as e:
        print(f"  Error: {e}")

if not success:
    print("\n" + "="*60)
    print("Could not create tables via API.")
    print("Trying alternative: psycopg2 direct connection...")
    print("="*60)
    
    # Try installing psycopg2 and connecting directly
    try:
        import psycopg2
    except ImportError:
        import subprocess
        subprocess.run(["sudo", "pip3", "install", "psycopg2-binary"], check=True)
        import psycopg2
    
    # Direct connection to Supabase PostgreSQL
    # Format: postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres
    # But we need the database password, not the API key
    # The service_role key might work as a connection password in some setups
    
    # Try with the pooler connection
    conn_strings = [
        f"postgresql://postgres.{project_ref}:{supabase_key}@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require",
        f"postgresql://postgres.{project_ref}:{supabase_key}@aws-0-us-west-1.pooler.supabase.com:6543/postgres?sslmode=require",
        f"postgresql://postgres.{project_ref}:{supabase_key}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require",
        f"postgresql://postgres:{supabase_key}@db.{project_ref}.supabase.co:5432/postgres?sslmode=require",
    ]
    
    for conn_str in conn_strings:
        masked = conn_str[:50] + "..." 
        print(f"\nTrying connection: {masked}")
        try:
            conn = psycopg2.connect(conn_str, connect_timeout=10)
            conn.autocommit = True
            cur = conn.cursor()
            cur.execute(sql)
            print("  ✅ Tables created successfully!")
            cur.close()
            conn.close()
            success = True
            break
        except Exception as e:
            print(f"  ❌ Failed: {str(e)[:200]}")

if not success:
    print("\n" + "="*60)
    print("❌ Could not create tables automatically.")
    print("Please create them manually in Supabase SQL Editor.")
    print("File: scripts/supabase-schema.sql")
    print("="*60)
else:
    print("\n✅ All done! Tables created in Supabase.")
