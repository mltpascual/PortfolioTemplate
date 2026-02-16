/*
 * DESIGN: Warm Monochrome Editorial
 * Single-page portfolio with sections: Hero, About, Skills, Projects, Experience, Contact, Footer.
 * Warm cream background, terracotta accents, DM Serif Display + DM Sans typography.
 * Pill-shaped rounded buttons throughout.
 * 
 * Data is fetched from the database via tRPC and passed down to each section.
 * If the database is empty, sensible defaults are used.
 * Theme settings (accent color, fonts) are fetched and applied dynamically.
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useThemeSettings } from "@/hooks/useThemeSettings";

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
  useThemeSettings();

  if (isLoading || !portfolio) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <Navbar profile={portfolio.profile} />
      <main>
        <HeroSection profile={portfolio.profile} />
        <AboutSection profile={portfolio.profile} />
        <SkillsSection skills={portfolio.skills} />
        <ProjectsSection projects={portfolio.projects} />
        <ExperienceSection experiences={portfolio.experiences} />
        <ContactSection profile={portfolio.profile} />
      </main>
      <Footer profile={portfolio.profile} />
    </div>
  );
}
