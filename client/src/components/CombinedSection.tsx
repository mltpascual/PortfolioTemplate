/*
 * DESIGN: Warm Monochrome Editorial
 * Combined section with pill-tab navigation for Skills, Experience, and Education.
 * Matches the warm editorial design language.
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
  Briefcase,
  GraduationCap,
} from "lucide-react";
import type { PortfolioData } from "@/hooks/usePortfolio";
import { parseTags } from "@/hooks/usePortfolio";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Database, Globe, Layers, Palette, Server, Smartphone, Terminal, Cpu, Cloud, Shield, Zap,
};

type Tab = "skills" | "experience" | "education";

interface CombinedSectionProps {
  skills: PortfolioData["skills"];
  experiences: PortfolioData["experiences"];
  education: PortfolioData["education"];
}

export default function CombinedSection({ skills, experiences, education }: CombinedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("skills");

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

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "skills", label: "Skills", icon: <Code2 className="w-4 h-4" /> },
    { key: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
    { key: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-padding bg-warm-50/50"
    >
      <div className="container">
        {/* Section Header */}
        <div
          className={`mb-12 transition-all duration-600 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase text-terracotta mb-4 block"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Background
          </span>
          <h2
            className="text-4xl md:text-5xl text-charcoal leading-tight max-w-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What I bring
            <br />
            <span className="text-terracotta italic">to the table.</span>
          </h2>
        </div>

        {/* Pill Tab Navigation */}
        <div
          className={`flex flex-wrap gap-2 mb-10 transition-all duration-600 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeTab === tab.key
                  ? "bg-terracotta text-white border-terracotta shadow-md"
                  : "bg-white text-charcoal-light border-warm-200/60 hover:border-terracotta-light hover:text-terracotta-dark"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className={`transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {activeTab === "skills" && <SkillsContent skills={skills} />}
          {activeTab === "experience" && <ExperienceContent experiences={experiences} />}
          {activeTab === "education" && <EducationContent education={education} />}
        </div>
      </div>
    </section>
  );
}

/* ─── Skills Tab Content ─── */
function SkillsContent({ skills }: { skills: PortfolioData["skills"] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in duration-500">
      {skills.map((cat, i) => {
        const Icon = iconMap[cat.icon] || Code2;
        const skillList = parseTags(cat.skills);
        const accent = i % 2 === 0 ? "bg-terracotta/8" : "bg-warm-200/60";
        return (
          <div key={cat.id} className="warm-card p-6 group transition-all duration-300 hover:shadow-md">
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
  );
}

/* ─── Experience Tab Content ─── */
function ExperienceContent({ experiences }: { experiences: PortfolioData["experiences"] }) {
  return (
    <div className="relative animate-in fade-in duration-500">
      {/* Timeline line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-warm-200" />

      <div className="space-y-8">
        {experiences.map((exp) => {
          const tags = parseTags(exp.tags);
          return (
            <div key={exp.id} className="relative pl-16 md:pl-20">
              {/* Timeline dot */}
              <div className="absolute left-3.5 md:left-5.5 top-8 w-5 h-5 rounded-full bg-cream border-2 border-terracotta flex items-center justify-center">
                <Briefcase className="w-2.5 h-2.5 text-terracotta" />
              </div>

              {/* Card */}
              <div className="warm-card p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                  <div className="flex items-start gap-3">
                    {exp.logoUrl && (
                      <img
                        src={exp.logoUrl}
                        alt={`${exp.company} logo`}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain bg-white border border-warm-200/60 p-1 flex-shrink-0 mt-1"
                      />
                    )}
                    <div>
                      <h3
                        className="text-xl md:text-2xl text-charcoal"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {exp.role}
                      </h3>
                      <p
                        className="text-terracotta font-medium text-sm mt-0.5"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {exp.company}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-sm text-charcoal-light whitespace-nowrap px-3 py-1 rounded-full bg-warm-100 border border-warm-200/60 self-start"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {exp.period}
                  </span>
                </div>

                <p
                  className="text-charcoal-light leading-relaxed text-sm md:text-base mb-4"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {exp.description}
                </p>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-warm-100 text-charcoal-light border border-warm-200/60"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Education Tab Content ─── */
function EducationContent({ education }: { education: PortfolioData["education"] }) {
  return (
    <div className="relative animate-in fade-in duration-500">
      {/* Timeline line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-warm-200" />

      <div className="space-y-8">
        {education.map((edu) => (
          <div key={edu.id} className="relative pl-16 md:pl-20">
            {/* Timeline dot */}
            <div className="absolute left-3.5 md:left-5.5 top-8 w-5 h-5 rounded-full bg-cream border-2 border-terracotta flex items-center justify-center">
              <GraduationCap className="w-2.5 h-2.5 text-terracotta" />
            </div>

            {/* Card */}
            <div className="warm-card p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <div className="flex items-start gap-3">
                  {edu.logoUrl && (
                    <img
                      src={edu.logoUrl}
                      alt={`${edu.institution} logo`}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain bg-white border border-warm-200/60 p-1 flex-shrink-0 mt-1"
                    />
                  )}
                  <div>
                    <h3
                      className="text-xl md:text-2xl text-charcoal"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <p
                      className="text-terracotta font-medium text-sm mt-0.5"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {edu.institution}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm text-charcoal-light whitespace-nowrap px-3 py-1 rounded-full bg-warm-100 border border-warm-200/60 self-start"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {edu.startYear} — {edu.endYear || "Present"}
                </span>
              </div>

              {edu.description && (
                <p
                  className="text-charcoal-light leading-relaxed text-sm md:text-base"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
