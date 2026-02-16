/*
 * DESIGN: Warm Monochrome Editorial
 * Single-page portfolio with sections: Hero, About, Skills, Projects, Experience, Contact, Footer.
 * Warm cream background, terracotta accents, DM Serif Display + DM Sans typography.
 * Pill-shaped rounded buttons throughout.
 * 
 * Data is fetched from the database via tRPC and passed down to each section.
 * If the database is empty, sensible defaults are used.
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

export default function Home() {
  const { portfolio } = usePortfolio();

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
