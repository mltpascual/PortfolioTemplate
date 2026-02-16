import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

// ==========================================
// Supabase Client
// ==========================================

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL and SUPABASE_KEY must be set");
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Keep getDb for backward compatibility with _core auth system
// The built-in auth still uses Drizzle for the users table
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { users, type InsertUser } from "../drizzle/schema";

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
// TYPE DEFINITIONS (matching Supabase table columns)
// ==========================================

export interface Profile {
  id: number;
  full_name: string;
  title: string;
  bio: string | null;
  hero_tagline: string;
  hero_subtitle: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  email: string;
  phone: string;
  location: string;
  years_experience: string;
  projects_delivered: string;
  open_source_contributions: string;
  client_satisfaction: string;
  available_for_work: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  live_url: string;
  github_url: string;
  tags: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string | null;
  tags: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SkillCategory {
  id: number;
  title: string;
  icon: string;
  skills: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ==========================================
// HELPER: Convert snake_case Supabase rows to camelCase for frontend
// ==========================================

function profileToCamel(row: Profile) {
  return {
    id: row.id,
    fullName: row.full_name,
    title: row.title,
    bio: row.bio,
    heroTagline: row.hero_tagline,
    heroSubtitle: row.hero_subtitle,
    avatarUrl: row.avatar_url,
    resumeUrl: row.resume_url,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    twitterUrl: row.twitter_url,
    email: row.email,
    phone: row.phone,
    location: row.location,
    yearsExperience: row.years_experience,
    projectsDelivered: row.projects_delivered,
    openSourceContributions: row.open_source_contributions,
    clientSatisfaction: row.client_satisfaction,
    availableForWork: row.available_for_work ? 1 : 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function projectToCamel(row: Project) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    tags: row.tags,
    featured: row.featured ? 1 : 0,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function experienceToCamel(row: Experience) {
  return {
    id: row.id,
    role: row.role,
    company: row.company,
    period: row.period,
    description: row.description,
    tags: row.tags,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function skillCategoryToCamel(row: SkillCategory) {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    skills: row.skills,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ==========================================
// HELPER: Convert camelCase input to snake_case for Supabase
// ==========================================

function profileToSnake(data: Record<string, any>) {
  const map: Record<string, string> = {
    fullName: "full_name",
    title: "title",
    bio: "bio",
    heroTagline: "hero_tagline",
    heroSubtitle: "hero_subtitle",
    avatarUrl: "avatar_url",
    resumeUrl: "resume_url",
    githubUrl: "github_url",
    linkedinUrl: "linkedin_url",
    twitterUrl: "twitter_url",
    email: "email",
    phone: "phone",
    location: "location",
    yearsExperience: "years_experience",
    projectsDelivered: "projects_delivered",
    openSourceContributions: "open_source_contributions",
    clientSatisfaction: "client_satisfaction",
    availableForWork: "available_for_work",
  };
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
    const snakeKey = map[key] || key;
    // Convert availableForWork from number (0/1) to boolean
    if (key === "availableForWork") {
      result[snakeKey] = value === 1 || value === true;
    } else {
      result[snakeKey] = value;
    }
  }
  result.updated_at = new Date().toISOString();
  return result;
}

function projectToSnake(data: Record<string, any>) {
  const map: Record<string, string> = {
    title: "title",
    description: "description",
    imageUrl: "image_url",
    liveUrl: "live_url",
    githubUrl: "github_url",
    tags: "tags",
    featured: "featured",
    sortOrder: "sort_order",
  };
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
    const snakeKey = map[key] || key;
    // Convert featured from number (0/1) to boolean
    if (key === "featured") {
      result[snakeKey] = value === 1 || value === true;
    } else {
      result[snakeKey] = value;
    }
  }
  result.updated_at = new Date().toISOString();
  return result;
}

function experienceToSnake(data: Record<string, any>) {
  const map: Record<string, string> = {
    role: "role",
    company: "company",
    period: "period",
    description: "description",
    tags: "tags",
    sortOrder: "sort_order",
  };
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
    const snakeKey = map[key] || key;
    result[snakeKey] = value;
  }
  result.updated_at = new Date().toISOString();
  return result;
}

function skillCategoryToSnake(data: Record<string, any>) {
  const map: Record<string, string> = {
    title: "title",
    icon: "icon",
    skills: "skills",
    sortOrder: "sort_order",
  };
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
    const snakeKey = map[key] || key;
    result[snakeKey] = value;
  }
  result.updated_at = new Date().toISOString();
  return result;
}

// ==========================================
// PROFILE (Supabase)
// ==========================================

export async function getProfile() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("profile")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) return null;
  return profileToCamel(data as Profile);
}

export async function upsertProfile(input: Record<string, any>) {
  const sb = getSupabase();
  const snakeData = profileToSnake(input);

  // Check if profile exists
  const existing = await getProfile();
  if (existing) {
    const { data, error } = await sb
      .from("profile")
      .update(snakeData)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update profile: ${error.message}`);
    return profileToCamel(data as Profile);
  } else {
    const { data, error } = await sb
      .from("profile")
      .insert(snakeData)
      .select()
      .single();
    if (error) throw new Error(`Failed to create profile: ${error.message}`);
    return profileToCamel(data as Profile);
  }
}

// ==========================================
// PROJECTS (Supabase)
// ==========================================

export async function getProjects() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as Project[]).map(projectToCamel);
}

export async function getProjectById(id: number) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return projectToCamel(data as Project);
}

export async function createProject(input: Record<string, any>) {
  const sb = getSupabase();
  const snakeData = projectToSnake(input);
  const { data, error } = await sb
    .from("projects")
    .insert(snakeData)
    .select()
    .single();
  if (error) throw new Error(`Failed to create project: ${error.message}`);
  return projectToCamel(data as Project);
}

export async function updateProject(id: number, input: Record<string, any>) {
  const sb = getSupabase();
  const snakeData = projectToSnake(input);
  const { data, error } = await sb
    .from("projects")
    .update(snakeData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update project: ${error.message}`);
  return projectToCamel(data as Project);
}

export async function deleteProject(id: number) {
  const sb = getSupabase();
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete project: ${error.message}`);
}

// ==========================================
// EXPERIENCES (Supabase)
// ==========================================

export async function getExperiences() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as Experience[]).map(experienceToCamel);
}

export async function getExperienceById(id: number) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("experiences")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return experienceToCamel(data as Experience);
}

export async function createExperience(input: Record<string, any>) {
  const sb = getSupabase();
  const snakeData = experienceToSnake(input);
  const { data, error } = await sb
    .from("experiences")
    .insert(snakeData)
    .select()
    .single();
  if (error) throw new Error(`Failed to create experience: ${error.message}`);
  return experienceToCamel(data as Experience);
}

export async function updateExperience(
  id: number,
  input: Record<string, any>
) {
  const sb = getSupabase();
  const snakeData = experienceToSnake(input);
  const { data, error } = await sb
    .from("experiences")
    .update(snakeData)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update experience: ${error.message}`);
  return experienceToCamel(data as Experience);
}

