import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ==========================================
// Supabase Client
// ==========================================

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

/** Public client using anon key — respects RLS (read-only) */
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

/** Admin client using service_role key — bypasses RLS (read + write) */
function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
    }
    _supabaseAdmin = createClient(url, key);
  }
  return _supabaseAdmin;
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
  tile_size: string;
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
  logo_url: string | null;
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
    tileSize: row.tile_size || 'medium',
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
    logoUrl: row.logo_url,
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
    tileSize: "tile_size",
    sortOrder: "sort_order",
  };
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
    const snakeKey = map[key] || key;
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
    logoUrl: "logo_url",
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
  const sb = getSupabaseAdmin();
  const snakeData = profileToSnake(input);

  const existing = await getProfile();
  if (existing) {
    const { data, error } = await sb
      .from("profile")
      .update(snakeData)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) { console.error('[DB] Failed to update profile:', error.message); throw new Error('Failed to update profile'); }
    return profileToCamel(data as Profile);
  } else {
    const { data, error } = await sb
      .from("profile")
      .insert(snakeData)
      .select()
      .single();
    if (error) { console.error('[DB] Failed to create profile:', error.message); throw new Error('Failed to create profile'); }
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
  const sb = getSupabaseAdmin();
  const snakeData = projectToSnake(input);
  const { data, error } = await sb
    .from("projects")
    .insert(snakeData)
    .select()
    .single();
  if (error) { console.error('[DB] Failed to create project:', error.message); throw new Error('Failed to create project'); }
  return projectToCamel(data as Project);
}

export async function updateProject(id: number, input: Record<string, any>) {
  const sb = getSupabaseAdmin();
  const snakeData = projectToSnake(input);
  const { data, error } = await sb
    .from("projects")
    .update(snakeData)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error('[DB] Failed to update project:', error.message); throw new Error('Failed to update project'); }
  return projectToCamel(data as Project);
}

export async function deleteProject(id: number) {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) { console.error('[DB] Failed to delete project:', error.message); throw new Error('Failed to delete project'); }
}

export async function reorderProjects(items: Array<{ id: number; sortOrder: number }>) {
  const sb = getSupabaseAdmin();
  // Update each project's sort_order individually
  const promises = items.map((item) =>
    sb.from("projects").update({ sort_order: item.sortOrder }).eq("id", item.id)
  );
  const results = await Promise.all(promises);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error('[DB] Failed to reorder projects:', failed.error.message);
    throw new Error('Failed to reorder projects');
  }
}

export async function bulkUpdateTileSize(tileSize: string) {
  const sb = getSupabaseAdmin();
  const { error } = await sb
    .from("projects")
    .update({ tile_size: tileSize, updated_at: new Date().toISOString() })
    .neq("id", 0); // Update all rows
  if (error) {
    console.error('[DB] Failed to bulk update tile size:', error.message);
    throw new Error('Failed to bulk update tile size');
  }
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
  const sb = getSupabaseAdmin();
  const snakeData = experienceToSnake(input);
  const { data, error } = await sb
    .from("experiences")
    .insert(snakeData)
    .select()
    .single();
  if (error) { console.error('[DB] Failed to create experience:', error.message); throw new Error('Failed to create experience'); }
  return experienceToCamel(data as Experience);
}

export async function updateExperience(
  id: number,
  input: Record<string, any>
) {
  const sb = getSupabaseAdmin();
  const snakeData = experienceToSnake(input);
  const { data, error } = await sb
    .from("experiences")
    .update(snakeData)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error('[DB] Failed to update experience:', error.message); throw new Error('Failed to update experience'); }
  return experienceToCamel(data as Experience);
}

export async function deleteExperience(id: number) {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("experiences").delete().eq("id", id);
  if (error) { console.error('[DB] Failed to delete experience:', error.message); throw new Error('Failed to delete experience'); }
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
  const sb = getSupabaseAdmin();
  const snakeData = skillCategoryToSnake(input);
  const { data, error } = await sb
    .from("skill_categories")
    .insert(snakeData)
    .select()
    .single();
  if (error) { console.error('[DB] Failed to create skill category:', error.message); throw new Error('Failed to create skill category'); }
  return skillCategoryToCamel(data as SkillCategory);
}

