import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

export type ThemeSettingsData = {
  id: number;
  accentColor: string;
  accentColorHover: string;
  headingFont: string;
  bodyFont: string;
  createdAt: string;
  updatedAt: string;
};

// Default theme values matching the original design
export const DEFAULT_THEME = {
  accentColor: "#B85C38",
  accentColorHover: "#9A4A2E",
  headingFont: "DM Serif Display",
  bodyFont: "DM Sans",
};

// Curated font list for the selector
export const AVAILABLE_FONTS = {
  heading: [
    "DM Serif Display",
    "Playfair Display",
    "Lora",
    "Merriweather",
    "Cormorant Garamond",
    "Libre Baskerville",
    "EB Garamond",
    "Crimson Text",
    "Bitter",
    "Josefin Sans",
    "Montserrat",
    "Raleway",
    "Poppins",
    "Inter",
    "Space Grotesk",
  ],
  body: [
    "DM Sans",
    "Inter",
    "Poppins",
    "Nunito",
    "Open Sans",
    "Lato",
    "Source Sans 3",
    "Roboto",
    "Work Sans",
    "Outfit",
    "Plus Jakarta Sans",
    "Manrope",
    "Figtree",
    "Geist",
    "IBM Plex Sans",
  ],
};

/**
 * Converts a hex color to an OKLCH approximation string.
 * This is a simplified conversion that works well enough for CSS variables.
 */
function hexToOklchApprox(hex: string): string {
  // Remove # prefix
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;

  // Convert to linear RGB
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  // Convert to OKLab
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_cbrt = Math.cbrt(l_);
  const m_cbrt = Math.cbrt(m_);
  const s_cbrt = Math.cbrt(s_);

  const L = 0.2104542553 * l_cbrt + 0.793617785 * m_cbrt - 0.0040720468 * s_cbrt;
  const a = 1.9779984951 * l_cbrt - 2.428592205 * m_cbrt + 0.4505937099 * s_cbrt;
  const bVal = 0.0259040371 * l_cbrt + 0.7827717662 * m_cbrt - 0.808675766 * s_cbrt;

  const C = Math.sqrt(a * a + bVal * bVal);
  let H = (Math.atan2(bVal, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

/**
 * Generates a darker version of a hex color for hover states.
 */
function darkenHex(hex: string, amount: number = 0.15): string {
  const h = hex.replace("#", "");
  let r = parseInt(h.substring(0, 2), 16);
  let g = parseInt(h.substring(2, 4), 16);
  let b = parseInt(h.substring(4, 6), 16);

  r = Math.max(0, Math.round(r * (1 - amount)));
  g = Math.max(0, Math.round(g * (1 - amount)));
  b = Math.max(0, Math.round(b * (1 - amount)));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Load Google Fonts dynamically
 */
function loadGoogleFont(fontName: string) {
  const encodedFont = encodeURIComponent(fontName);
  const linkId = `google-font-${encodedFont}`;

  // Don't add if already loaded
  if (document.getElementById(linkId)) return;

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodedFont.replace(/%20/g, "+")}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/**
 * Apply theme settings to CSS custom properties on the document root.
 */
function applyThemeToDOM(theme: {
  accentColor: string;
  accentColorHover: string;
  headingFont: string;
  bodyFont: string;
}) {
  const root = document.documentElement;

  // Load fonts
  loadGoogleFont(theme.headingFont);
  loadGoogleFont(theme.bodyFont);

  // Set font CSS variables
  root.style.setProperty("--font-display", `'${theme.headingFont}', Georgia, serif`);
  root.style.setProperty("--font-body", `'${theme.bodyFont}', system-ui, sans-serif`);

  // Convert accent color to OKLCH for CSS variables
  const accentOklch = hexToOklchApprox(theme.accentColor);
  const hoverOklch = hexToOklchApprox(theme.accentColorHover);

  // Update terracotta-related CSS variables
  root.style.setProperty("--color-terracotta", accentOklch);
  root.style.setProperty("--color-terracotta-light", hexToOklchApprox(lightenHex(theme.accentColor, 0.15)));
  root.style.setProperty("--color-terracotta-dark", hoverOklch);

  // Update primary/ring colors
  root.style.setProperty("--primary", accentOklch);
  root.style.setProperty("--ring", accentOklch);
  root.style.setProperty("--sidebar-primary", hoverOklch);
  root.style.setProperty("--sidebar-ring", accentOklch);

  // Update pill button colors via CSS custom properties
  root.style.setProperty("--accent-hex", theme.accentColor);
  root.style.setProperty("--accent-hover-hex", theme.accentColorHover);
}

/**
 * Generates a lighter version of a hex color.
 */
function lightenHex(hex: string, amount: number = 0.15): string {
  const h = hex.replace("#", "");
  let r = parseInt(h.substring(0, 2), 16);
  let g = parseInt(h.substring(2, 4), 16);
  let b = parseInt(h.substring(4, 6), 16);

  r = Math.min(255, Math.round(r + (255 - r) * amount));
  g = Math.min(255, Math.round(g + (255 - g) * amount));
  b = Math.min(255, Math.round(b + (255 - b) * amount));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Hook to fetch and apply theme settings from the database.
 * Used in the main App layout to dynamically theme the portfolio.
 */
export function useThemeSettings() {
  const { data, isLoading, error } = trpc.theme.get.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    if (data) {
      applyThemeToDOM({
        accentColor: data.accentColor || DEFAULT_THEME.accentColor,
        accentColorHover: data.accentColorHover || DEFAULT_THEME.accentColorHover,
        headingFont: data.headingFont || DEFAULT_THEME.headingFont,
        bodyFont: data.bodyFont || DEFAULT_THEME.bodyFont,
      });
    }
  }, [data]);

  return { theme: data, isLoading, error };
}

export { hexToOklchApprox, darkenHex, lightenHex, applyThemeToDOM, loadGoogleFont };
