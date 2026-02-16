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

      // Default: return a theme settings row with layout fields
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

describe("Layout Settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DEFAULT_THEME layout fields", () => {
    it("should have layout_mode set to 'separate' by default", () => {
      expect(DEFAULT_THEME.layout_mode).toBe("separate");
    });

    it("should have a default section_order with all 7 sections", () => {
      expect(DEFAULT_THEME.section_order).toBe(
        "hero,about,projects,skills,experience,education,contact"
      );
      const sections = DEFAULT_THEME.section_order.split(",");
      expect(sections).toHaveLength(7);
      expect(sections).toContain("hero");
      expect(sections).toContain("about");
      expect(sections).toContain("projects");
      expect(sections).toContain("skills");
      expect(sections).toContain("experience");
      expect(sections).toContain("education");
      expect(sections).toContain("contact");
    });
  });

  describe("getThemeSettings with layout fields", () => {
    it("should return layoutMode and sectionOrder in camelCase", async () => {
      const result = await getThemeSettings();

      expect(result).toHaveProperty("layoutMode");
      expect(result).toHaveProperty("sectionOrder");
      expect(result.layoutMode).toBe("separate");
      expect(result.sectionOrder).toBe(
        "hero,about,projects,skills,experience,education,contact"
      );
    });

    it("should not return snake_case layout fields", async () => {
      const result = await getThemeSettings();

      expect(result).not.toHaveProperty("layout_mode");
      expect(result).not.toHaveProperty("section_order");
    });
  });

  describe("updateThemeSettings with layout fields", () => {
    it("should accept layoutMode update", async () => {
      const result = await updateThemeSettings({
        layoutMode: "combined",
      });

      expect(result).toHaveProperty("layoutMode");
    });

    it("should accept sectionOrder update", async () => {
      const result = await updateThemeSettings({
        sectionOrder: "hero,projects,about,skills,experience,education,contact",
      });

      expect(result).toHaveProperty("sectionOrder");
    });

    it("should accept both layout fields together", async () => {
      const result = await updateThemeSettings({
        layoutMode: "combined",
        sectionOrder: "hero,projects,about,skills,experience,education,contact",
      });

      expect(result).toHaveProperty("layoutMode");
      expect(result).toHaveProperty("sectionOrder");
    });

    it("should accept layout fields alongside theme fields", async () => {
      const result = await updateThemeSettings({
        accentColor: "#2563EB",
        layoutMode: "combined",
        sectionOrder: "hero,projects,about,contact,skills,experience,education",
      });

      expect(result).toHaveProperty("accentColor");
      expect(result).toHaveProperty("layoutMode");
      expect(result).toHaveProperty("sectionOrder");
    });
  });

  describe("resetThemeSettings includes layout defaults", () => {
    it("should reset layout fields to defaults", async () => {
      const result = await resetThemeSettings();

      expect(result).toHaveProperty("layoutMode");
      expect(result).toHaveProperty("sectionOrder");
    });
  });

  describe("Section order validation", () => {
    it("should parse section order string into valid array", () => {
      const order = DEFAULT_THEME.section_order;
      const sections = order.split(",").map((s) => s.trim()).filter(Boolean);
      expect(sections.every((s) => typeof s === "string" && s.length > 0)).toBe(true);
    });

    it("should handle reordered sections", () => {
      const reordered = "projects,hero,about,contact,skills,experience,education";
      const sections = reordered.split(",").map((s) => s.trim()).filter(Boolean);
      expect(sections).toHaveLength(7);
      expect(sections[0]).toBe("projects");
      expect(sections[1]).toBe("hero");
    });
  });
});
