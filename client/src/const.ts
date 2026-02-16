export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate GitHub OAuth login URL.
// The server handles the redirect to GitHub and the callback.
export const getLoginUrl = (returnPath?: string) => {
  const path = returnPath || "/";
  return `/api/auth/github?returnPath=${encodeURIComponent(path)}`;
};
