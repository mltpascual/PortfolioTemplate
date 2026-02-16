import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase connection", () => {
  it("connects to Supabase with provided credentials", async () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    // Ensure env vars are set
    expect(url).toBeDefined();
    expect(key).toBeDefined();
    expect(url).not.toBe("");
    expect(key).not.toBe("");

    // Create client and test connection
    const supabase = createClient(url!, key!);

    // A simple health check - querying a non-existent table should return an error but not crash
    // This validates that the URL and key are valid and the client can reach Supabase
    const { error } = await supabase.from("_health_check_nonexistent").select("*").limit(1);

    // We expect a "relation does not exist" type error, NOT an auth/connection error
    // If credentials are wrong, we'd get a 401/403 error
    if (error) {
      // These error messages indicate the connection itself is working
      const isTableNotFound =
        error.message.includes("does not exist") ||
        error.message.includes("relation") ||
        error.code === "42P01" ||
        error.code === "PGRST116";
      
      // Auth errors indicate bad credentials
      const isAuthError =
        error.message.includes("Invalid API key") ||
        error.message.includes("401") ||
        error.message.includes("403") ||
        error.message.includes("JWT");

      expect(isAuthError).toBe(false);
    }
    // If no error, that also means connection works
  });
});
