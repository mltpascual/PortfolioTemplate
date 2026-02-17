/*
 * DESIGN: Warm Monochrome Editorial
 * Asymmetric hero with large serif heading on left, abstract visual on right.
 * Pill-shaped CTA buttons. Staggered entrance animation.
 */

import { useEffect, useState } from "react";
import { ArrowDown, Github, Linkedin, Mail, FileText } from "lucide-react";
import type { PortfolioData } from "@/hooks/usePortfolio";

const HERO_IMAGE = "/assets/hero-abstract.webp";

interface HeroSectionProps {
  profile: PortfolioData["profile"];
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const tagline = profile?.heroTagline || "Crafting digital experiences with purpose.";
  const subtitle = profile?.heroSubtitle || "Full-stack software engineer with 5+ years building scalable web applications, design systems, and developer tools that make a difference.";
  const githubUrl = profile?.githubUrl || "https://github.com";
  const linkedinUrl = profile?.linkedinUrl || "https://linkedin.com";
  const email = profile?.email || "alex@example.com";
  const availableForWork = profile?.availableForWork ?? 1;

  // Split tagline into parts for styling
  const taglineParts = tagline.split(" ");
  const midPoint = Math.ceil(taglineParts.length / 2);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grain-overlay">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-24 md:pt-20">
          {/* Left: Text Content */}
          <div
            className={`transition-all duration-700 ease-out ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {availableForWork === 1 && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-100 border border-warm-200 mb-8">
                <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
                <span className="text-sm font-medium text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
                  Available for opportunities
                </span>
              </div>
            )}

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-charcoal mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {tagline}
            </h1>

            <p
              className="text-lg md:text-xl text-charcoal-light leading-relaxed max-w-lg mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#projects" className="pill-primary">
                View My Work
              </a>
              <a href="#contact" className="pill-outline">
                Let's Connect
              </a>
              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-outline inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Resume
                </a>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="p-2.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Right: Abstract Visual */}
          <div
            className={`relative transition-all duration-700 delay-200 ease-out ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-warm-200/40 rounded-[2rem] blur-2xl" />
              <img
                src={profile?.avatarUrl || HERO_IMAGE}
                alt="Hero visual"
                className="relative w-full rounded-[1.5rem] shadow-[0_8px_40px_oklch(0.25_0.01_60/0.12)]"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`flex justify-center mt-16 lg:mt-12 transition-all duration-700 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-charcoal-light hover:text-terracotta transition-colors"
          >
            <span className="text-xs font-medium tracking-widest uppercase" style={{ fontFamily: "var(--font-body)" }}>
              Scroll
            </span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
