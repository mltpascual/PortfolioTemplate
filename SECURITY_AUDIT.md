# Security Audit Report — Portfolio Application

**Date:** February 16, 2026  
**Auditor:** Manus AI  
**Scope:** Full-stack portfolio application (React + Express + tRPC + Supabase)  
**Deployment:** Vercel (mltpascuall.vercel.app)

---

## Executive Summary

This report documents a comprehensive security audit of the portfolio web application, covering the Express/tRPC backend, React frontend, Supabase database layer, GitHub OAuth authentication flow, and deployment configuration. The audit identified **12 vulnerabilities** across 4 severity levels. The most critical findings involve an **open redirect vulnerability** in the OAuth callback, **missing input validation** on admin API endpoints, and **absent security headers** across all responses.

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | 2 | Open redirect, missing input sanitization on URL fields |
| **High** | 3 | No rate limiting, missing security headers, overly permissive RLS policies |
| **Medium** | 4 | CSS injection via theme fonts, no CSRF protection, JWT expiry too long, contact form is non-functional |
| **Low** | 3 | Unused markdown files with internal notes, error message leakage, missing Content-Security-Policy |

---

## Vulnerability Details

### CRITICAL-01: Open Redirect in OAuth Callback

**File:** `server/_core/oauth.ts` (lines 50–54, 117)  
**Severity:** Critical  
**CVSS:** 7.4

The `returnPath` parameter extracted from the OAuth state is used directly in a `res.redirect(302, returnPath)` call without any validation. An attacker can craft a malicious OAuth state containing an absolute URL (e.g., `https://evil.com/phish`) and trick users into being redirected to a phishing site after successful GitHub authentication.

```typescript
// VULNERABLE CODE (line 117):
res.redirect(302, returnPath);
// returnPath comes from user-controlled state parameter with no validation
```

**Impact:** An attacker can redirect authenticated users to a malicious site that mimics the portfolio login, potentially stealing session cookies or credentials.

**Fix:** Validate that `returnPath` is a relative path starting with `/` and does not contain protocol-relative URLs (`//`).

---

### CRITICAL-02: Missing Input Validation on URL Fields

**File:** `server/routers.ts` (lines 46–88, 106–115)  
**Severity:** Critical  
**CVSS:** 6.8

All URL fields in the admin API endpoints (`avatarUrl`, `resumeUrl`, `githubUrl`, `linkedinUrl`, `liveUrl`, `imageUrl`) accept arbitrary strings via `z.string().optional()` without URL format validation. This enables:

1. **Stored XSS via `javascript:` URLs** — An admin could set `resumeUrl` to `javascript:alert(document.cookie)`, which would execute when visitors click the Resume link.
2. **Iframe injection** — The `liveUrl` field is rendered directly into an `<iframe src={liveUrl}>` element in `ProjectsSection.tsx`, allowing embedding of arbitrary pages.
3. **Data exfiltration** — Setting `avatarUrl` to a tracking pixel URL could log visitor IP addresses.

```typescript
// NO URL VALIDATION:
avatarUrl: z.string().optional(),  // Should be z.string().url().optional()
resumeUrl: z.string().optional(),  // Should validate https:// protocol
liveUrl: z.string().optional(),    // Rendered in iframe src
```

**Impact:** Stored XSS affecting all portfolio visitors, potential data exfiltration through tracking URLs.

**Fix:** Add `.url()` validation to all URL fields and restrict to `https://` protocol. Add `javascript:` and `data:` protocol blocking on the frontend.

---

### HIGH-01: No Rate Limiting on API Endpoints

**File:** `server/_core/index.ts`, `server/vercel-entry.ts`  
**Severity:** High  
**CVSS:** 5.3

The Express server has no rate limiting middleware configured. All endpoints, including the OAuth flow and admin mutation endpoints, can be called unlimited times. This exposes the application to:

1. **Brute-force attacks** on the authentication flow
2. **Denial of Service (DoS)** via rapid API calls
3. **Database resource exhaustion** through mass create/delete operations

**Impact:** An attacker can overwhelm the Supabase database with thousands of requests per second, or abuse the OAuth flow to enumerate valid GitHub accounts.