export async function deleteExperience(id: number) {
  const sb = getSupabase();
  const { error } = await sb.from("experiences").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete experience: ${error.message}`);
}

// ==========================================
// SKILL CATEGORIES (Supabase)
// ==========================================

export async function getSkillCategories() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("skill_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as SkillCategory[]).map(skillCategoryToCamel);
}

export async function getSkillCategoryById(id: number) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("skill_categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return skillCategoryToCamel(data as SkillCategory);
}

export async function createSkillCategory(input: Record<string, any>) {
  const sb = getSupabase();
  const snakeData = skillCategoryToSnake(input);
  const { data, error } = await sb
    .from("skill_categories")
    .insert(snakeData)
    .select()
    .single();
  if (error)
    throw new Error(`Failed to create skill category: ${error.message}`);
  return skillCategoryToCamel(data as SkillCategory);
}

export async function updateSkillCategory(
  id: number,
  input: Record<string, any>
) {
  const sb = getSupabase();
  const snakeData = skillCategoryToSnake(input);
  const { data, error } = await sb
    .from("skill_categories")
    .update(snakeData)
    .eq("id", id)
    .select()
    .single();
  if (error)
    throw new Error(`Failed to update skill category: ${error.message}`);
  return skillCategoryToCamel(data as SkillCategory);
}

export async function deleteSkillCategory(id: number) {
  const sb = getSupabase();
  const { error } = await sb.from("skill_categories").delete().eq("id", id);
  if (error)
    throw new Error(`Failed to delete skill category: ${error.message}`);
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