export async function updateSkillCategory(
  id: number,
  input: Record<string, any>
) {
  const sb = getSupabaseAdmin();
  const snakeData = skillCategoryToSnake(input);
  const { data, error } = await sb
    .from("skill_categories")
    .update(snakeData)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error('[DB] Failed to update skill category:', error.message); throw new Error('Failed to update skill category'); }
  return skillCategoryToCamel(data as SkillCategory);
}

export async function deleteSkillCategory(id: number) {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("skill_categories").delete().eq("id", id);
  if (error) { console.error('[DB] Failed to delete skill category:', error.message); throw new Error('Failed to delete skill category'); }
}

// ==========================================
// EDUCATION (Supabase)
// ==========================================

export interface Education {
  id: number;
  user_id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_year: number;
  end_year: number | null;
  description: string | null;
  logo_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function educationToCamel(row: Education) {
  return {
    id: row.id,
    userId: row.user_id,
    institution: row.institution,
    degree: row.degree,
    fieldOfStudy: row.field_of_study,
    startYear: row.start_year,
    endYear: row.end_year,
    description: row.description,
    logoUrl: row.logo_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function educationToSnake(data: Record<string, any>) {
  const map: Record<string, string> = {
    institution: "institution",
    degree: "degree",
    fieldOfStudy: "field_of_study",
    startYear: "start_year",
    endYear: "end_year",
    description: "description",
    logoUrl: "logo_url",
    sortOrder: "sort_order",
  };
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "id" || key === "userId") continue;
    const snakeKey = map[key] || key;
    result[snakeKey] = value;
  }
  result.updated_at = new Date().toISOString();
  return result;
}

export async function getEducation() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as Education[]).map(educationToCamel);
}

export async function getEducationById(id: number) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("education")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return educationToCamel(data as Education);
}

export async function createEducation(input: Record<string, any>) {
  const sb = getSupabaseAdmin();
  const snakeData = educationToSnake(input);
  if (input.userId) snakeData.user_id = input.userId;
  const { data, error } = await sb
    .from("education")
    .insert(snakeData)
    .select()
    .single();
  if (error) { console.error('[DB] Failed to create education:', error.message); throw new Error('Failed to create education'); }
  return educationToCamel(data as Education);
}

export async function updateEducation(id: number, input: Record<string, any>) {
  const sb = getSupabaseAdmin();
  const snakeData = educationToSnake(input);
  const { data, error } = await sb
    .from("education")
    .update(snakeData)
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error('[DB] Failed to update education:', error.message); throw new Error('Failed to update education'); }
  return educationToCamel(data as Education);
}

export async function deleteEducation(id: number) {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("education").delete().eq("id", id);
  if (error) { console.error('[DB] Failed to delete education:', error.message); throw new Error('Failed to delete education'); }
}

// ==========================================
// THEME SETTINGS (Supabase)
// ==========================================

