// Migration: Add layout_mode and section_order to theme_settings
// Uses Supabase Management API to execute SQL

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract the project ref from the Supabase URL
const projectRef = new URL(url).hostname.split('.')[0];

async function tryManagementAPI() {
  // Try the Supabase Management API SQL endpoint
  const endpoints = [
    `${url}/rest/v1/rpc/exec_sql`,
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
  ];

  // Actually, let's try a different approach - use the Supabase SQL editor API
  // The service role key can be used with the PostgREST SQL function if one exists

  // Approach: Create a temporary RPC function, use it, then drop it
  // But we can't create functions via REST either...

  // Best approach: Use the Supabase JS client to create a separate table
  // that stores layout settings, instead of altering theme_settings
  console.log('Will use a separate layout_settings table instead of altering theme_settings');
}

async function createLayoutSettingsTable() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, serviceKey);

  // Check if layout_settings table exists
  const { data: existing, error: fetchError } = await supabase
    .from('layout_settings')
    .select('*')
    .limit(1);

  if (!fetchError && existing) {
    console.log('layout_settings table already exists!');
    console.log('Existing data:', existing);
    return;
  }

  console.log('layout_settings table does not exist. Error:', fetchError?.message);
  console.log('Need to create it via Supabase SQL Editor or dashboard.');
  console.log('\nSQL to run:');
  console.log(`
CREATE TABLE IF NOT EXISTS layout_settings (
  id SERIAL PRIMARY KEY,
  layout_mode TEXT NOT NULL DEFAULT 'separate',
  section_order TEXT NOT NULL DEFAULT 'hero,about,projects,skills,experience,education,contact',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE layout_settings ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read layout_settings" ON layout_settings
  FOR SELECT USING (true);

-- Insert default row
INSERT INTO layout_settings (layout_mode, section_order) 
VALUES ('separate', 'hero,about,projects,skills,experience,education,contact')
ON CONFLICT DO NOTHING;
  `);
}

createLayoutSettingsTable().catch(console.error);
