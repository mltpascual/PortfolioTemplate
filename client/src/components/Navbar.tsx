/*
 * DESIGN: Warm Monochrome Editorial
 * Floating navbar with frosted glass effect on scroll.
 * Pill-shaped nav links with warm hover states.
 * Layout-mode aware: in combined mode, Skills/Experience/Education links
 * scroll to the combined section and activate the correct pill tab.
 * Nav link order follows the sectionOrder from theme settings.
 */

import { useState, useEffect, useMemo } from "react";
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
}

export default function Navbar({ profile }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { theme } = useThemeSettings();
  const isAdmin = isAuthenticated && user?.role === "admin";

  const layoutMode = theme?.layoutMode || DEFAULT_THEME.layoutMode;
  const sectionOrder = theme?.sectionOrder || DEFAULT_SECTION_ORDER;
  const isCombined = layoutMode === "combined";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName = profile?.fullName || "Alex Chen";
  const resumeUrl = profile?.resumeUrl;

  // Build nav links dynamically from sectionOrder
  const navLinks = useMemo(() => {
    const sections = sectionOrder
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const links: { sectionId: string; label: string; href: string }[] = [];
    let combinedShown = false;

    for (const sectionId of sections) {
      // Skip sections that don't have nav links
      if (EXCLUDED_SECTIONS.has(sectionId)) continue;

      const meta = NAV_LINK_MAP[sectionId];
      if (!meta) continue;

      // In combined mode, show only one link for the combined group
      if (isCombined && COMBINED_SECTIONS.has(sectionId)) {
        if (combinedShown) continue;
        combinedShown = true;
        links.push({
          sectionId,
          label: "Skills & More",
          href: "#skills",
        });
      } else {
        links.push({
          sectionId,
          label: meta.label,
          href: meta.href,
        });
      }
    }

    return links;
  }, [sectionOrder, isCombined]);

  // Handle nav link click — in combined mode, dispatch a custom event
  // to switch the active pill tab in the CombinedSection
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (isCombined && COMBINED_SECTIONS.has(link.sectionId)) {
      e.preventDefault();

      // Scroll to the combined section
      const combinedEl = document.getElementById("combined-section");
      if (combinedEl) {
        const offset = 80; // navbar height
        const y = combinedEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }

      // Dispatch custom event to switch the tab
      window.dispatchEvent(
        new CustomEvent("combined-tab-switch", { detail: link.sectionId })
      );
    }
    setMobileOpen(false);
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
          className="text-xl md:text-2xl tracking-tight text-charcoal"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {displayName}
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.sectionId}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="px-4 py-2 text-sm font-medium text-charcoal-light rounded-full transition-all duration-200 hover:bg-warm-100 hover:text-terracotta-dark"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {link.label}
            </a>
          ))}
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
          <a href="#contact" className="pill-primary-sm ml-3">
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
          {navLinks.map((link) => (
            <a
              key={link.sectionId}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="block py-3 text-base font-medium text-charcoal-light hover:text-terracotta-dark transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {link.label}
            </a>
          ))}
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
            onClick={() => setMobileOpen(false)}
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
