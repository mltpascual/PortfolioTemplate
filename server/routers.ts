import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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
  // ADMIN: Profile management
  // ==========================================
  adminProfile: router({
    get: adminProcedure.query(async () => {
      return db.getProfile();
    }),
    update: adminProcedure
      .input(
        z.object({
          fullName: z.string().optional(),
          title: z.string().optional(),
          bio: z.string().optional(),
          heroTagline: z.string().optional(),
          heroSubtitle: z.string().optional(),
          avatarUrl: z.string().optional(),
          resumeUrl: z.string().optional(),
          githubUrl: z.string().optional(),
          linkedinUrl: z.string().optional(),
          twitterUrl: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          location: z.string().optional(),
          yearsExperience: z.string().optional(),
          projectsDelivered: z.string().optional(),
          openSourceContributions: z.string().optional(),
          clientSatisfaction: z.string().optional(),
          availableForWork: z.number().optional(),
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
          title: z.string(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          liveUrl: z.string().optional(),
          githubUrl: z.string().optional(),
          tags: z.string().optional(),
          featured: z.number().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createProject(input);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          liveUrl: z.string().optional(),
          githubUrl: z.string().optional(),
          tags: z.string().optional(),
          featured: z.number().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateProject(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProject(input.id);
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
          role: z.string(),
          company: z.string(),
          period: z.string(),
          description: z.string().optional(),
          tags: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createExperience(input);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          role: z.string().optional(),
          company: z.string().optional(),
          period: z.string().optional(),
          description: z.string().optional(),
          tags: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateExperience(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteExperience(input.id);
        return { success: true };
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
          title: z.string(),
          icon: z.string().optional(),
          skills: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createSkillCategory(input);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          icon: z.string().optional(),
          skills: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateSkillCategory(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSkillCategory(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
