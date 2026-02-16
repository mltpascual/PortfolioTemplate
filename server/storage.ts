// Supabase Storage helpers for portfolio image uploads
// Uses Supabase Storage (public bucket) instead of Manus Forge S3

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const BUCKET_NAME = "portfolio-images";

let _storageClient: SupabaseClient | null = null;

function getStorageClient(): SupabaseClient {
  if (!_storageClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "Storage credentials missing: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
      );
    }
    _storageClient = createClient(url, key);
  }
  return _storageClient;
}

/**
 * Upload a file to Supabase Storage (public bucket).
 * Returns the public URL and storage key.
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getStorageClient();
  const key = relKey.replace(/^\/+/, ""); // normalize leading slashes

  const { data: uploadData, error } = await client.storage
    .from(BUCKET_NAME)
    .upload(key, data, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = client.storage
    .from(BUCKET_NAME)
    .getPublicUrl(uploadData.path);

  return { key: uploadData.path, url: urlData.publicUrl };
}

/**
 * Get the public URL for a file in Supabase Storage.
 */
export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const client = getStorageClient();
  const key = relKey.replace(/^\/+/, "");

  const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(key);

  return { key, url: data.publicUrl };
}

/**
 * Delete a file from Supabase Storage.
 */
export async function storageDelete(relKey: string): Promise<void> {
  const client = getStorageClient();
  const key = relKey.replace(/^\/+/, "");

  const { error } = await client.storage.from(BUCKET_NAME).remove([key]);

  if (error) {
    throw new Error(`Storage delete failed: ${error.message}`);
  }
}
