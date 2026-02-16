import 'dotenv/config';

const baseUrl = process.env.BUILT_IN_FORGE_API_URL?.replace(/\/+$/, '');
const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

if (!baseUrl || !apiKey) {
  console.log('ERROR: Missing FORGE env vars');
  process.exit(1);
}

// Create a tiny 1x1 PNG
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const buffer = Buffer.from(pngBase64, 'base64');

const key = `portfolio/test/upload-test-${Date.now()}.png`;
const uploadUrl = new URL('v1/storage/upload', baseUrl + '/');
uploadUrl.searchParams.set('path', key);

console.log('Upload URL:', uploadUrl.toString());
console.log('Key:', key);

const blob = new Blob([buffer], { type: 'image/png' });
const form = new FormData();
form.append('file', blob, 'test.png');

try {
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: form,
  });
  
  console.log('Status:', response.status, response.statusText);
  const text = await response.text();
  console.log('Response:', text);
  
  if (response.ok) {
    const json = JSON.parse(text);
    console.log('SUCCESS! URL:', json.url);
  } else {
    console.log('FAILED with status', response.status);
  }
} catch (err) {
  console.log('ERROR:', err.message);
}
