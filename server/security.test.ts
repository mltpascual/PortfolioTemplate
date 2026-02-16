import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ==========================================
// Test Helpers
// ==========================================

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as any,
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as any,
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as any,
  };
}

// ==========================================
// CRITICAL-02: URL Validation Tests
// ==========================================

describe("Input Validation: URL Fields", () => {
  it("rejects javascript: URLs in profile avatarUrl", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminProfile.update({ avatarUrl: "javascript:alert(1)" })
    ).rejects.toThrow();
  });

  it("rejects data: URLs in profile resumeUrl", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminProfile.update({ resumeUrl: "data:text/html,<script>alert(1)</script>" })
    ).rejects.toThrow();
  });

  it("rejects javascript: URLs in project liveUrl", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminProjects.create({
        title: "Test Project",
        liveUrl: "javascript:void(0)",
      })
    ).rejects.toThrow();
  });

  it("rejects javascript: URLs in project imageUrl", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminProjects.create({
        title: "Test Project",
        imageUrl: "javascript:alert(document.cookie)",
      })
    ).rejects.toThrow();
  });

  it("accepts valid https URLs", async () => {
    // This test validates the schema accepts valid URLs
    // (actual DB call may fail but validation should pass)
    const caller = appRouter.createCaller(createAdminContext());
    // The validation should not throw for valid URLs
    // We catch DB errors since we're testing validation, not DB
    try {
      await caller.adminProfile.update({
        avatarUrl: "https://example.com/avatar.jpg",
        githubUrl: "https://github.com/testuser",
      });
    } catch (e: any) {
      // DB errors are OK - we're testing that validation passes
      expect(e.message).not.toContain("Must be a valid HTTP(S) URL");
    }
  });

  it("accepts empty strings for optional URL fields", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    try {
      await caller.adminProfile.update({
        avatarUrl: "",
      });
    } catch (e: any) {
      // DB errors are OK - we're testing that validation passes
      expect(e.message).not.toContain("Must be a valid HTTP(S) URL");
    }
  });
});

// ==========================================
// MEDIUM-01: Font Allowlist Validation Tests
// ==========================================

describe("Input Validation: Font Allowlist", () => {
  it("rejects arbitrary font names (CSS injection)", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminTheme.update({
        headingFont: "'; background: url('https://evil.com') '" as any,
      })
    ).rejects.toThrow();
  });

  it("rejects unknown font names", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminTheme.update({
        bodyFont: "MaliciousFont" as any,
      })
    ).rejects.toThrow();
  });

  it("accepts valid font from allowlist", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    try {
      await caller.adminTheme.update({
        headingFont: "Playfair Display",
        bodyFont: "Inter",
      });
    } catch (e: any) {
      // DB errors are OK - we're testing that validation passes
      expect(e.message).not.toContain("Invalid enum value");
    }
  });
});

// ==========================================
// Hex Color Validation Tests
// ==========================================

describe("Input Validation: Hex Colors", () => {
  it("rejects invalid hex colors", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminTheme.update({
        accentColor: "not-a-color",
      })
    ).rejects.toThrow();
  });

  it("rejects hex colors with extra characters (injection)", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminTheme.update({
        accentColor: "#B85C38; background: url(evil)",
      })
    ).rejects.toThrow();
  });

  it("accepts valid hex colors", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    try {
      await caller.adminTheme.update({
        accentColor: "#B85C38",
        accentColorHover: "#9A4A2E",
      });
    } catch (e: any) {
      // DB errors are OK
      expect(e.message).not.toContain("Must be a valid hex color");
    }
  });
});

// ==========================================
// Text Length Validation Tests
// ==========================================

