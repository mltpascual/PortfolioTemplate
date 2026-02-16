import { eq, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  profile,
  projects,
  experiences,
  skillCategories,
  type InsertProfile,
  type InsertProject,
  type InsertExperience,
  type InsertSkillCategory,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==========================================
// PROFILE
// ==========================================

export async function getProfile() {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(profile).limit(1);
  return rows[0] ?? null;
}

export async function upsertProfile(data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getProfile();
  if (existing) {
    await db
      .update(profile)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profile.id, existing.id));
    return { ...existing, ...data };
  } else {
    await db.insert(profile).values(data as InsertProfile);
    return await getProfile();
  }
}

// ==========================================
// PROJECTS
// ==========================================

export async function getProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(asc(projects.sortOrder));
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(data);
  return { id: result[0].insertId, ...data };
}

export async function updateProject(
  id: number,
  data: Partial<InsertProject>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id));
  return getProjectById(id);
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(projects).where(eq(projects.id, id));
}

// ==========================================
// EXPERIENCES
// ==========================================

export async function getExperiences() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(experiences).orderBy(asc(experiences.sortOrder));
}

export async function getExperienceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(experiences)
    .where(eq(experiences.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createExperience(data: InsertExperience) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(experiences).values(data);
  return { id: result[0].insertId, ...data };
}

export async function updateExperience(
  id: number,
  data: Partial<InsertExperience>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(experiences)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(experiences.id, id));
  return getExperienceById(id);
}

export async function deleteExperience(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(experiences).where(eq(experiences.id, id));
}

// ==========================================
// SKILL CATEGORIES
// ==========================================

export async function getSkillCategories() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(skillCategories)
    .orderBy(asc(skillCategories.sortOrder));
}

export async function getSkillCategoryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(skillCategories)
    .where(eq(skillCategories.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createSkillCategory(data: InsertSkillCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(skillCategories).values(data);
  return { id: result[0].insertId, ...data };
}

export async function updateSkillCategory(
  id: number,
  data: Partial<InsertSkillCategory>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(skillCategories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(skillCategories.id, id));
  return getSkillCategoryById(id);
}

export async function deleteSkillCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(skillCategories).where(eq(skillCategories.id, id));
}

// ==========================================
// FULL PORTFOLIO (public endpoint)
// ==========================================

export async function getFullPortfolio() {
  const [profileData, projectsData, experiencesData, skillsData] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getExperiences(),
      getSkillCategories(),
    ]);

  return {
    profile: profileData,
    projects: projectsData,
    experiences: experiencesData,
    skills: skillsData,
  };
}
