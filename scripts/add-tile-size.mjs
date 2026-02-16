import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// First, try to add the column by updating a project with tile_size
// If the column doesn't exist, we need to add it via Supabase dashboard or migration

// Let's check if we can read the column
const { data, error } = await sb.from('projects').select('id, title, tile_size').limit(1);
if (error) {
  console.log('tile_size column does not exist yet. Error:', error.message);
  console.log('\nYou need to add this column via Supabase SQL Editor:');
  console.log("ALTER TABLE projects ADD COLUMN IF NOT EXISTS tile_size VARCHAR(20) DEFAULT 'medium';");
} else {
  console.log('tile_size column exists!');
  console.log('Current data:', JSON.stringify(data, null, 2));
}
