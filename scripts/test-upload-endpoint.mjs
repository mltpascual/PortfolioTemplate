import 'dotenv/config';
import { SignJWT } from 'jose';
import { createClient } from '@supabase/supabase-js';

// First, get a real admin user from the database
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data: adminUser, error } = await sb
  .from('app_users')
  .select('*')
  .eq('role', 'admin')
  .limit(1)
  .single();

if (error || !adminUser) {
  console.log('No admin user found:', error?.message);
  process.exit(1);
}

console.log('Admin user found:', adminUser.github_id, adminUser.name);

// Create a JWT token matching the SDK format (githubId + name)
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const expiresInMs = 30 * 24 * 60 * 60 * 1000;
const issuedAt = Date.now();
const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);

const token = await new SignJWT({ 
  githubId: adminUser.github_id,
  name: adminUser.name || '',
})
  .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
  .setExpirationTime(expirationSeconds)
  .sign(secret);

console.log('JWT Token created');

// Test the upload endpoint with the correct cookie name
const response = await fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Cookie': 'app_session_id=' + token
  },
  body: JSON.stringify({
    fileData: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    fileName: 'test.png',
    contentType: 'image/png'
  })
});

console.log('Status:', response.status, response.statusText);
const text = await response.text();
console.log('Response:', text);

if (response.ok) {
  const data = JSON.parse(text);
  console.log('SUCCESS! Image URL:', data.url);
} else {
  console.log('FAILED');
}
