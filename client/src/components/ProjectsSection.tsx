/*
 * DESIGN: Warm Monochrome Editorial
 * 2-column grid with stacked cards: image on top, content below.
 * Natural card heights — cards grow based on content.
 * All projects display as static screenshot images (no iframe previews).
 */

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, FolderOpen } from "lucide-react";
import type { PortfolioData } from "@/hooks/usePortfolio";
import { parseTags } from "@/hooks/usePortfolio";
import { trpc } from "@/lib/trpc";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
];

/** Sanitize a URL to only allow http(s) protocols. Blocks javascript:, data:, etc. */
function sanitizeUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
    return null;
  } catch {
    return null;
  }
}

/* ── Hook: observe a single element ────────────────────────────── */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ── Project Image ────────────────────────────────────────────── */
interface ProjectImageProps {
  imageUrl: string | null;
  title: string;
  fallbackIndex: number;
}

function ProjectImage({ imageUrl, title, fallbackIndex }: ProjectImageProps) {
  const safeImageUrl = sanitizeUrl(imageUrl);
  const fallbackImage = FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];

  return (
    <div className="relative w-full overflow-hidden rounded-t-xl">
      {(safeImageUrl || fallbackImage) ? (
        <img
          src={safeImageUrl || fallbackImage}
          alt={title}
          className="w-full aspect-video object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full aspect-video bg-warm-100 flex items-center justify-center">
          <FolderOpen className="w-12 h-12 text-warm-300" />
        </div>
      )}
    </div>
  );
}

/* ── Analytics hook ───────────────────────────────────────────── */
function useTrackClick() {
  const trackMutation = trpc.analytics.track.useMutation();
  return (projectId: number) => {
    trackMutation.mutate({ projectId, eventType: "click" });
  };
}

/* ── Project Card (stacked: image on top, content below) ──────── */
function ProjectCard({ project, index }: { project: PortfolioData["projects"][number]; index: number }) {
  const { ref, visible } = useInView();
  const tags = parseTags(project.tags);
  const safeLiveUrl = sanitizeUrl(project.liveUrl);
  const safeGithubUrl = sanitizeUrl(project.githubUrl);
  const trackClick = useTrackClick();

  return (
    <div
      ref={ref}
      className={`group warm-card overflow-hidden transition-all duration-600 flex flex-col ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Image */}
      <ProjectImage
        imageUrl={project.imageUrl}
        title={project.title}
        fallbackIndex={index}
      />

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {project.featured === 1 && (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-semibold mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Featured
          </span>
        )}
        <h3
          className="text-lg sm:text-xl text-charcoal mb-2 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>
        {project.description && (
          <p
            className="text-charcoal-light text-sm leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {project.description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-warm-100 text-charcoal-light border border-warm-200/60"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Spacer to push actions to bottom */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          {safeLiveUrl && safeLiveUrl !== "#" && (
            <a
              href={safeLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(project.id)}
              className="pill-primary-sm gap-1.5 text-xs"
            >
              Live Demo
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
          {safeGithubUrl && safeGithubUrl !== "#" && (
            <a
              href={safeGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(project.id)}
              className="p-2 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
              aria-label="View source code"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Projects Section ──────────────────────────────────────────── */
interface ProjectsSectionProps {
  projects: PortfolioData["projects"];
  customTitle?: string;
}

export default function ProjectsSection({ projects, customTitle }: ProjectsSectionProps) {
  const { ref: headerRef, visible: headerVisible } = useInView();

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`mb-12 sm:mb-16 transition-all duration-600 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase text-terracotta mb-4 block"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {customTitle || "Selected Work"}
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl text-charcoal leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Projects I'm
              <br />
              <span className="text-terracotta italic">proud of.</span>
            </h2>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
