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
import { useMemo } from "react";

const DEFAULT_SECTION_ORDER = "hero,about,projects,skills,experience,education,contact";
const COMBINED_IDS = new Set(["skills", "experience", "education"]);

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
  const hiddenSectionsStr = theme?.hiddenSections || "";
  const sectionTitlesStr = theme?.sectionTitles || "{}";

  // Parse hidden sections
  const hiddenSections = useMemo(() => {
    return new Set(hiddenSectionsStr.split(",").map((s: string) => s.trim()).filter(Boolean));
  }, [hiddenSectionsStr]);

  // Parse custom section titles
  const sectionTitles = useMemo(() => {
    try {
      return JSON.parse(sectionTitlesStr) as Record<string, string>;
    } catch {
      return {} as Record<string, string>;
    }
  }, [sectionTitlesStr]);

  // Parse section order into array — ALL hooks must be called before any early return
  const sections = useMemo(() => {
    return sectionOrder
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }, [sectionOrder]);

  // Extract the order of combined tabs from the section order
  const combinedTabOrder = useMemo(() => {
    return sections.filter((s: string) => COMBINED_IDS.has(s)) as ("skills" | "experience" | "education")[];
  }, [sections]);

  // Filter combined tab order to exclude hidden sections
  const visibleCombinedTabOrder = useMemo(() => {
    return combinedTabOrder.filter((s) => !hiddenSections.has(s));
  }, [combinedTabOrder, hiddenSections]);

  // Early return AFTER all hooks
  if (isLoading || !portfolio) {
    return <LoadingSkeleton />;
  }

  // In combined mode, skills/experience/education are merged into one "combined" section.
  const isCombined = layoutMode === "combined";
  let combinedRendered = false;

  const renderSection = (sectionId: string) => {
    // Skip hidden sections
    if (hiddenSections.has(sectionId)) {
      // In combined mode, if ALL combined sections are hidden, skip
      if (isCombined && COMBINED_IDS.has(sectionId)) {
        // Check if at least one combined section is visible
        if (visibleCombinedTabOrder.length === 0) return null;
        // Otherwise, let the combined section handle it (it will only show visible tabs)
      } else {
        return null;
      }
    }

    // In combined mode, replace the first occurrence of skills/experience/education with CombinedSection
    if (isCombined && COMBINED_IDS.has(sectionId)) {
      if (combinedRendered) return null; // Already rendered
      if (visibleCombinedTabOrder.length === 0) return null; // All tabs hidden
      combinedRendered = true;
      return (
        <CombinedSection
          key="combined"
          skills={portfolio.skills}
          experiences={portfolio.experiences}
          education={portfolio.education}
          tabOrder={visibleCombinedTabOrder}
          customTitle={sectionTitles.combined}
        />
      );
    }

    switch (sectionId) {
      case "hero":
        return <HeroSection key="hero" profile={portfolio.profile} />;
      case "about":
        return <AboutSection key="about" profile={portfolio.profile} customTitle={sectionTitles.about} />;
      case "projects":
        return <ProjectsSection key="projects" projects={portfolio.projects} customTitle={sectionTitles.projects} />;
      case "skills":
        return <SkillsSection key="skills" skills={portfolio.skills} customTitle={sectionTitles.skills} />;
      case "experience":
        return <ExperienceSection key="experience" experiences={portfolio.experiences} customTitle={sectionTitles.experience} />;
      case "education":
        return <EducationSection key="education" education={portfolio.education} customTitle={sectionTitles.education} />;
      case "contact":
        return <ContactSection key="contact" profile={portfolio.profile} customTitle={sectionTitles.contact} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar profile={portfolio.profile} hiddenSections={hiddenSections} />
      <main>
        {sections.map((sectionId: string) => renderSection(sectionId))}
      </main>
      <Footer profile={portfolio.profile} />
    </div>
  );
}
