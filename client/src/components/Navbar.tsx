/*
 * DESIGN: Warm Monochrome Editorial
 * Floating navbar with frosted glass effect on scroll.
 * Pill-shaped nav links with warm hover states.
 */

import { useState, useEffect } from "react";
import { Menu, X, Settings, FileText } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import type { PortfolioData } from "@/hooks/usePortfolio";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  profile: PortfolioData["profile"];
}

export default function Navbar({ profile }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName = profile?.fullName || "Alex Chen";
  const resumeUrl = profile?.resumeUrl;

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
              key={link.href}
              href={link.href}
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
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
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
