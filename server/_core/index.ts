import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { storagePut } from "../storage";
import { sdk } from "./sdk";
import { ENV } from "./env";
import cookieLib from "cookie";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Trust proxy (behind reverse proxy in production)
  app.set('trust proxy', 1);

  // ==========================================
  // SECURITY: Helmet sets secure HTTP headers
  // ==========================================
  app.use(
    helmet({
      contentSecurityPolicy: false, // CSP handled separately or by CDN
      crossOriginEmbedderPolicy: false, // Allow embedding external resources
      crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resource loading
    })
  );

  // ==========================================
  // SECURITY: Rate limiting
  // ==========================================
  // General API rate limit: 200 requests per 15 minutes per IP
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  });

  // Stricter rate limit for OAuth: 20 requests per 15 minutes per IP
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many authentication attempts, please try again later." },
  });

  // Apply rate limiters
  app.use("/api/trpc", apiLimiter);
  app.use("/api/auth", authLimiter);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/auth/*
  registerOAuthRoutes(app);

  // ==========================================
  // ADMIN: Image upload endpoint
  // ==========================================
  app.post("/api/upload", async (req, res) => {
    try {
      // Verify admin auth via JWT cookie
      let user;
      try {
        user = await sdk.authenticateRequest(req as any);
      } catch {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      if (!user || user.openId !== ENV.ownerOpenId) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const { fileData, fileName, contentType } = req.body;
      if (!fileData || !fileName || !contentType) {
        res.status(400).json({ error: "Missing fileData, fileName, or contentType" });
        return;
      }

      // Validate content type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
      if (!allowedTypes.includes(contentType)) {
        res.status(400).json({ error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG" });
        return;
      }

      // Validate file size (base64 is ~33% larger than binary, so 10MB base64 ≈ 7.5MB file)
      const maxBase64Size = 10 * 1024 * 1024; // 10MB base64
      if (fileData.length > maxBase64Size) {
        res.status(400).json({ error: "File too large. Maximum 7.5MB." });
        return;
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(fileData, "base64");

      // Generate unique file key
      const ext = fileName.split(".").pop() || "png";
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      const fileKey = `portfolio/images/${Date.now()}-${randomSuffix}.${ext}`;

      // Upload to S3
      const { url } = await storagePut(fileKey, buffer, contentType);

      res.json({ url, key: fileKey });
    } catch (error) {
      console.error("[Upload] Failed:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