**Fix:** Add `express-rate-limit` middleware with appropriate limits (e.g., 100 requests/15min for API, 10 requests/15min for OAuth).

---

### HIGH-02: Missing Security Headers

**File:** `server/_core/index.ts`, `server/vercel-entry.ts`  
**Severity:** High  
**CVSS:** 5.0

The Express server does not set any security headers. The following critical headers are absent:

| Header | Purpose | Status |
|--------|---------|--------|
| `Content-Security-Policy` | Prevents XSS and data injection | Missing |
| `X-Content-Type-Options` | Prevents MIME sniffing | Missing |
| `X-Frame-Options` | Prevents clickjacking | Missing |
| `Strict-Transport-Security` | Enforces HTTPS | Missing |
| `X-XSS-Protection` | Legacy XSS filter | Missing |
| `Referrer-Policy` | Controls referrer information | Missing |
| `Permissions-Policy` | Restricts browser features | Missing |

**Impact:** The application is vulnerable to clickjacking, MIME-type confusion attacks, and has no Content Security Policy to mitigate XSS.

**Fix:** Add `helmet` middleware or manually set security headers.

---

### HIGH-03: Overly Permissive RLS Policies on Write Operations

**File:** `scripts/supabase-schema.sql` (lines 80–94)  
**Severity:** High  
**CVSS:** 5.5

The Supabase RLS policies for INSERT, UPDATE, and DELETE operations use `USING (true)` and `WITH CHECK (true)`, meaning **any authenticated Supabase user** (not just the service role) can modify data. While the application uses the service role key for writes, if the anon key were ever used for a write operation (e.g., through a bug or misconfiguration), any user could modify portfolio data.

Additionally, the `app_users` and `theme_settings` tables were created outside the migration script and may lack RLS entirely, exposing them to direct manipulation via the Supabase anon key.

```sql
-- OVERLY PERMISSIVE:
CREATE POLICY "Allow service insert on profile" ON profile FOR INSERT WITH CHECK (true);
-- Should restrict to service_role only
```

**Impact:** If the anon key is compromised or misused, an attacker could modify all portfolio content, user records, and theme settings.

**Fix:** Add role-based checks to RLS policies: `WITH CHECK (auth.role() = 'service_role')`. Ensure `app_users` and `theme_settings` tables have RLS enabled.

---

### MEDIUM-01: CSS Injection via Theme Font Names

**File:** `client/src/hooks/useThemeSettings.ts` (lines 162–164)  
**Severity:** Medium  
**CVSS:** 4.3

The theme settings allow arbitrary font names that are injected directly into CSS custom properties and Google Fonts URLs without sanitization:

```typescript
root.style.setProperty("--t-font-display", `'${theme.headingFont}', Georgia, serif`);
// If headingFont = "'; background: url('https://evil.com/track') '"
// This becomes valid CSS injection
```

Additionally, the font name is used to construct Google Fonts URLs via `encodeURIComponent`, but the CSS value itself is not validated against an allowlist.

**Impact:** An admin could inject arbitrary CSS through font names, potentially altering the page appearance or loading external resources.

**Fix:** Validate font names against the predefined `AVAILABLE_FONTS` allowlist on the server side before storing.

---

### MEDIUM-02: No CSRF Protection on State-Changing Operations

**File:** `server/_core/oauth.ts`, `server/routers.ts`  
**Severity:** Medium  
**CVSS:** 4.3

The application uses `SameSite=None` cookies (in `cookies.ts` line 45), which means the session cookie is sent with cross-origin requests. Combined with no CSRF token validation, an attacker could craft a malicious page that makes authenticated requests to the admin API on behalf of a logged-in admin.

```typescript
// cookies.ts line 45:
sameSite: "none",  // Should be "lax" for CSRF protection
```

**Impact:** An attacker could trick an admin into visiting a page that silently modifies portfolio content, deletes projects, or changes theme settings.

**Fix:** Change `sameSite` to `"lax"` (or `"strict"`) and add CSRF token validation for mutation endpoints.

---

### MEDIUM-03: JWT Session Token Expiry Too Long (1 Year)

