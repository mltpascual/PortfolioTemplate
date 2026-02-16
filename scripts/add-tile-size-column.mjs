import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Step 1: Create a helper function to execute raw SQL
console.log('Step 1: Creating exec_sql function...');
const createFnResult = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql_helper`, {
  method: 'POST',
  headers: {
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: "SELECT 1" }),
});

// The function doesn't exist, so let's try a different approach
// Use the Supabase Management API
const projectRef = new URL(process.env.SUPABASE_URL).hostname.split('.')[0];
console.log('Project ref:', projectRef);

// Approach: Try to update a project with tile_size field
// If the column doesn't exist, we'll get an error
// In that case, we need to use the Supabase dashboard

// First check if column exists by trying to select it
const { data: testData, error: testError } = await sb
  .from('projects')
  .select('tile_size')
  .limit(1);

if (testError && testError.message.includes('does not exist')) {
  console.log('tile_size column does not exist. Attempting to add it...');
  
  // Try using the SQL API endpoint (available in newer Supabase versions)
  const sqlResponse = await fetch(`${process.env.SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: "ALTER TABLE projects ADD COLUMN IF NOT EXISTS tile_size VARCHAR(20) DEFAULT 'medium'"
    }),
  });
  
  const sqlResult = await sqlResponse.text();
  console.log('SQL API response status:', sqlResponse.status);
  console.log('SQL API response:', sqlResult.substring(0, 200));
  
  if (sqlResponse.ok) {
    console.log('Column added successfully!');
  } else {
    // Try another endpoint
    const sql2Response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'X-Supabase-SQL': "ALTER TABLE projects ADD COLUMN IF NOT EXISTS tile_size VARCHAR(20) DEFAULT 'medium'",
      },
      body: '{}',
    });
    console.log('Alt SQL response status:', sql2Response.status);
    const sql2Result = await sql2Response.text();
    console.log('Alt SQL response:', sql2Result.substring(0, 200));
  }
} else if (testError) {
  console.log('Unexpected error:', testError.message);
} else {
  console.log('tile_size column already exists!');
  console.log('Test data:', JSON.stringify(testData));
}
