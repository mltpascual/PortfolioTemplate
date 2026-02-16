/**
 * Create portfolio tables in Supabase.
 * Run with: node scripts/create-tables.mjs
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
-- Profile table (single row for portfolio owner)
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

-- Insert default profile if empty
INSERT INTO profile (full_name, title, hero_tagline)
SELECT 'Alex Chen', 'Full-stack Software Engineer', 'Crafting digital experiences with purpose.'
WHERE NOT EXISTS (SELECT 1 FROM profile LIMIT 1);
`;

async function createTables() {
  console.log("Creating tables in Supabase...");
  
  const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql });
  
  if (error) {
    // If RPC doesn't exist, we need to use the SQL editor approach
    // Let's try direct REST approach instead
    console.log("RPC not available, trying individual table creation...");
    
    // We'll create tables one by one using the Supabase REST API
    // First, let's check if tables already exist by trying to query them
    const tables = ["profile", "projects", "experiences", "skill_categories"];
    
    for (const table of tables) {
      const { error: queryError } = await supabase.from(table).select("id").limit(1);
      if (queryError) {
        console.log(`Table '${table}' needs to be created. Error: ${queryError.message}`);
      } else {
        console.log(`Table '${table}' already exists ✓`);
      }
    }
    
    console.log("\n⚠️  Tables need to be created via Supabase SQL Editor.");
    console.log("Please run the SQL from scripts/supabase-schema.sql in your Supabase Dashboard → SQL Editor");
    return false;
  }
  
  console.log("Tables created successfully! ✓");
  return true;
}

createTables().catch(console.error);
