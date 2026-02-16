import { describe, expect, it } from "vitest";

describe("GitHub OAuth credentials", () => {
  it("GITHUB_CLIENT_ID is set and looks valid", () => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    expect(clientId).toBeDefined();
    expect(clientId!.length).toBeGreaterThan(10);
    // GitHub OAuth Client IDs start with "Ov23" or similar prefix
    expect(clientId).toBeTruthy();
  });

  it("GITHUB_CLIENT_SECRET is set and looks valid", () => {
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    expect(clientSecret).toBeDefined();
    expect(clientSecret!.length).toBe(40); // GitHub secrets are 40 hex chars
    expect(/^[a-f0-9]{40}$/.test(clientSecret!)).toBe(true);
  });

  it("GITHUB_OWNER_USERNAME is set", () => {
    const ownerUsername = process.env.GITHUB_OWNER_USERNAME;
    expect(ownerUsername).toBeDefined();
    expect(ownerUsername).toBe("mltpascual");
  });

  it("can reach GitHub OAuth authorize endpoint", async () => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user%20user:email`;
    const response = await fetch(url, { method: "HEAD", redirect: "manual" });
    // GitHub should return 200 (login page) or 302 (redirect if already logged in)
    expect([200, 302]).toContain(response.status);
  });
});
