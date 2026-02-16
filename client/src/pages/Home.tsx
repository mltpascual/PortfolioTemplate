/*
 * DESIGN: Warm Monochrome Editorial
 * Single-page portfolio with dynamic section ordering and layout mode.
 * Sections can be reordered via admin panel.
 * Skills/Experience/Education can be shown as separate sections or combined with pill tabs.
 * 
 * Data is fetched from the database via tRPC and passed down to each section.
 * If the database is empty, sensible defaults are used.
 * Theme settings (accent color, fonts, layout mode, section order) are fetched and applied dynamically.
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
import CombinedSection from "@/components/CombinedSection";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useThemeSettings, DEFAULT_THEME } from "@/hooks/useThemeSettings";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";

const DEFAULT_SECTION_ORDER = "hero,about,projects,skills,experience,education,contact";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
        <p className="text-charcoal-light font-body text-sm tracking-wide animate-pulse">Loading portfolio...</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { portfolio, isLoading } = usePortfolio();
  // Fetch and apply theme settings (accent color + fonts) from the database
  const { theme } = useThemeSettings();

  // Get layout settings from theme data
  const layoutMode = theme?.layoutMode || DEFAULT_THEME.layoutMode;
  const sectionOrder = theme?.sectionOrder || DEFAULT_SECTION_ORDER;

  // Parse section order into array
  const sections = useMemo(() => {
    return sectionOrder
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }, [sectionOrder]);

  if (isLoading || !portfolio) {
    return <LoadingSkeleton />;
  }

  // In combined mode, skills/experience/education are merged into one "combined" section.
  // We skip individual skills/experience/education sections and render CombinedSection instead.
  const isCombined = layoutMode === "combined";
  const combinedSectionIds = new Set(["skills", "experience", "education"]);
  let combinedRendered = false;

  const renderSection = (sectionId: string) => {
    // In combined mode, replace the first occurrence of skills/experience/education with CombinedSection
    if (isCombined && combinedSectionIds.has(sectionId)) {
      if (combinedRendered) return null; // Already rendered
      combinedRendered = true;
      return (
        <CombinedSection
          key="combined"
          skills={portfolio.skills}
          experiences={portfolio.experiences}
          education={portfolio.education}
        />
      );
    }

    switch (sectionId) {
      case "hero":
        return <HeroSection key="hero" profile={portfolio.profile} />;
      case "about":
        return <AboutSection key="about" profile={portfolio.profile} />;
      case "projects":
        return <ProjectsSection key="projects" projects={portfolio.projects} />;
      case "skills":
        return <SkillsSection key="skills" skills={portfolio.skills} />;
      case "experience":
        return <ExperienceSection key="experience" experiences={portfolio.experiences} />;
      case "education":
        return <EducationSection key="education" education={portfolio.education} />;
      case "contact":
        return <ContactSection key="contact" profile={portfolio.profile} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar profile={portfolio.profile} />
      <main>
        {sections.map((sectionId: string) => renderSection(sectionId))}
      </main>
      <Footer profile={portfolio.profile} />
    </div>
  );
}
