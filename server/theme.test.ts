import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Supabase client
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

      // Default: return a theme settings row
      chain.single = vi.fn(() => ({
        data: {
          id: 1,
          accent_color: "#B85C38",
          accent_color_hover: "#9A4A2E",
          heading_font: "DM Serif Display",
          body_font: "DM Sans",
          dark_mode: false,
          layout_mode: "separate",
          section_order: "hero,about,projects,skills,experience,education,contact",
          hidden_sections: "",
          section_titles: null,
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

    it("should have dark_mode set to false by default", () => {
      expect(DEFAULT_THEME.dark_mode).toBe(false);
    });
  });

  describe("getThemeSettings", () => {
    it("should return theme settings from database", async () => {
      const result = await getThemeSettings();

      expect(result).toHaveProperty("accentColor");
      expect(result).toHaveProperty("accentColorHover");
      expect(result).toHaveProperty("headingFont");
      expect(result).toHaveProperty("bodyFont");
      expect(result).toHaveProperty("darkMode");
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
      expect(result).not.toHaveProperty("dark_mode");
      expect(result).not.toHaveProperty("created_at");
      expect(result).not.toHaveProperty("updated_at");
    });

    it("should return darkMode as a boolean", async () => {
      const result = await getThemeSettings();
      expect(typeof result.darkMode).toBe("boolean");
    });
  });

  describe("updateThemeSettings", () => {
    it("should accept partial theme updates", async () => {
      const result = await updateThemeSettings({
        accentColor: "#2563EB",
      });

      expect(result).toHaveProperty("accentColor");
    });

    it("should accept full theme updates including darkMode", async () => {
      const result = await updateThemeSettings({
        accentColor: "#2563EB",
        accentColorHover: "#1D4ED8",
        headingFont: "Playfair Display",
        bodyFont: "Inter",
        darkMode: true,
      });

      expect(result).toHaveProperty("accentColor");
      expect(result).toHaveProperty("headingFont");
      expect(result).toHaveProperty("bodyFont");
      expect(result).toHaveProperty("darkMode");
    });

    it("should accept darkMode toggle update", async () => {
      const result = await updateThemeSettings({
        darkMode: true,
      });

      expect(result).toHaveProperty("darkMode");
    });

    it("should accept sectionTitles update", async () => {
      const sectionTitles = JSON.stringify({
        about: "My Story",
        projects: "My Work",
        skills: "Tech Stack",
      });

      const result = await updateThemeSettings({
        sectionTitles,
      });

      expect(result).toHaveProperty("sectionTitles");
    });

    it("should accept layout settings with sectionTitles", async () => {
      const result = await updateThemeSettings({
        layoutMode: "combined",
        sectionOrder: "hero,about,skills,experience,education,projects,contact",
        hiddenSections: "education",
        sectionTitles: JSON.stringify({ about: "About Me Custom" }),
      });

      expect(result).toHaveProperty("layoutMode");
      expect(result).toHaveProperty("sectionOrder");
      expect(result).toHaveProperty("hiddenSections");
      expect(result).toHaveProperty("sectionTitles");
    });
  });

  describe("resetThemeSettings", () => {
    it("should reset to default values", async () => {
      const result = await resetThemeSettings();

      expect(result).toHaveProperty("accentColor");
      expect(result).toHaveProperty("headingFont");
      expect(result).toHaveProperty("bodyFont");
      expect(result).toHaveProperty("darkMode");
    });
  });
});
