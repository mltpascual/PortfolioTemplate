/*
 * DESIGN: Warm Monochrome Editorial
 * Split layout: image left, text right. Offset grid.
 */

import { useEffect, useRef, useState } from "react";
import type { PortfolioData } from "@/hooks/usePortfolio";

const ABOUT_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/td3PawS2CTYA7JoACPMNMZ/sandbox/l9YS4GhTwPQ9i9FbjWHhPd-img-2_1771203714000_na1fn_YWJvdXQtdmlzdWFs.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdGQzUGF3UzJDVFlBN0pvQUNQTU5NWi9zYW5kYm94L2w5WVM0R2hUd1BROWk5RmJqV0hoUGQtaW1nLTJfMTc3MTIwMzcxNDAwMF9uYTFmbl9ZV0p2ZFhRdGRtbHpkV0ZzLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=HyxzqFy6vv4jbgPujGSUYJpdLY0relm~6RrLeb4jHcZM0VyAQg~TEjccEeizIPGinkcWCxaJfdHBf4EpCERQcWyabACy~R3CT4WWQyGCSDKtKeVsdYh9nnLu3t0xbzNlWrMJNmEPT9ZwQHmTPdeg0zaqHIVOFcefsp6fRw8Q8PHt2eJSuKI7N63wunetnrjb7-ntqZi8BPO481YWRSbNZ~FAPSUC4Se8XhFsGgWVCd184jJKW8KjhfxoNAhLmek4JBBndL~GelqiwELfw7MrrPrzab~StCSi5h9EzvCD5U6Mtj8mXbP9Fkzc0Zv1lrWNcjOPtaUy8gXXNrmKR~1hWg__";

interface AboutSectionProps {
  profile: PortfolioData["profile"];
  customTitle?: string;
}

export default function AboutSection({ profile, customTitle }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const bio = profile?.bio || "I'm a software engineer who believes great code should be invisible — users should only notice the seamless experience it creates. With a background in computer science and a passion for design, I bridge the gap between technical excellence and beautiful interfaces.\n\nMy approach combines clean architecture with thoughtful UX. I've worked across startups and established companies, building everything from real-time data platforms to consumer-facing mobile apps. I care deeply about performance, accessibility, and writing code that other developers enjoy reading.";

  const stats = [
    { value: profile?.yearsExperience || "5+", label: "Years Experience" },
    { value: profile?.projectsDelivered || "30+", label: "Projects Delivered" },
    { value: profile?.openSourceContributions || "15+", label: "Open Source Contributions" },
    { value: profile?.clientSatisfaction || "99%", label: "Client Satisfaction" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="container">
        {/* Section Label */}
        <div
          className={`mb-16 transition-all duration-600 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase text-terracotta"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {customTitle || "About Me"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left: Image (2 cols) */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-100 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-terracotta/10 rounded-[1.75rem] blur-xl" />
              <img
                src={ABOUT_IMAGE}
                alt="Warm workspace"
                className="relative w-full rounded-[1.25rem] shadow-[0_8px_32px_oklch(0.25_0.01_60/0.1)]"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Text (3 cols) */}
          <div
            className={`lg:col-span-3 transition-all duration-700 delay-200 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2
              className="text-4xl md:text-5xl text-charcoal leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Building software that
              <br />
              <span className="text-terracotta italic">feels right.</span>
            </h2>

            <div
              className="space-y-4 text-charcoal-light leading-relaxed text-base md:text-lg max-w-2xl mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {bio.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`transition-all duration-500 ${
                    visible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <div
                    className="text-3xl md:text-4xl font-normal text-terracotta mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-sm text-charcoal-light"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