**File:** `server/_core/sdk.ts` (line 96), `server/_core/oauth.ts` (line 7)  
**Severity:** Medium  
**CVSS:** 3.7

Session tokens are issued with a 1-year expiry (`365 * 24 * 60 * 60 * 1000`). If a session token is compromised (e.g., via XSS or cookie theft), the attacker has a full year to use it. There is no token rotation or revocation mechanism.

**Impact:** Compromised session tokens remain valid for an extended period with no way to invalidate them.

**Fix:** Reduce token expiry to 7–30 days and implement token rotation on each request. Add a token revocation mechanism (e.g., a blocklist in the database).

---

### MEDIUM-04: Contact Form is Non-Functional (Fake Submit)

**File:** `client/src/components/ContactSection.tsx` (lines 30–33)  
**Severity:** Medium (Functional/Trust)  
**CVSS:** N/A

The contact form shows a success toast message without actually sending any data to the backend. This is misleading to visitors who believe their message was sent.

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  toast.success("Message sent! I'll get back to you soon.");
  // No actual API call — data is discarded
};
```

**Impact:** Visitors' messages are silently discarded, damaging trust and potentially losing business opportunities.

**Fix:** Either implement a backend endpoint to handle contact form submissions (e.g., email notification via `notifyOwner`) or clearly indicate that the form is a placeholder.

---

### LOW-01: Internal Notes Committed to Repository

**File:** `ideas.md`, `image-urls.md`, `notes-supabase-mcp.md`, `observations-github-oauth.md`, `observations-perf.md`, `observations-rls.md`, `observations.md`  
**Severity:** Low  
**CVSS:** 2.0

Seven markdown files containing internal development notes, implementation observations, and debugging information are committed to the repository. These files may reveal:

1. Internal architecture decisions and known limitations
2. Database schema details and RLS policy discussions
3. Performance observations that could guide targeted attacks

**Impact:** Information disclosure that could aid an attacker in understanding the application's internals.

**Fix:** Remove these files from the repository and add them to `.gitignore`.

---

### LOW-02: Supabase Error Messages Leaked to Client

**File:** `server/db.ts` (lines 303, 351, 371, etc.)  
**Severity:** Low  
**CVSS:** 2.5

Database error messages from Supabase are thrown directly as `new Error(error.message)` and propagated through tRPC to the client. These messages may contain table names, column names, constraint names, or other database internals.

```typescript
if (error) throw new Error(`Failed to update profile: ${error.message}`);
// error.message might contain: "duplicate key value violates unique constraint..."
```

**Impact:** Database schema information leakage that could aid SQL injection or other attacks.

**Fix:** Log the full error server-side and return generic error messages to the client.

---

### LOW-03: Missing Subresource Integrity on External Scripts

**File:** `client/index.html`  
**Severity:** Low  
**CVSS:** 2.0

Google Fonts are loaded dynamically without Subresource Integrity (SRI) hashes. If the Google Fonts CDN were compromised, malicious CSS could be injected into the page.

**Impact:** Supply chain attack vector through compromised CDN resources.

**Fix:** Consider self-hosting fonts or adding SRI hashes to external resource links.

---

## Recommendations Summary

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Fix open redirect in OAuth callback | Low |
| 2 | Add URL validation to all URL input fields | Low |
| 3 | Add security headers (helmet) | Low |
| 4 | Change SameSite cookie to "lax" | Low |
| 5 | Add rate limiting middleware | Medium |
| 6 | Validate font names against allowlist | Low |
| 7 | Tighten RLS policies to service_role only | Medium |
| 8 | Reduce JWT expiry and add rotation | Medium |
| 9 | Sanitize error messages before sending to client | Low |
| 10 | Remove internal markdown files | Low |
| 11 | Implement or remove contact form | Medium |
| 12 | Add Content-Security-Policy header | Medium |

---

## Scope Exclusions

The following areas were **not** in scope for this audit:

- Supabase platform security (managed by Supabase)
- Vercel deployment infrastructure security
- GitHub OAuth provider security
- Third-party npm package vulnerabilities (recommend running `pnpm audit`)
- Browser-specific security features

---

*End of Security Audit Report*
