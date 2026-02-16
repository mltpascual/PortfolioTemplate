/*
 * DESIGN: Warm Monochrome Editorial
 * Clean footer with warm tones. Logo, nav links, social icons.
 * Subtle top border. Pill-shaped social icons.
 */

import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "mailto:alex@example.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-warm-200 bg-warm-50/30">
      <div className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
          {/* Logo */}
          <a
            href="#"
            className="text-2xl tracking-tight text-charcoal"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Alex Chen
          </a>

          {/* Nav */}
          <nav className="flex flex-wrap items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-charcoal-light hover:text-terracotta transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8 border-t border-warm-200/60">
          <p
            className="text-sm text-charcoal-light"
            style={{ fontFamily: "var(--font-body)" }}
          >
            &copy; {new Date().getFullYear()} Alex Chen. Crafted with care.
          </p>

          {/* Social */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
