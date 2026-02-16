import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase service_role key validation", () => {
  it("should connect with service_role key and have admin access", async () => {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(url).toBeTruthy();
    expect(serviceRoleKey).toBeTruthy();
    // Decode the JWT payload to verify it contains service_role
    const payload = JSON.parse(Buffer.from(serviceRoleKey!.split('.')[1], 'base64').toString());
    expect(payload.role).toBe("service_role");

    const supabase = createClient(url!, serviceRoleKey!);

    // service_role key should be able to read from any table
    const { data, error } = await supabase.from("profile").select("id").limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should be different from the anon key", () => {
    const anonKey = process.env.SUPABASE_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(anonKey).toBeTruthy();
    expect(serviceRoleKey).toBeTruthy();
    expect(anonKey).not.toEqual(serviceRoleKey);
  });
});
