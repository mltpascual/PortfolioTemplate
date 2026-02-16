/*
 * DESIGN: Warm Monochrome Editorial
 * Floating navbar with frosted glass effect on scroll.
 * Pill-shaped nav links with warm hover states.
 * Layout-mode aware: in combined mode, Skills/Experience/Education links
 * scroll to the combined section and activate the correct pill tab.
 * Nav link order follows the sectionOrder from theme settings.
 * Scroll-spy: highlights the active section link as you scroll.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Menu, X, Settings, FileText } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useThemeSettings, DEFAULT_THEME } from "@/hooks/useThemeSettings";
import type { PortfolioData } from "@/hooks/usePortfolio";

const NAV_LINK_MAP: Record<string, { label: string; href: string }> = {
  about: { label: "About", href: "#about" },
  skills: { label: "Skills", href: "#skills" },
  projects: { label: "Projects", href: "#projects" },
  experience: { label: "Experience", href: "#experience" },
  education: { label: "Education", href: "#education" },
  contact: { label: "Contact", href: "#contact" },
};

// Sections that are excluded from the navbar (hero has no nav link)
const EXCLUDED_SECTIONS = new Set(["hero"]);
const COMBINED_SECTIONS = new Set(["skills", "experience", "education"]);

const DEFAULT_SECTION_ORDER = "hero,about,projects,skills,experience,education,contact";

interface NavbarProps {
  profile: PortfolioData["profile"];
  hiddenSections?: Set<string>;
}

export default function Navbar({ profile, hiddenSections = new Set() }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { user, isAuthenticated } = useAuth();
  const { theme } = useThemeSettings();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const scrollSpyRaf = useRef<number>(0);

  const layoutMode = theme?.layoutMode || DEFAULT_THEME.layoutMode;
  const sectionOrder = theme?.sectionOrder || DEFAULT_SECTION_ORDER;
  const isCombined = layoutMode === "combined";

  const displayName = profile?.fullName || "Alex Chen";
  const resumeUrl = profile?.resumeUrl;

  // Build nav links dynamically from sectionOrder
  const navLinks = useMemo(() => {
    const sections = sectionOrder
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const links: { sectionId: string; label: string; href: string }[] = [];

    for (const sectionId of sections) {
      // Skip sections that don't have nav links or are hidden
      if (EXCLUDED_SECTIONS.has(sectionId)) continue;
      if (hiddenSections.has(sectionId)) continue;

      const meta = NAV_LINK_MAP[sectionId];
      if (!meta) continue;

      links.push({
        sectionId,
        label: meta.label,
        href: meta.href,
      });
    }

    return links;
  }, [sectionOrder, isCombined, hiddenSections]);

  // Scroll-spy: detect which section is currently in view
  const updateActiveSection = useCallback(() => {
    const navbarHeight = 80;
    const scrollY = window.scrollY;

    // If near the top, no active section
    if (scrollY < 100) {
      setActiveSection("");
      return;
    }

    // Check each section from bottom to top — the last one whose top is above the viewport midpoint wins
    let currentSection = "";
    const sectionIds = isCombined
      ? navLinks.map((l) => {
          if (COMBINED_SECTIONS.has(l.sectionId)) return "combined-section";
          return l.sectionId;
        })
      : navLinks.map((l) => l.sectionId);

    // Deduplicate (combined-section may appear multiple times)
    const uniqueIds = Array.from(new Set(sectionIds));

    for (const id of uniqueIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      // Section is "active" if its top is above 40% of viewport
      if (rect.top <= window.innerHeight * 0.4) {
        // Map combined-section back to the actual section IDs
        if (id === "combined-section") {
          // Find which combined tab is most visible
          for (const combinedId of ["skills", "experience", "education"]) {
            const anchor = document.getElementById(combinedId);
            if (anchor) {
              currentSection = combinedId;
            }
          }
        } else {
          currentSection = id;
        }
      }
    }

    setActiveSection(currentSection);
  }, [navLinks, isCombined]);

  // Combined scroll handler for both scrolled state and scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Throttle scroll-spy with rAF
      if (scrollSpyRaf.current) {
        cancelAnimationFrame(scrollSpyRaf.current);
      }
      scrollSpyRaf.current = requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollSpyRaf.current) {
        cancelAnimationFrame(scrollSpyRaf.current);
      }
    };
  }, [updateActiveSection]);

  // Handle nav link click — smooth scroll + combined mode tab switching
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();

    if (isCombined && COMBINED_SECTIONS.has(link.sectionId)) {
      // Scroll to the combined section
      const combinedEl = document.getElementById("combined-section");
      if (combinedEl) {
        const offset = 80;
        const y = combinedEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }

      // Dispatch custom event to switch the tab
      window.dispatchEvent(
        new CustomEvent("combined-tab-switch", { detail: link.sectionId })
      );
    } else {
      // Smooth scroll to the section
      const el = document.getElementById(link.sectionId);
      if (el) {
        const offset = 80;
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }

    setActiveSection(link.sectionId);
    setMobileOpen(false);
  };

  // Check if a nav link is active
  const isLinkActive = (sectionId: string) => {
    if (activeSection === sectionId) return true;
    // In combined mode, if the active section is any combined section and this link is one too
    if (isCombined && COMBINED_SECTIONS.has(sectionId) && COMBINED_SECTIONS.has(activeSection)) {
      return activeSection === sectionId;
    }
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/80 backdrop-blur-xl shadow-[0_2px_20px_oklch(0.25_0.01_60/0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveSection("");
          }}
          className="text-xl md:text-2xl tracking-tight text-charcoal"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {displayName}
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isLinkActive(link.sectionId);
            return (
              <a
                key={link.sectionId}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  active
                    ? "bg-terracotta/10 text-terracotta-dark"
                    : "text-charcoal-light hover:bg-warm-100 hover:text-terracotta-dark"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </a>
            );
          })}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-charcoal-light rounded-full transition-all duration-200 hover:bg-warm-100 hover:text-terracotta-dark inline-flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <FileText className="w-3.5 h-3.5" />
              Resume
            </a>
          )}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("contact");
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
              setActiveSection("contact");
            }}
            className="pill-primary-sm ml-3"
          >
            Get in Touch
          </a>
          {isAdmin && (
            <a
              href="/admin"
              className="ml-2 p-2 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
              aria-label="Admin Dashboard"
              title="Admin Dashboard"
            >
              <Settings className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-full hover:bg-warm-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-charcoal" />
          ) : (
            <Menu className="w-5 h-5 text-charcoal" />
          )}
        </button>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-cream/95 backdrop-blur-xl border-t border-warm-200 px-4 pb-6 pt-2">
          {navLinks.map((link) => {
            const active = isLinkActive(link.sectionId);
            return (
              <a
                key={link.sectionId}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`block py-3 text-base font-medium transition-colors ${
                  active
                    ? "text-terracotta-dark"
                    : "text-charcoal-light hover:text-terracotta-dark"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </a>
            );
          })}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-3 text-base font-medium text-charcoal-light hover:text-terracotta-dark transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <FileText className="w-4 h-4" />
              Resume
            </a>
          )}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("contact");
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
              setActiveSection("contact");
              setMobileOpen(false);
            }}
            className="pill-primary-sm mt-4 w-full text-center"
          >
            Get in Touch
          </a>
          {isAdmin && (
            <a
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="pill-outline-sm mt-3 w-full text-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Admin Dashboard
            </a>
          )}
        </div>
      )}
    </header>
  );
}
