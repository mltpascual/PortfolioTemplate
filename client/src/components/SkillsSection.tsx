/*
 * DESIGN: Warm Monochrome Editorial
 * Bento-style skill cards with warm shadows and large border-radius.
 * SVG icons, no emojis. Staggered entrance animation.
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
} from "lucide-react";

const skillCategories = [
  {
    icon: Code2,
    title: "Frontend",
    skills: ["React", "TypeScript", "Next.js", "Vue.js", "Tailwind CSS"],
    accent: "bg-terracotta/8",
  },
  {
    icon: Server,
    title: "Backend",
    skills: ["Node.js", "Python", "Go", "REST APIs", "GraphQL"],
    accent: "bg-warm-200/60",
  },
  {
    icon: Database,
    title: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Drizzle"],
    accent: "bg-terracotta/8",
  },
  {
    icon: Globe,
    title: "Cloud & DevOps",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    accent: "bg-warm-200/60",
  },
  {
    icon: Smartphone,
    title: "Mobile",
    skills: ["React Native", "Flutter", "iOS", "Android", "PWA"],
    accent: "bg-warm-200/60",
  },
  {
    icon: Palette,
    title: "Design",
    skills: ["Figma", "Design Systems", "Prototyping", "UI/UX", "A11y"],
    accent: "bg-terracotta/8",
  },
  {
    icon: Terminal,
    title: "Tools",
    skills: ["Git", "Linux", "Vim", "Webpack", "Vite"],
    accent: "bg-warm-200/60",
  },
  {
    icon: Layers,
    title: "Architecture",
    skills: ["Microservices", "Event-Driven", "DDD", "TDD", "Clean Code"],
    accent: "bg-terracotta/8",
  },
];

export default function SkillsSection() {
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
          {skillCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className={`warm-card p-6 group transition-all duration-500 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${100 + i * 75}ms` }}
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${cat.accent} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}
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
                  {cat.skills.map((skill) => (
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
