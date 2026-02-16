import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Profile: stores the main portfolio owner info (single row).
 */
export const profile = mysqlTable("profile", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 200 }).notNull().default("Alex Chen"),
  title: varchar("title", { length: 300 }).notNull().default("Full-stack Software Engineer"),
  bio: text("bio"),
  heroTagline: varchar("heroTagline", { length: 500 }).notNull().default("Crafting digital experiences with purpose."),
  heroSubtitle: text("heroSubtitle"),
  avatarUrl: text("avatarUrl"),
  resumeUrl: text("resumeUrl"),
  githubUrl: varchar("githubUrl", { length: 500 }).default(""),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }).default(""),
  twitterUrl: varchar("twitterUrl", { length: 500 }).default(""),
  email: varchar("profileEmail", { length: 320 }).default(""),
  phone: varchar("phone", { length: 50 }).default(""),
  location: varchar("location", { length: 200 }).default(""),
  yearsExperience: varchar("yearsExperience", { length: 20 }).default("5+"),
  projectsDelivered: varchar("projectsDelivered", { length: 20 }).default("30+"),
  openSourceContributions: varchar("openSourceContributions", { length: 20 }).default("15+"),
  clientSatisfaction: varchar("clientSatisfaction", { length: 20 }).default("99%"),
  availableForWork: int("availableForWork").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profile.$inferSelect;
export type InsertProfile = typeof profile.$inferInsert;

/**
 * Projects: portfolio project entries.
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  liveUrl: varchar("liveUrl", { length: 500 }).default(""),
  githubUrl: varchar("githubUrl", { length: 500 }).default(""),
  tags: text("tags"), // JSON array stored as text
  featured: int("featured").default(0).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Experiences: work experience entries.
 */
export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  role: varchar("role", { length: 300 }).notNull(),
  company: varchar("company", { length: 300 }).notNull(),
  period: varchar("period", { length: 100 }).notNull(),
  description: text("description"),
  tags: text("tags"), // JSON array stored as text
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

/**
 * Skill categories with their skills.
 */
export const skillCategories = mysqlTable("skillCategories", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull().default("Code2"),
  skills: text("skills"), // JSON array stored as text
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SkillCategory = typeof skillCategories.$inferSelect;
export type InsertSkillCategory = typeof skillCategories.$inferInsert;
