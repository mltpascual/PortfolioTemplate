import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Supabase client
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockLimit = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();

function createChain() {
  const chain: any = {
    select: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    update: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    single: vi.fn(() => ({ data: null, error: null })),
  };
  return chain;
}

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      const chain = createChain();
      mockFrom(table);
      
      // Default: return a theme settings row
      chain.single = vi.fn(() => ({
        data: {
          id: 1,
          accent_color: "#B85C38",
          accent_color_hover: "#9A4A2E",
          heading_font: "DM Serif Display",
          body_font: "DM Sans",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
        error: null,
      }));
      
      return chain;
    }),
  })),
}));

// Set required env vars before importing db
process.env.SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

import { getThemeSettings, updateThemeSettings, resetThemeSettings, DEFAULT_THEME } from "./db";

describe("Theme Settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DEFAULT_THEME", () => {
    it("should have correct default values", () => {
      expect(DEFAULT_THEME.accent_color).toBe("#B85C38");
      expect(DEFAULT_THEME.accent_color_hover).toBe("#9A4A2E");
      expect(DEFAULT_THEME.heading_font).toBe("DM Serif Display");
      expect(DEFAULT_THEME.body_font).toBe("DM Sans");
    });
  });

  describe("getThemeSettings", () => {
    it("should return theme settings from database", async () => {
      const result = await getThemeSettings();
      
      expect(result).toHaveProperty("accentColor");
      expect(result).toHaveProperty("accentColorHover");
      expect(result).toHaveProperty("headingFont");
      expect(result).toHaveProperty("bodyFont");
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("createdAt");
      expect(result).toHaveProperty("updatedAt");
    });

    it("should convert snake_case to camelCase", async () => {
      const result = await getThemeSettings();
      
      // Should have camelCase properties, not snake_case
      expect(result).not.toHaveProperty("accent_color");
      expect(result).not.toHaveProperty("accent_color_hover");
      expect(result).not.toHaveProperty("heading_font");
      expect(result).not.toHaveProperty("body_font");
      expect(result).not.toHaveProperty("created_at");
      expect(result).not.toHaveProperty("updated_at");
    });
  });

  describe("updateThemeSettings", () => {
    it("should accept partial theme updates", async () => {
      const result = await updateThemeSettings({
        accentColor: "#2563EB",
      });
      
      expect(result).toHaveProperty("accentColor");
    });

    it("should accept full theme updates", async () => {
      const result = await updateThemeSettings({
        accentColor: "#2563EB",
        accentColorHover: "#1D4ED8",
        headingFont: "Playfair Display",
        bodyFont: "Inter",
      });
      
      expect(result).toHaveProperty("accentColor");
      expect(result).toHaveProperty("headingFont");
      expect(result).toHaveProperty("bodyFont");
    });
  });

  describe("resetThemeSettings", () => {
    it("should reset to default values", async () => {
      const result = await resetThemeSettings();
      
      expect(result).toHaveProperty("accentColor");
      expect(result).toHaveProperty("headingFont");
      expect(result).toHaveProperty("bodyFont");
    });
  });
});