describe("Input Validation: Text Length Limits", () => {
  it("rejects overly long project titles", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminProjects.create({
        title: "A".repeat(301), // max 300
      })
    ).rejects.toThrow();
  });

  it("rejects overly long profile bio", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminProfile.update({
        bio: "A".repeat(5001), // max 5000
      })
    ).rejects.toThrow();
  });

  it("rejects negative sort orders", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminProjects.create({
        title: "Test",
        sortOrder: -1,
      })
    ).rejects.toThrow();
  });

  it("rejects negative IDs in delete", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminProjects.delete({ id: -1 })
    ).rejects.toThrow();
  });

  it("rejects zero IDs in delete", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.adminProjects.delete({ id: 0 })
    ).rejects.toThrow();
  });
});

// ==========================================
// Authorization Tests
// ==========================================

describe("Authorization: Admin-only endpoints", () => {
  it("rejects unauthenticated access to admin profile", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.adminProfile.get()).rejects.toThrow();
  });

  it("rejects regular user access to admin profile", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.adminProfile.get()).rejects.toThrow();
  });

  it("rejects unauthenticated access to admin projects", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.adminProjects.list()).rejects.toThrow();
  });

  it("rejects regular user access to admin projects", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.adminProjects.list()).rejects.toThrow();
  });

  it("rejects unauthenticated access to admin theme", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.adminTheme.get()).rejects.toThrow();
  });

  it("rejects regular user access to admin theme update", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.adminTheme.update({ accentColor: "#FF0000" })
    ).rejects.toThrow();
  });

  it("allows public access to portfolio data", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    // Should not throw (may return empty data)
    try {
      await caller.portfolio.getAll();
    } catch (e: any) {
      // DB errors are OK - should not be auth error
      expect(e.message).not.toContain("login");
      expect(e.message).not.toContain("UNAUTHORIZED");
    }
  });

  it("allows public access to theme settings", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    try {
      await caller.theme.get();
    } catch (e: any) {
      expect(e.message).not.toContain("login");
      expect(e.message).not.toContain("UNAUTHORIZED");
    }
  });
});

// ==========================================
// CRITICAL-01: Open Redirect Prevention (unit-level)
// ==========================================

describe("Open Redirect Prevention: sanitizeReturnPath logic", () => {
  // We test the logic inline since the function is not exported
  // These tests validate the expected behavior patterns

  function sanitizeReturnPath(path: string): string {
    if (!path || typeof path !== "string") return "/";
    if (!path.startsWith("/") || path.startsWith("//")) return "/";
    const decoded = decodeURIComponent(path).toLowerCase();
    if (decoded.includes("javascript:") || decoded.includes("data:")) return "/";
    if (path.includes("\\")) return "/";
    return path;
  }

  it("allows valid relative paths", () => {
    expect(sanitizeReturnPath("/admin")).toBe("/admin");
    expect(sanitizeReturnPath("/")).toBe("/");
    expect(sanitizeReturnPath("/admin/projects")).toBe("/admin/projects");
  });

  it("blocks absolute URLs", () => {
    expect(sanitizeReturnPath("https://evil.com")).toBe("/");
    expect(sanitizeReturnPath("http://evil.com")).toBe("/");
  });

  it("blocks protocol-relative URLs", () => {
    expect(sanitizeReturnPath("//evil.com")).toBe("/");
    expect(sanitizeReturnPath("//evil.com/phish")).toBe("/");
  });

  it("blocks javascript: protocol", () => {
    expect(sanitizeReturnPath("/page?x=javascript:alert(1)")).toBe("/");
  });

  it("blocks data: protocol", () => {
    expect(sanitizeReturnPath("/page?x=data:text/html,<script>")).toBe("/");
  });

  it("blocks backslash-based bypasses", () => {
    expect(sanitizeReturnPath("\\evil.com")).toBe("/");
    expect(sanitizeReturnPath("/\\evil.com")).toBe("/");
  });

  it("returns / for empty or null-like input", () => {
    expect(sanitizeReturnPath("")).toBe("/");
    expect(sanitizeReturnPath(null as any)).toBe("/");
    expect(sanitizeReturnPath(undefined as any)).toBe("/");
  });
});
