import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

// Create a public bucket for portfolio images
const { data: buckets, error: listError } = await supabase.storage.listBuckets();
console.log('Existing buckets:', buckets?.map(b => b.name));

const bucketName = 'portfolio-images';
const existing = buckets?.find(b => b.name === bucketName);

if (existing) {
  console.log(`Bucket "${bucketName}" already exists`);
} else {
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  });
  
  if (error) {
    console.error('Error creating bucket:', error.message);
  } else {
    console.log('Bucket created:', data);
  }
}

// Test upload
const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

const { data: uploadData, error: uploadError } = await supabase.storage
  .from(bucketName)
  .upload(`test/test-${Date.now()}.png`, testBuffer, {
    contentType: 'image/png',
    upsert: true,
  });

if (uploadError) {
  console.error('Test upload error:', uploadError.message);
} else {
  console.log('Test upload success:', uploadData);
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(uploadData.path);
  
  console.log('Public URL:', urlData.publicUrl);
}
