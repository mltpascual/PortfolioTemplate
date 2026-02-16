/*
 * DESIGN: Warm Monochrome Editorial
 * Vertical timeline with warm accent line.
 * Cards with rounded corners and warm shadows.
 * Serif headings, sans-serif body.
 */

import { useEffect, useRef, useState } from "react";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    role: "Senior Software Engineer",
    company: "TechVenture Inc.",
    period: "2023 — Present",
    description:
      "Leading the frontend architecture team, building a next-gen design system serving 12 product teams. Reduced bundle size by 40% and improved Core Web Vitals across all products.",
    tags: ["React", "TypeScript", "Design Systems", "Performance"],
  },
  {
    role: "Full-Stack Developer",
    company: "DataStream Labs",
    period: "2021 — 2023",
    description:
      "Built real-time data visualization tools processing 10M+ events daily. Designed and implemented a microservices architecture that improved system reliability to 99.9% uptime.",
    tags: ["Node.js", "Go", "PostgreSQL", "Kubernetes"],
  },
  {
    role: "Frontend Engineer",
    company: "CreativeFlow Studio",
    period: "2020 — 2021",
    description:
      "Developed interactive web experiences for major brand campaigns. Pioneered the adoption of modern CSS techniques and animation frameworks within the team.",
    tags: ["React", "GSAP", "Three.js", "Figma"],
  },
  {
    role: "Junior Developer",
    company: "StartupHub",
    period: "2019 — 2020",
    description:
      "First engineering hire at an early-stage startup. Wore many hats — from building the MVP to setting up CI/CD pipelines and mentoring interns.",
    tags: ["Python", "Django", "React", "AWS"],
  },
];

export default function ExperienceSection() {
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
      id="experience"
      ref={sectionRef}
      className="section-padding bg-warm-50/50"
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
            Experience
          </span>
          <h2
            className="text-4xl md:text-5xl text-charcoal leading-tight max-w-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where I've made
            <br />
            <span className="text-terracotta italic">an impact.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-warm-200" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <div
                key={exp.company}
                className={`relative pl-16 md:pl-20 transition-all duration-600 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${150 + i * 120}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-3.5 md:left-5.5 top-8 w-5 h-5 rounded-full bg-cream border-2 border-terracotta flex items-center justify-center">
                  <Briefcase className="w-2.5 h-2.5 text-terracotta" />
                </div>

                {/* Card */}
                <div className="warm-card p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
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

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-warm-100 text-charcoal-light border border-warm-200/60"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
