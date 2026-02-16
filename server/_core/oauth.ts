import { COOKIE_NAME } from "@shared/const";
import type { Express, Request, Response } from "express";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import axios from "axios";

const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days (was 1 year)

/**
 * Validate that a return path is safe (relative, no protocol-relative URLs).
 * Prevents open redirect attacks.
 */
function sanitizeReturnPath(path: string): string {
  if (!path || typeof path !== "string") return "/";
  // Must start with / and not be protocol-relative (//)
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  // Block javascript: and data: schemes that could appear after decoding
  const decoded = decodeURIComponent(path).toLowerCase();
  if (decoded.includes("javascript:") || decoded.includes("data:")) return "/";
  // Block backslash-based bypasses (\\evil.com)
  if (path.includes("\\")) return "/";
  return path;
}

function getGitHubClientId(): string {
  return process.env.GITHUB_CLIENT_ID || "";
}

function getGitHubClientSecret(): string {
  return process.env.GITHUB_CLIENT_SECRET || "";
}

export function registerOAuthRoutes(app: Express) {
  // Step 1: Redirect user to GitHub for authorization
  app.get("/api/auth/github", (req: Request, res: Response) => {
    const clientId = getGitHubClientId();
    if (!clientId) {
      res.status(500).json({ error: "GITHUB_CLIENT_ID not configured" });
      return;
    }

    // Build the callback URL from the request origin
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const callbackUrl = `${protocol}://${host}/api/auth/github/callback`;

    // Store the return path in state (sanitized to prevent open redirect)
    const returnPath = sanitizeReturnPath((req.query.returnPath as string) || "/");
    const state = Buffer.from(JSON.stringify({ returnPath, callbackUrl })).toString("base64url");

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=read:user%20user:email&state=${state}`;

    res.redirect(302, githubAuthUrl);
  });

  // Step 2: Handle GitHub callback
  app.get("/api/auth/github/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code) {
      res.status(400).json({ error: "Authorization code is required" });
      return;
    }

    let returnPath = "/";
    try {
      if (state) {
        const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
        returnPath = sanitizeReturnPath(decoded.returnPath || "/");
      }
    } catch {
      // ignore state parse errors — default to safe "/"
    }

    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: getGitHubClientId(),
          client_secret: getGitHubClientSecret(),
          code,
        },
        {
          headers: { Accept: "application/json" },
          timeout: 10000,
        }
      );

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        console.error("[GitHub OAuth] No access token received:", tokenResponse.data);
        res.status(400).json({ error: "Failed to get access token from GitHub" });
        return;
      }

      // Get user info from GitHub
      const [userResponse, emailsResponse] = await Promise.all([
        axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
          timeout: 10000,
        }),
        axios.get("https://api.github.com/user/emails", {
          headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
          timeout: 10000,
        }),
      ]);

      const githubUser = userResponse.data;
      const emails = emailsResponse.data as Array<{ email: string; primary: boolean; verified: boolean }>;
      const primaryEmail = emails.find((e) => e.primary && e.verified)?.email || emails.find((e) => e.verified)?.email || githubUser.email;

      // Upsert user in Supabase
      const user = await sdk.upsertGitHubUser({
        githubId: String(githubUser.id),
        githubUsername: githubUser.login,
        name: githubUser.name || githubUser.login,
        email: primaryEmail || null,
        avatarUrl: githubUser.avatar_url || null,
      });

      // Create session token
      const sessionToken = await sdk.createSessionToken(String(githubUser.id), {
        name: user.name || githubUser.login,
        expiresInMs: SESSION_MAX_AGE_MS,
      });

      // Set cookie and redirect
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: SESSION_MAX_AGE_MS });

      res.redirect(302, returnPath);
    } catch (error: any) {
      console.error("[GitHub OAuth] Callback failed:", error?.response?.data || error.message);
      res.status(500).json({ error: "GitHub OAuth callback failed" });
    }
  });

  // Keep the old Manus callback for backward compat (will just redirect to home)
  app.get("/api/oauth/callback", (_req: Request, res: Response) => {
    res.redirect(302, "/");
  });
}
