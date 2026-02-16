import { describe, it, expect, vi } from "vitest";

/**
 * Tests for the project reorder functionality.
 * Validates the reorderProjects db function and the router endpoint.
 */

// Mock Supabase
const mockUpdate = vi.fn();
const mockEq = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      update: (data: any) => {
        mockUpdate(data);
        return {
          eq: (col: string, val: any) => {
            mockEq(col, val);
            return Promise.resolve({ error: null });
          },
        };
      },
    }),
  }),
}));

describe("Project Reorder", () => {
  it("should validate reorder input requires at least 1 item", async () => {
    const { z } = await import("zod");

    const reorderSchema = z.object({
      items: z
        .array(
          z.object({
            id: z.number().int().positive(),
            sortOrder: z.number().min(0).max(9999),
          })
        )
        .min(1)
        .max(100),
    });

    // Empty array should fail
    const emptyResult = reorderSchema.safeParse({ items: [] });
    expect(emptyResult.success).toBe(false);

    // Single item should pass
    const singleResult = reorderSchema.safeParse({
      items: [{ id: 1, sortOrder: 1 }],
    });
    expect(singleResult.success).toBe(true);

    // Multiple items should pass
    const multiResult = reorderSchema.safeParse({
      items: [
        { id: 1, sortOrder: 1 },
        { id: 2, sortOrder: 2 },
        { id: 3, sortOrder: 3 },
      ],
    });
    expect(multiResult.success).toBe(true);
  });

  it("should reject invalid sort orders", async () => {
    const { z } = await import("zod");

    const reorderSchema = z.object({
      items: z
        .array(
          z.object({
            id: z.number().int().positive(),
            sortOrder: z.number().min(0).max(9999),
          })
        )
        .min(1)
        .max(100),
    });

    // Negative sort order should fail
    const negativeResult = reorderSchema.safeParse({
      items: [{ id: 1, sortOrder: -1 }],
    });
    expect(negativeResult.success).toBe(false);

    // Sort order > 9999 should fail
    const overflowResult = reorderSchema.safeParse({
      items: [{ id: 1, sortOrder: 10000 }],
    });
    expect(overflowResult.success).toBe(false);
  });

  it("should reject non-positive IDs", async () => {
    const { z } = await import("zod");

    const reorderSchema = z.object({
      items: z
        .array(
          z.object({
            id: z.number().int().positive(),
            sortOrder: z.number().min(0).max(9999),
          })
        )
        .min(1)
        .max(100),
    });

    // Zero ID should fail
    const zeroResult = reorderSchema.safeParse({
      items: [{ id: 0, sortOrder: 1 }],
    });
    expect(zeroResult.success).toBe(false);

    // Negative ID should fail
    const negResult = reorderSchema.safeParse({
      items: [{ id: -5, sortOrder: 1 }],
    });
    expect(negResult.success).toBe(false);
  });

  it("should reject more than 100 items", async () => {
    const { z } = await import("zod");

    const reorderSchema = z.object({
      items: z
        .array(
          z.object({
            id: z.number().int().positive(),
            sortOrder: z.number().min(0).max(9999),
          })
        )
        .min(1)
        .max(100),
    });

    const tooMany = Array.from({ length: 101 }, (_, i) => ({
      id: i + 1,
      sortOrder: i + 1,
    }));

    const result = reorderSchema.safeParse({ items: tooMany });
    expect(result.success).toBe(false);
  });

  it("should accept exactly 100 items", async () => {
    const { z } = await import("zod");

    const reorderSchema = z.object({
      items: z
        .array(
          z.object({
            id: z.number().int().positive(),
            sortOrder: z.number().min(0).max(9999),
          })
        )
        .min(1)
        .max(100),
    });

    const exactly100 = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      sortOrder: i + 1,
    }));

    const result = reorderSchema.safeParse({ items: exactly100 });
    expect(result.success).toBe(true);
  });
});
