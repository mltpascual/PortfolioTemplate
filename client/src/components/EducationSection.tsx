/*
 * DESIGN: Warm Monochrome Editorial
 * Education timeline with warm accent line, matching Experience section style.
 */

import { useEffect, useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import type { PortfolioData } from "@/hooks/usePortfolio";

interface EducationSectionProps {
  education: PortfolioData["education"];
}

export default function EducationSection({ education }: EducationSectionProps) {
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
      id="education"
      ref={sectionRef}
      className="section-padding bg-cream"
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
            Education
          </span>
          <h2
            className="text-4xl md:text-5xl text-charcoal leading-tight max-w-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Academic
            <br />
            <span className="text-terracotta italic">background.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-warm-200" />

          <div className="space-y-8">
            {education.map((edu, i) => (
              <div
                key={edu.id}
                className={`relative pl-16 md:pl-20 transition-all duration-600 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${150 + i * 120}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-3.5 md:left-5.5 top-8 w-5 h-5 rounded-full bg-cream border-2 border-terracotta flex items-center justify-center">
                  <GraduationCap className="w-2.5 h-2.5 text-terracotta" />
                </div>

                {/* Card */}
                <div className="warm-card p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
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
      </div>
    </section>
  );
}
