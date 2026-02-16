/*
 * DESIGN: Warm Monochrome Editorial
 * Floating navbar with frosted glass effect on scroll.
 * Pill-shaped nav links with warm hover states.
 */

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          Alex Chen
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
          <a href="#contact" className="pill-primary-sm ml-3">
            Get in Touch
          </a>
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
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="pill-primary-sm mt-4 w-full text-center"
          >
            Get in Touch
          </a>
        </div>
      )}
    </header>
  );
}
