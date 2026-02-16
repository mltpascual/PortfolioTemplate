import { trpc } from "@/lib/trpc";
import { useEffect, useState, useCallback } from "react";

export type ThemeSettingsData = {
  id: number;
  accentColor: string;
  accentColorHover: string;
  headingFont: string;
  bodyFont: string;
  darkMode: boolean;
  layoutMode: string;
  sectionOrder: string;
  hiddenSections: string;
  sectionTitles: string;
  createdAt: string;
  updatedAt: string;
};

// Default theme values matching the original design
export const DEFAULT_THEME = {
  accentColor: "#B85C38",
  accentColorHover: "#9A4A2E",
  headingFont: "DM Serif Display",
  bodyFont: "DM Sans",
  darkMode: false,
  layoutMode: "separate",
  sectionOrder: "hero,about,projects,skills,experience,education,contact",
  hiddenSections: "",
  sectionTitles: "{}",
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
 */
function hexToOklchApprox(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

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
 * Load Google Fonts dynamically
 */
function loadGoogleFont(fontName: string) {
  const encodedFont = encodeURIComponent(fontName);
  const linkId = `google-font-${encodedFont}`;

  if (document.getElementById(linkId)) return;

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodedFont.replace(/%20/g, "+")}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/**
 * Apply theme settings to CSS custom properties on the document root.
 * Supports both light and dark mode.
 */
function applyThemeToDOM(theme: {
  accentColor: string;
  accentColorHover: string;
  headingFont: string;
  bodyFont: string;
  darkMode?: boolean;
}) {
  const root = document.documentElement;
  const isDark = theme.darkMode ?? false;

  // Load fonts
  loadGoogleFont(theme.headingFont);
  loadGoogleFont(theme.bodyFont);

  // Set font CSS variables (--t-* tokens feed into @theme inline)
  root.style.setProperty("--t-font-display", `'${theme.headingFont}', Georgia, serif`);
  root.style.setProperty("--t-font-body", `'${theme.bodyFont}', system-ui, sans-serif`);

  // Convert accent color to OKLCH for CSS variables
  const accentOklch = hexToOklchApprox(theme.accentColor);
  const hoverOklch = hexToOklchApprox(theme.accentColorHover);

  // Update terracotta-related CSS variables (--t-* tokens feed into @theme inline)
  root.style.setProperty("--t-terracotta", accentOklch);
  root.style.setProperty("--t-terracotta-light", hexToOklchApprox(lightenHex(theme.accentColor, 0.15)));
  root.style.setProperty("--t-terracotta-dark", hoverOklch);

  // Update primary/ring colors
  root.style.setProperty("--primary", accentOklch);
  root.style.setProperty("--ring", accentOklch);
  root.style.setProperty("--sidebar-primary", hoverOklch);
  root.style.setProperty("--sidebar-ring", accentOklch);

  // Update pill button colors
  root.style.setProperty("--accent-hex", theme.accentColor);
  root.style.setProperty("--accent-hover-hex", theme.accentColorHover);

  // Apply dark/light mode
  if (isDark) {
    root.classList.add("portfolio-dark");
    // Dark mode CSS variables
    root.style.setProperty("--background", "oklch(0.15 0.01 260)");
    root.style.setProperty("--foreground", "oklch(0.93 0.005 85)");
    root.style.setProperty("--card", "oklch(0.18 0.01 260)");
    root.style.setProperty("--card-foreground", "oklch(0.93 0.005 85)");
    root.style.setProperty("--popover", "oklch(0.18 0.01 260)");
    root.style.setProperty("--popover-foreground", "oklch(0.93 0.005 85)");
    root.style.setProperty("--secondary", "oklch(0.22 0.01 260)");
    root.style.setProperty("--secondary-foreground", "oklch(0.85 0.005 85)");
    root.style.setProperty("--muted", "oklch(0.22 0.01 260)");
    root.style.setProperty("--muted-foreground", "oklch(0.65 0.01 260)");
    root.style.setProperty("--accent", "oklch(0.22 0.01 260)");
    root.style.setProperty("--accent-foreground", "oklch(0.93 0.005 85)");
    root.style.setProperty("--border", "oklch(0.28 0.01 260)");
    root.style.setProperty("--input", "oklch(0.28 0.01 260)");
    root.style.setProperty("--primary-foreground", "oklch(0.98 0.005 85)");
    // Dark warm palette overrides (--t-* tokens feed into @theme inline)
    root.style.setProperty("--t-warm-50", "oklch(0.18 0.005 260)");
    root.style.setProperty("--t-warm-100", "oklch(0.22 0.008 260)");
    root.style.setProperty("--t-warm-200", "oklch(0.28 0.01 260)");
    root.style.setProperty("--t-warm-300", "oklch(0.35 0.015 260)");
    root.style.setProperty("--t-warm-400", "oklch(0.45 0.02 260)");
    root.style.setProperty("--t-cream", "oklch(0.15 0.008 260)");
    root.style.setProperty("--t-ivory", "oklch(0.13 0.005 260)");
    root.style.setProperty("--t-charcoal", "oklch(0.93 0.005 85)");
    root.style.setProperty("--t-charcoal-light", "oklch(0.75 0.005 85)");
  } else {
    root.classList.remove("portfolio-dark");
    // Light mode CSS variables (restore defaults)
    root.style.setProperty("--background", "oklch(0.97 0.008 80)");
    root.style.setProperty("--foreground", "oklch(0.25 0.01 60)");
    root.style.setProperty("--card", "oklch(0.99 0.004 80)");
    root.style.setProperty("--card-foreground", "oklch(0.25 0.01 60)");
    root.style.setProperty("--popover", "oklch(0.99 0.004 80)");
    root.style.setProperty("--popover-foreground", "oklch(0.25 0.01 60)");
    root.style.setProperty("--secondary", "oklch(0.94 0.01 70)");
    root.style.setProperty("--secondary-foreground", "oklch(0.35 0.02 55)");
    root.style.setProperty("--muted", "oklch(0.94 0.01 70)");
    root.style.setProperty("--muted-foreground", "oklch(0.50 0.02 55)");
    root.style.setProperty("--accent", "oklch(0.94 0.01 70)");
    root.style.setProperty("--accent-foreground", "oklch(0.25 0.01 60)");
    root.style.setProperty("--border", "oklch(0.90 0.01 70)");
    root.style.setProperty("--input", "oklch(0.90 0.01 70)");
    root.style.setProperty("--primary-foreground", "oklch(0.98 0.005 85)");
    // Light warm palette (--t-* tokens feed into @theme inline)
    root.style.setProperty("--t-warm-50", "oklch(0.98 0.005 70)");
    root.style.setProperty("--t-warm-100", "oklch(0.96 0.01 65)");
    root.style.setProperty("--t-warm-200", "oklch(0.92 0.015 60)");
    root.style.setProperty("--t-warm-300", "oklch(0.85 0.03 55)");
    root.style.setProperty("--t-warm-400", "oklch(0.72 0.06 50)");
    root.style.setProperty("--t-cream", "oklch(0.97 0.008 80)");
    root.style.setProperty("--t-ivory", "oklch(0.98 0.005 85)");
    root.style.setProperty("--t-charcoal", "oklch(0.25 0.01 60)");
    root.style.setProperty("--t-charcoal-light", "oklch(0.40 0.01 60)");
  }
}

/**
 * Hook to fetch and apply theme settings from the database.
 * Used in the main App layout to dynamically theme the portfolio.
 */
export function useThemeSettings() {
  const { data, isLoading, error } = trpc.theme.get.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Local dark mode override (localStorage) — allows visitor toggle without DB write
  const [localDarkMode, setLocalDarkMode] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("portfolio-dark-mode");
    return stored !== null ? stored === "true" : null;
  });

  // Determine effective dark mode: local override > DB setting
  const isDark = localDarkMode !== null ? localDarkMode : (data?.darkMode ?? DEFAULT_THEME.darkMode);

  useEffect(() => {
    if (data) {
      applyThemeToDOM({
        accentColor: data.accentColor || DEFAULT_THEME.accentColor,
        accentColorHover: data.accentColorHover || DEFAULT_THEME.accentColorHover,
        headingFont: data.headingFont || DEFAULT_THEME.headingFont,
        bodyFont: data.bodyFont || DEFAULT_THEME.bodyFont,
        darkMode: isDark,
      });
    }
  }, [data, isDark]);

  const toggleDarkMode = useCallback(() => {
    setLocalDarkMode((prev: boolean | null) => {
      const next = prev !== null ? !prev : !(data?.darkMode ?? DEFAULT_THEME.darkMode);
      localStorage.setItem("portfolio-dark-mode", String(next));
      // Immediately apply
      if (data) {
        applyThemeToDOM({
          accentColor: data.accentColor || DEFAULT_THEME.accentColor,
          accentColorHover: data.accentColorHover || DEFAULT_THEME.accentColorHover,
          headingFont: data.headingFont || DEFAULT_THEME.headingFont,
          bodyFont: data.bodyFont || DEFAULT_THEME.bodyFont,
          darkMode: next,
        });
      }
      return next;
    });
  }, [data]);

  return { theme: data, isLoading, error, isDark, toggleDarkMode };
}

export { hexToOklchApprox, darkenHex, lightenHex, applyThemeToDOM, loadGoogleFont };
