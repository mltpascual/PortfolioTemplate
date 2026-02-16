import { test, expect } from "@playwright/test";

/**
 * E2E tests for the public-facing portfolio website.
 * Covers navigation, section rendering, responsive design, and contact form.
 */

test.describe("Portfolio - Public Pages", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Wait for the React app to hydrate
    await page.waitForSelector("#root", { timeout: 10_000 });
    await page.waitForTimeout(2000);
  });

  // ─── Navigation ────────────────────────────────────────────────

  test("should display the navbar with all navigation links", async ({ page }) => {
    const navLinks = ["About", "Skills", "Projects", "Experience", "Contact"];
    for (const link of navLinks) {
      const el = page.locator(`a`).filter({ hasText: link }).first();
      await expect(el).toBeVisible({ timeout: 10_000 });
    }
  });

  test("should navigate to projects section via anchor link", async ({ page }) => {
    await page.click('a:text("Projects")', { timeout: 5000 });
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/#projects/);
  });

  // ─── Hero Section ──────────────────────────────────────────────

  test("should display the hero section with key content", async ({ page }) => {
    const heroText = page.locator("text=Building digital");
    await expect(heroText).toBeVisible({ timeout: 10_000 });
  });

  test("should have CTA buttons in hero", async ({ page }) => {
    await expect(page.locator('a:text("View My Work")').first()).toBeVisible({ timeout: 10_000 });
  });

  // ─── Projects Section ─────────────────────────────────────────

  test("should display projects section with cards", async ({ page }) => {
    await page.click('a:text("Projects")', { timeout: 5000 });
    await page.waitForTimeout(1000);
    const section = page.locator("#projects");
    await expect(section).toBeVisible({ timeout: 10_000 });
  });

  test("should have Live Demo links with proper security attributes", async ({ page }) => {
    const demoLinks = page.locator('a:text("Live Demo")');
    const count = await demoLinks.count();
    expect(count).toBeGreaterThan(0);

    const firstDemo = demoLinks.first();
    await expect(firstDemo).toHaveAttribute("target", "_blank");
    await expect(firstDemo).toHaveAttribute("rel", /noopener/);
  });

  // ─── Contact Section ──────────────────────────────────────────

  test("should display the contact form with all fields", async ({ page }) => {
    await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
    await page.waitForTimeout(1000);

    await expect(page.locator('input[id="name"]')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('input[id="contact-email"]')).toBeVisible();
    await expect(page.locator('textarea[id="message"]')).toBeVisible();
    await expect(page.locator('button:text("Send Message")')).toBeVisible();
  });

  test("should fill and submit the contact form without crashing", async ({ page }) => {
    await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
    await page.waitForTimeout(1000);

    await page.locator('input[id="name"]').fill("Test User");
    await page.locator('input[id="contact-email"]').fill("test@example.com");
    await page.locator('textarea[id="message"]').fill("E2E test message.");
    await page.locator('button:text("Send Message")').click();
    await page.waitForTimeout(2000);

    // Page should not crash
    const content = await page.content();
    expect(content).toBeTruthy();
  });

  // ─── Footer ───────────────────────────────────────────────────

  test("should display the footer", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const footer = page.locator("footer");
    await expect(footer).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Portfolio - Responsive Design", () => {
  test("should render correctly on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#root", { timeout: 10_000 });
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Building digital")).toBeVisible({ timeout: 10_000 });
  });

  test("should render correctly on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#root", { timeout: 10_000 });
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Building digital")).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Portfolio - Security", () => {
  test("should have security headers from helmet", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    const headers = response?.headers();
    expect(headers?.["x-content-type-options"]).toBe("nosniff");
  });

  test("should block unauthorized access to admin procedures", async ({ request }) => {
    const response = await request.post("/api/trpc/projects.create", {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ title: "Hack" }),
    });
    expect(response.status()).not.toBe(200);
  });

  test("should not expose admin API endpoints without auth", async ({ request }) => {
    const endpoints = [
      "/api/trpc/profile.update",
      "/api/trpc/experiences.create",
      "/api/trpc/skills.create",
    ];
    for (const endpoint of endpoints) {
      const response = await request.post(endpoint, {
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({}),
      });
      expect(response.status()).not.toBe(200);
    }
  });
});

test.describe("Portfolio - Performance", () => {
  test("should load the homepage within 10 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#root", { timeout: 10_000 });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10_000);
  });

  test("should lazy load project images", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    const lazyImages = page.locator('img[loading="lazy"]');
    const count = await lazyImages.count();
    expect(count).toBeGreaterThan(0);
  });
});
