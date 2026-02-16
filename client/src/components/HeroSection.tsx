/*
 * DESIGN: Warm Monochrome Editorial
 * Asymmetric hero with large serif heading on left, abstract visual on right.
 * Pill-shaped CTA buttons. Staggered entrance animation.
 * Warm cream background with subtle grain overlay.
 */

import { useEffect, useState } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

const HERO_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/td3PawS2CTYA7JoACPMNMZ/sandbox/l9YS4GhTwPQ9i9FbjWHhPd-img-1_1771203704000_na1fn_aGVyby1hYnN0cmFjdA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdGQzUGF3UzJDVFlBN0pvQUNQTU5NWi9zYW5kYm94L2w5WVM0R2hUd1BROWk5RmJqV0hoUGQtaW1nLTFfMTc3MTIwMzcwNDAwMF9uYTFmbl9hR1Z5YnkxaFluTjBjbUZqZEEucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=humMx5mo8MYSVnQVIEsvOwF8lCFzDKfiA1z2S9uDObgN8DaGt4uLifYa-Z9XAwYEEVnWwimi9Ephua7rrDqwwXlli8wT6~SRLQfYUJT1iTihpF-engSAr2P55ibsZo1qhpQudIwig66ChP3KzwQahOKnL7Lh-1DKcp5eJGFKf5xa6zZ1kJI45x-Nq~tHyFwp0lwEDAY2uHEfx95GKLGERb9zPpJwmdmJhTDiVjg7rIUthZZyHdQv86hXpx7Cj5GcPQrmDJ3mxeSq4YhRo8cSRqW0koLXNN6hcgkXCLsKLI4auFoDgr-gSQwS~HIfpqnQuGz-ZtUtcBUEp36cJz3iuQ__";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-100 border border-warm-200 mb-8">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span className="text-sm font-medium text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
                Available for opportunities
              </span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-charcoal mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Crafting digital
              <br />
              <span className="text-terracotta">experiences</span>
              <br />
              with purpose.
            </h1>

            <p
              className="text-lg md:text-xl text-charcoal-light leading-relaxed max-w-lg mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Full-stack software engineer with 5+ years building scalable web
              applications, design systems, and developer tools that make a
              difference.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#projects" className="pill-primary">
                View My Work
              </a>
              <a href="#contact" className="pill-outline">
                Let's Connect
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:alex@example.com"
                className="p-2.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
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
                src={HERO_IMAGE}
                alt="Abstract geometric composition with warm terracotta and cream tones"
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
