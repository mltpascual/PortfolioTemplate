/*
 * DESIGN: Warm Monochrome Editorial
 * Clean footer with warm tones. Logo, nav links, social icons.
 */

import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import type { PortfolioData } from "@/hooks/usePortfolio";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

interface FooterProps {
  profile: PortfolioData["profile"];
}

export default function Footer({ profile }: FooterProps) {
  const displayName = profile?.fullName || "Alex Chen";
  const githubUrl = profile?.githubUrl;
  const linkedinUrl = profile?.linkedinUrl;
  const twitterUrl = profile?.twitterUrl;
  const email = profile?.email;

  const socialLinks = [
    ...(githubUrl ? [{ icon: Github, href: githubUrl, label: "GitHub" }] : []),
    ...(linkedinUrl ? [{ icon: Linkedin, href: linkedinUrl, label: "LinkedIn" }] : []),
    ...(twitterUrl ? [{ icon: Twitter, href: twitterUrl, label: "Twitter" }] : []),
    ...(email ? [{ icon: Mail, href: `mailto:${email}`, label: "Email" }] : []),
  ];

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
            {displayName}
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
            &copy; {new Date().getFullYear()} {displayName}. Crafted with care.
          </p>

          {/* Social */}
          {socialLinks.length > 0 && (
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
          )}
        </div>
      </div>
    </footer>
  );
}