export interface ThemeSettings {
  id: number;
  accent_color: string;
  accent_color_hover: string;
  heading_font: string;
  body_font: string;
  dark_mode: boolean;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_THEME: Omit<ThemeSettings, 'id' | 'created_at' | 'updated_at'> = {
  accent_color: '#B85C38',
  accent_color_hover: '#9A4A2E',
  heading_font: 'DM Serif Display',
  body_font: 'DM Sans',
  dark_mode: false,
};

function themeSettingsToCamel(row: ThemeSettings) {
  return {
    id: row.id,
    accentColor: row.accent_color,
    accentColorHover: row.accent_color_hover,
    headingFont: row.heading_font,
    bodyFont: row.body_font,
    darkMode: row.dark_mode ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getThemeSettings() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('theme_settings')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    // Return defaults if no row exists
    return {
      id: 0,
      accentColor: DEFAULT_THEME.accent_color,
      accentColorHover: DEFAULT_THEME.accent_color_hover,
      headingFont: DEFAULT_THEME.heading_font,
      bodyFont: DEFAULT_THEME.body_font,
      darkMode: DEFAULT_THEME.dark_mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return themeSettingsToCamel(data as ThemeSettings);
}

export async function updateThemeSettings(input: {
  accentColor?: string;
  accentColorHover?: string;
  headingFont?: string;
  bodyFont?: string;
  darkMode?: boolean;
}) {
  const sb = getSupabaseAdmin();
  const snakeData: Record<string, any> = {};
  if (input.accentColor !== undefined) snakeData.accent_color = input.accentColor;
  if (input.accentColorHover !== undefined) snakeData.accent_color_hover = input.accentColorHover;
  if (input.headingFont !== undefined) snakeData.heading_font = input.headingFont;
  if (input.bodyFont !== undefined) snakeData.body_font = input.bodyFont;
  if (input.darkMode !== undefined) snakeData.dark_mode = input.darkMode;
  snakeData.updated_at = new Date().toISOString();

  // Get existing row
  const existing = await getThemeSettings();
  if (existing.id === 0) {
    // No row exists, insert
    const { data, error } = await sb
      .from('theme_settings')
      .insert({
        accent_color: input.accentColor || DEFAULT_THEME.accent_color,
        accent_color_hover: input.accentColorHover || DEFAULT_THEME.accent_color_hover,
        heading_font: input.headingFont || DEFAULT_THEME.heading_font,
        body_font: input.bodyFont || DEFAULT_THEME.body_font,
        dark_mode: input.darkMode ?? DEFAULT_THEME.dark_mode,
      })
      .select()
      .single();
    if (error) { console.error('[DB] Failed to create theme settings:', error.message); throw new Error('Failed to create theme settings'); }
    return themeSettingsToCamel(data as ThemeSettings);
  } else {
    const { data, error } = await sb
      .from('theme_settings')
      .update(snakeData)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) { console.error('[DB] Failed to update theme settings:', error.message); throw new Error('Failed to update theme settings'); }
    return themeSettingsToCamel(data as ThemeSettings);
  }
}

export async function resetThemeSettings() {
  return updateThemeSettings({
    accentColor: DEFAULT_THEME.accent_color,
    accentColorHover: DEFAULT_THEME.accent_color_hover,
    headingFont: DEFAULT_THEME.heading_font,
    bodyFont: DEFAULT_THEME.body_font,
    darkMode: DEFAULT_THEME.dark_mode,
  });
}

// ==========================================
// PROJECT ANALYTICS (Supabase)
// ==========================================

export interface ProjectAnalytics {
  id: number;
  project_id: number;
  event_type: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

/** Track a project click/view event */
export async function trackProjectEvent(input: {
  projectId: number;
  eventType: string;
  referrer?: string;
  userAgent?: string;
}) {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from("project_analytics").insert({
    project_id: input.projectId,
    event_type: input.eventType,
    referrer: input.referrer || null,
    user_agent: input.userAgent || null,
  });
  if (error) {
    console.error('[DB] Failed to track project event:', error.message);
    // Don't throw — analytics should never break the user experience
  }
}

/** Get analytics summary for all projects (admin) */
export async function getProjectAnalyticsSummary() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("project_analytics")
    .select("project_id, event_type, created_at");

  if (error || !data) return [];

  // Aggregate by project_id
  const summary: Record<number, { projectId: number; clicks: number; views: number; lastEvent: string }> = {};
  for (const row of data) {
    if (!summary[row.project_id]) {
      summary[row.project_id] = { projectId: row.project_id, clicks: 0, views: 0, lastEvent: row.created_at };
    }
    if (row.event_type === 'click') summary[row.project_id].clicks++;
    else if (row.event_type === 'view') summary[row.project_id].views++;
    if (row.created_at > summary[row.project_id].lastEvent) {
      summary[row.project_id].lastEvent = row.created_at;
    }
  }
  return Object.values(summary);
}

/** Get analytics for a specific project with time series data */
export async function getProjectAnalyticsDetail(projectId: number) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("project_analytics")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error || !data) return { events: [], totalClicks: 0, totalViews: 0 };

  let totalClicks = 0;
  let totalViews = 0;
  for (const row of data) {
    if (row.event_type === 'click') totalClicks++;
    else if (row.event_type === 'view') totalViews++;
  }

  return {
    events: data.map((row: ProjectAnalytics) => ({
      id: row.id,
      projectId: row.project_id,
      eventType: row.event_type,
      referrer: row.referrer,
      userAgent: row.user_agent,
      createdAt: row.created_at,
    })),
    totalClicks,
    totalViews,
  };
}

// ==========================================
// FULL PORTFOLIO (public endpoint)
// ==========================================

export async function getFullPortfolio() {
  const [profileData, projectsData, experiencesData, skillsData, educationData] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getExperiences(),
      getSkillCategories(),
      getEducation(),
    ]);

  return {
    profile: profileData,
    projects: projectsData,
    experiences: experiencesData,
    skills: skillsData,
    education: educationData,
  };
}
