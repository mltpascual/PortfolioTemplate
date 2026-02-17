import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";

// ==========================================
// INPUT VALIDATION HELPERS
// ==========================================

/** Safe URL validator: only allows http(s):// URLs (blocks javascript:, data:, etc.) */
const safeUrl = z
  .string()
  .refine(
    (val) => {
      if (!val) return true; // empty is OK (optional fields)
      try {
        const url = new URL(val);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Must be a valid HTTP(S) URL" }
  )
  .optional();

/** Allowed heading fonts (validated server-side to prevent CSS injection) */
const ALLOWED_HEADING_FONTS = [
  "DM Serif Display", "Playfair Display", "Lora", "Merriweather",
  "Cormorant Garamond", "Libre Baskerville", "EB Garamond", "Crimson Text",
  "Bitter", "Josefin Sans", "Montserrat", "Raleway", "Poppins", "Inter", "Space Grotesk",
] as const;

/** Allowed body fonts (validated server-side to prevent CSS injection) */
const ALLOWED_BODY_FONTS = [
  "DM Sans", "Inter", "Poppins", "Nunito", "Open Sans", "Lato",
  "Source Sans 3", "Roboto", "Work Sans", "Outfit", "Plus Jakarta Sans",
  "Manrope", "Figtree", "Geist", "IBM Plex Sans",
] as const;

/** Hex color validator */
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color (e.g. #B85C38)").optional();

/** Safe text validator: limits length to prevent abuse */
const safeText = (maxLen: number) => z.string().max(maxLen).optional();
const requiredText = (maxLen: number) => z.string().min(1).max(maxLen);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==========================================
  // PUBLIC: Get full portfolio data
  // ==========================================
  portfolio: router({
    getAll: publicProcedure.query(async () => {
      return db.getFullPortfolio();
    }),
  }),

  // ==========================================
  // PUBLIC: Get theme settings (for frontend rendering)
  // ==========================================
  theme: router({
    get: publicProcedure.query(async () => {
      return db.getThemeSettings();
    }),
  }),

  // ==========================================
  // ADMIN: Theme settings management
  // ==========================================
  adminTheme: router({
    get: adminProcedure.query(async () => {
      return db.getThemeSettings();
    }),
    update: adminProcedure
      .input(
        z.object({
          accentColor: hexColor,
          accentColorHover: hexColor,
          headingFont: z.enum(ALLOWED_HEADING_FONTS).optional(),
          bodyFont: z.enum(ALLOWED_BODY_FONTS).optional(),
          darkMode: z.boolean().optional(),
          layoutMode: z.enum(["separate", "combined"]).optional(),
          sectionOrder: z.string().max(500).optional(),
          hiddenSections: z.string().max(500).optional(),
          sectionTitles: z.string().max(2000).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.updateThemeSettings(input);
      }),
    reset: adminProcedure.mutation(async () => {
      return db.resetThemeSettings();
    }),
  }),

  // ==========================================
  // ADMIN: Profile management
  // ==========================================
  adminProfile: router({
    get: adminProcedure.query(async () => {
      return db.getProfile();
    }),
    update: adminProcedure
      .input(
        z.object({
          fullName: safeText(200),
          title: safeText(300),
          bio: safeText(5000),
          heroTagline: safeText(500),
          heroSubtitle: safeText(2000),
          avatarUrl: safeUrl,
          resumeUrl: safeUrl,
          githubUrl: safeUrl,
          linkedinUrl: safeUrl,
          twitterUrl: safeUrl,
          email: z.string().email().max(320).optional().or(z.literal("")),
          phone: safeText(50),
          location: safeText(200),
          yearsExperience: safeText(20),
          projectsDelivered: safeText(20),
          openSourceContributions: safeText(20),
          clientSatisfaction: safeText(20),
          availableForWork: z.number().min(0).max(1).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.upsertProfile(input);
      }),
  }),

  // ==========================================
  // ADMIN: Projects management
  // ==========================================
  adminProjects: router({
    list: adminProcedure.query(async () => {
      return db.getProjects();
    }),
    create: adminProcedure
      .input(
        z.object({
          title: requiredText(300),
          description: safeText(5000),
          imageUrl: safeUrl,
          liveUrl: safeUrl,
          githubUrl: safeUrl,
          tags: safeText(1000),
          featured: z.number().min(0).max(1).optional(),
          tileSize: z.enum(["small", "medium", "large", "wide"]).optional(),
          sortOrder: z.number().min(0).max(9999).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createProject(input);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          title: safeText(300),
          description: safeText(5000),
          imageUrl: safeUrl,
          liveUrl: safeUrl,
          githubUrl: safeUrl,
          tags: safeText(1000),
          featured: z.number().min(0).max(1).optional(),
          tileSize: z.enum(["small", "medium", "large", "wide"]).optional(),
          sortOrder: z.number().min(0).max(9999).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateProject(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteProject(input.id);
        return { success: true };
      }),
    reorder: adminProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              id: z.number().int().positive(),
              sortOrder: z.number().min(0).max(9999),
            })
          ).min(1).max(100),
        })
      )
      .mutation(async ({ input }) => {
        await db.reorderProjects(input.items);
        return { success: true };
      }),
    bulkTileSize: adminProcedure
      .input(
        z.object({
          tileSize: z.enum(["small", "medium", "large", "wide"]),
        })
      )
      .mutation(async ({ input }) => {
        await db.bulkUpdateTileSize(input.tileSize);
        return { success: true };
      }),
    bulkTags: adminProcedure
      .input(
        z.object({
          tags: z.string().max(1000),
        })
      )
      .mutation(async ({ input }) => {
        await db.bulkUpdateProjectTags(input.tags);
        return { success: true };
      }),
  }),

  // ==========================================
  // ADMIN: Experiences management
  // ==========================================
  adminExperiences: router({
    list: adminProcedure.query(async () => {
      return db.getExperiences();
    }),
    create: adminProcedure
      .input(
        z.object({
          role: requiredText(300),
          company: requiredText(300),
          period: requiredText(100),
          description: safeText(5000),
          tags: safeText(1000),
          logoUrl: safeUrl,
          sortOrder: z.number().min(0).max(9999).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createExperience(input);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          role: safeText(300),
          company: safeText(300),
          period: safeText(100),
          description: safeText(5000),
          tags: safeText(1000),
          logoUrl: safeUrl,
          sortOrder: z.number().min(0).max(9999).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateExperience(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteExperience(input.id);
        return { success: true };
      }),
  }),

  // ==========================================
  // PUBLIC: Track project analytics events
  // ==========================================
  analytics: router({
    track: publicProcedure
      .input(
        z.object({
          projectId: z.number().int().positive(),
          eventType: z.enum(["click", "view"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await db.trackProjectEvent({
          projectId: input.projectId,
          eventType: input.eventType,
          referrer: ctx.req.headers.referer || undefined,
          userAgent: ctx.req.headers["user-agent"] || undefined,
        });
        return { success: true };
      }),
  }),

  // ==========================================
  // ADMIN: Analytics dashboard
  // ==========================================
  adminAnalytics: router({
    summary: adminProcedure.query(async () => {
      return db.getProjectAnalyticsSummary();
    }),
    detail: adminProcedure
      .input(z.object({ projectId: z.number().int().positive() }))
      .query(async ({ input }) => {
        return db.getProjectAnalyticsDetail(input.projectId);
      }),
  }),

  // ==========================================
  // ADMIN: Education management
  // ==========================================
  adminEducation: router({
    list: adminProcedure.query(async () => {
      return db.getEducation();
    }),
    create: adminProcedure
      .input(
        z.object({
          institution: requiredText(300),
          degree: requiredText(300),
          fieldOfStudy: safeText(300),
          startYear: z.number().int().min(1950).max(2100),
          endYear: z.number().int().min(1950).max(2100).optional().nullable(),
          description: safeText(5000),
          logoUrl: safeUrl,
          sortOrder: z.number().min(0).max(9999).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return db.createEducation({ ...input, userId: ctx.user?.openId || 'admin' });
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          institution: safeText(300),
          degree: safeText(300),
          fieldOfStudy: safeText(300),
          startYear: z.number().int().min(1950).max(2100).optional(),
          endYear: z.number().int().min(1950).max(2100).optional().nullable(),
          description: safeText(5000),
          logoUrl: safeUrl,
          sortOrder: z.number().min(0).max(9999).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateEducation(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteEducation(input.id);
        return { success: true };
      }),
  }),

  // ==========================================
  // ADMIN: Image upload via tRPC
  // ==========================================
  adminUpload: router({
    image: adminProcedure
      .input(
        z.object({
          fileData: z.string().max(15 * 1024 * 1024), // ~10MB base64
          fileName: z.string().max(255),
          contentType: z.enum(["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]),
        })
      )
      .mutation(async ({ input }) => {
        const { fileData, fileName, contentType } = input;

        // Convert base64 to buffer
        const buffer = Buffer.from(fileData, "base64");

        // Generate unique file key
        const ext = fileName.split(".").pop() || "png";
        const randomSuffix = Math.random().toString(36).substring(2, 10);
        const fileKey = `portfolio/images/${Date.now()}-${randomSuffix}.${ext}`;

        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, contentType);
        return { url, key: fileKey };
      }),
  }),

  // ==========================================
  // ADMIN: Skills management
  // ==========================================
  adminSkills: router({
    list: adminProcedure.query(async () => {
      return db.getSkillCategories();
    }),
    create: adminProcedure
      .input(
        z.object({
          title: requiredText(200),
          icon: safeText(50),
          skills: safeText(2000),
          sortOrder: z.number().min(0).max(9999).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createSkillCategory(input);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          title: safeText(200),
          icon: safeText(50),
          skills: safeText(2000),
          sortOrder: z.number().min(0).max(9999).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateSkillCategory(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteSkillCategory(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
