import { COOKIE_NAME } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  githubId: string;
  name: string;
};

// User type matching Supabase app_users table
export type AppUser = {
  id: number;
  github_id: string;
  github_username: string | null;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  last_signed_in: string;
};

// Normalized user type for the rest of the app
export type User = {
  id: number;
  openId: string; // github_id (kept as openId for backward compat with trpc context)
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
  avatarUrl?: string | null;
  githubUsername?: string | null;
};

function normalizeUser(row: AppUser): User {
  return {
    id: row.id,
    openId: row.github_id,
    name: row.name,
    email: row.email,
    loginMethod: "github",
    role: row.role as "user" | "admin",
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    lastSignedIn: new Date(row.last_signed_in),
    avatarUrl: row.avatar_url,
    githubUsername: row.github_username,
  };
}

let _supabaseAdmin: SupabaseClient | null = null;

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

class SDKServer {
  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    if (!secret) throw new Error("JWT_SECRET must be set");
    return new TextEncoder().encode(secret);
  }

  async createSessionToken(
    githubId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? 30 * 24 * 60 * 60 * 1000; // 30 days default
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      githubId,
      name: options.name || "",
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<{ githubId: string; name: string } | null> {
    if (!cookieValue) return null;

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { githubId, name } = payload as Record<string, unknown>;

      // Support both new (githubId) and legacy (openId) tokens
      const id = githubId || (payload as any).openId;
      const userName = name || (payload as any).name;

      if (!isNonEmptyString(id)) {
        console.warn("[Auth] Session payload missing githubId");
        return null;
      }

      return {
        githubId: id as string,
        name: (userName as string) || "",
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }

  async upsertGitHubUser(githubUser: {
    githubId: string;
    githubUsername: string;
    name: string | null;
    email: string | null;
    avatarUrl: string | null;
  }): Promise<User> {
    const sb = getSupabaseAdmin();
    const ownerGithubUsername = process.env.GITHUB_OWNER_USERNAME || "";

    // Check if user exists
    const { data: existing } = await sb
      .from("app_users")
      .select("*")
      .eq("github_id", githubUser.githubId)
      .single();

    const isOwner =
      ownerGithubUsername &&
      githubUser.githubUsername.toLowerCase() === ownerGithubUsername.toLowerCase();

    if (existing) {
      // Update existing user
      const { data, error } = await sb
        .from("app_users")
        .update({
          github_username: githubUser.githubUsername,
          name: githubUser.name,
          email: githubUser.email,
          avatar_url: githubUser.avatarUrl,
          role: isOwner ? "admin" : existing.role,
          last_signed_in: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("github_id", githubUser.githubId)
        .select()
        .single();

      if (error) throw new Error(`Failed to update user: ${error.message}`);
      return normalizeUser(data as AppUser);
    } else {
      // Create new user
      const { data, error } = await sb
        .from("app_users")
        .insert({
          github_id: githubUser.githubId,
          github_username: githubUser.githubUsername,
          name: githubUser.name,
          email: githubUser.email,
          avatar_url: githubUser.avatarUrl,
          role: isOwner ? "admin" : "user",
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create user: ${error.message}`);
      return normalizeUser(data as AppUser);
    }
  }

  async getUserByGitHubId(githubId: string): Promise<User | null> {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb
      .from("app_users")
      .select("*")
      .eq("github_id", githubId)
      .single();

    if (error || !data) return null;
    return normalizeUser(data as AppUser);
  }

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const user = await this.getUserByGitHubId(session.githubId);

    if (!user) {
      throw ForbiddenError("User not found");
    }

    return user;
  }
}

export const sdk = new SDKServer();
