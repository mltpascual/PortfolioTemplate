/*
 * DESIGN: Warm Monochrome Editorial
 * Clean footer with warm tones. Logo, nav links, social icons.
 */

import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import type { PortfolioData } from "@/hooks/usePortfolio";

interface FooterProps {
  profile: PortfolioData["profile"];
}

export default function Footer({ profile }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

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
    <footer
      ref={footerRef}
      className={`border-t border-warm-200 bg-warm-50/30 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
