/*
 * DESIGN: Warm Monochrome Editorial
 * Bento-style skill cards with warm shadows and large border-radius.
 */

import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Database,
  Globe,
  Layers,
  Palette,
  Server,
  Smartphone,
  Terminal,
  Cpu,
  Cloud,
  Shield,
  Zap,
} from "lucide-react";
import type { PortfolioData } from "@/hooks/usePortfolio";
import { parseTags } from "@/hooks/usePortfolio";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Database,
  Globe,
  Layers,
  Palette,
  Server,
  Smartphone,
  Terminal,
  Cpu,
  Cloud,
  Shield,
  Zap,
};

interface SkillsSectionProps {
  skills: PortfolioData["skills"];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-padding bg-warm-50/50 relative"
    >
      <div className="container">
        {/* Section Header */}
        <div
          className={`mb-16 transition-all duration-600 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase text-terracotta mb-4 block"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Skills & Expertise
          </span>
          <h2
            className="text-4xl md:text-5xl text-charcoal leading-tight max-w-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tools I use to bring
            <br />
            <span className="text-terracotta italic">ideas to life.</span>
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Code2;
            const skillList = parseTags(cat.skills);
            const accent = i % 2 === 0 ? "bg-terracotta/8" : "bg-warm-200/60";
            return (
              <div
                key={cat.id}
                className={`warm-card p-6 group transition-all duration-500 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${100 + i * 75}ms` }}
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${accent} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="w-5 h-5 text-terracotta" />
                </div>
                <h3
                  className="text-lg text-charcoal mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-warm-100 text-charcoal-light border border-warm-200/60 hover:border-terracotta-light hover:text-terracotta-dark transition-colors duration-200"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
