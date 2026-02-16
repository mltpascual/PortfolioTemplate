-- Portfolio Database Schema for Supabase (PostgreSQL)

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
  display_mode VARCHAR(20) DEFAULT 'live',
  tile_size VARCHAR(20) DEFAULT 'medium',
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

-- Enable Row Level Security (RLS) but allow all reads for public portfolio
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read on profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Allow public read on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read on skill_categories" ON skill_categories FOR SELECT USING (true);

-- Service role (backend) can do everything
CREATE POLICY "Allow service insert on profile" ON profile FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on profile" ON profile FOR UPDATE USING (true);
CREATE POLICY "Allow service delete on profile" ON profile FOR DELETE USING (true);

CREATE POLICY "Allow service insert on projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Allow service delete on projects" ON projects FOR DELETE USING (true);

CREATE POLICY "Allow service insert on experiences" ON experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on experiences" ON experiences FOR UPDATE USING (true);
CREATE POLICY "Allow service delete on experiences" ON experiences FOR DELETE USING (true);

CREATE POLICY "Allow service insert on skill_categories" ON skill_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on skill_categories" ON skill_categories FOR UPDATE USING (true);
CREATE POLICY "Allow service delete on skill_categories" ON skill_categories FOR DELETE USING (true);

-- Insert default profile row
INSERT INTO profile (full_name, title, hero_tagline)
SELECT 'Alex Chen', 'Full-stack Software Engineer', 'Crafting digital experiences with purpose.'
WHERE NOT EXISTS (SELECT 1 FROM profile LIMIT 1);
