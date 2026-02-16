/*
 * DESIGN: Warm Monochrome Editorial
 * Masonry-style tile grid with configurable tile sizes (small, medium, large, wide).
 * Each project card adapts its grid span based on the admin-set tileSize.
 * Live iframe previews with fallback to static images.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight, Github, FolderOpen, Globe, Loader2 } from "lucide-react";
import type { PortfolioData } from "@/hooks/usePortfolio";
import { parseTags } from "@/hooks/usePortfolio";

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

/* ── Tile size → grid classes mapping ──────────────────────────── */
function getTileClasses(tileSize: string): { gridClass: string; aspectClass: string; layout: "overlay" | "stacked" } {
  switch (tileSize) {
    case "small":
      return { gridClass: "md:col-span-1", aspectClass: "aspect-square", layout: "overlay" };
    case "large":
      return { gridClass: "md:col-span-2 md:row-span-2", aspectClass: "aspect-square", layout: "stacked" };
    case "wide":
      return { gridClass: "md:col-span-2", aspectClass: "aspect-video", layout: "stacked" };
    case "medium":
    default:
      return { gridClass: "md:col-span-1", aspectClass: "aspect-[4/5]", layout: "stacked" };
  }
}

/* ── Project Preview ───────────────────────────────────────────── */
interface ProjectPreviewProps {
  liveUrl: string | null;
  imageUrl: string | null;
  title: string;
  fallbackIndex: number;
  displayMode: string;
  className?: string;
}

function ProjectPreview({ liveUrl, imageUrl, title, fallbackIndex, displayMode, className = "" }: ProjectPreviewProps) {
  const safeLiveUrl = sanitizeUrl(liveUrl);
  const safeImageUrl = sanitizeUrl(imageUrl);
  const mode = (displayMode === "live" && safeLiveUrl) ? "live" : "image";
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fallbackImage = safeImageUrl || FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];

  useEffect(() => {
    if (mode === "live" && safeLiveUrl) {
      setIframeLoaded(false);
      setIframeFailed(false);
      timeoutRef.current = setTimeout(() => setIframeFailed(true), 10000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mode, safeLiveUrl]);

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleIframeError = useCallback(() => {
    setIframeFailed(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const showLivePreview = mode === "live" && safeLiveUrl && !iframeFailed;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Live Preview (iframe) */}
      {showLivePreview && (
        <div className="absolute inset-0">
          {!iframeLoaded && (
            <div className="absolute inset-0 bg-warm-100 flex flex-col items-center justify-center z-10">
              <Loader2 className="w-6 h-6 text-terracotta animate-spin mb-1" />
              <span className="text-xs text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
                Loading...
              </span>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={safeLiveUrl!}
            title={`${title} - Live Preview`}
            className={`border-0 transition-opacity duration-300 ${iframeLoaded ? "opacity-100" : "opacity-0"}`}
            style={{
              transform: "scale(0.5)",
              transformOrigin: "top left",
              width: "200%",
              height: "200%",
              pointerEvents: "none",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      )}

      {/* Static Image (or fallback when iframe fails) */}
      {(!showLivePreview || (mode === "live" && iframeFailed)) && (
        <div className="absolute inset-0">
          {(safeImageUrl || fallbackImage) ? (
            <>
              <img
                src={safeImageUrl || fallbackImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {mode === "live" && iframeFailed && (
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-charcoal/70 backdrop-blur-sm text-white/90 text-[10px] px-2 py-1 rounded-full">
                  <Globe className="w-2.5 h-2.5" />
                  Unavailable
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-warm-100 flex items-center justify-center">
              <FolderOpen className="w-12 h-12 text-warm-300" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Tile Card (Overlay layout for small tiles) ───────────────── */
function OverlayTileCard({ project, index }: { project: PortfolioData["projects"][number]; index: number }) {
  const { ref, visible } = useInView();
  const tags = parseTags(project.tags);
  const safeLiveUrl = sanitizeUrl(project.liveUrl);
  const safeGithubUrl = sanitizeUrl(project.githubUrl);

  return (
    <div
      ref={ref}
      className={`group relative warm-card overflow-hidden transition-all duration-600 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Full-bleed preview */}
      <ProjectPreview
        liveUrl={project.liveUrl}
        imageUrl={project.imageUrl}
        title={project.title}
        fallbackIndex={index}
        displayMode={(project as any).displayMode || "live"}
        className="absolute inset-0"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent z-10" />

      {/* Content overlay */}
      <div className="relative z-20 h-full flex flex-col justify-end p-5 sm:p-6">
        {project.featured === 1 && (
          <span
            className="inline-flex self-start items-center px-2.5 py-0.5 rounded-full bg-terracotta/90 text-white text-[10px] font-semibold mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Featured
          </span>
        )}
        <h3
          className="text-lg sm:text-xl text-white mb-1.5 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/15 text-white/80 backdrop-blur-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          {safeLiveUrl && safeLiveUrl !== "#" && (
            <a
              href={safeLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors"
            >
              Demo
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
          {safeGithubUrl && safeGithubUrl !== "#" && (
            <a
              href={safeGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
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

/* ── Tile Card (Stacked layout for medium/large/wide) ─────────── */
function StackedTileCard({ project, index, tileSize }: { project: PortfolioData["projects"][number]; index: number; tileSize: string }) {
  const { ref, visible } = useInView();
  const tags = parseTags(project.tags);
  const safeLiveUrl = sanitizeUrl(project.liveUrl);
  const safeGithubUrl = sanitizeUrl(project.githubUrl);
  const isLarge = tileSize === "large";

  return (
    <div
      ref={ref}
      className={`group warm-card overflow-hidden transition-all duration-600 flex flex-col ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Preview area */}
      <div className={`relative overflow-hidden ${isLarge ? "flex-1 min-h-[200px]" : "aspect-video"}`}>
        <ProjectPreview
          liveUrl={project.liveUrl}
          imageUrl={project.imageUrl}
          title={project.title}
          fallbackIndex={index}
          displayMode={(project as any).displayMode || "live"}
        />
      </div>

      {/* Content */}
      <div className={`p-5 sm:p-6 flex flex-col ${isLarge ? "" : "flex-1"}`}>
        {project.featured === 1 && (
          <span
            className="inline-flex self-start items-center px-2.5 py-0.5 rounded-full bg-terracotta/10 text-terracotta text-[10px] font-semibold mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Featured
          </span>
        )}
        <h3
          className={`text-charcoal mb-2 leading-tight ${isLarge ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>
        {project.description && (
          <p
            className={`text-charcoal-light leading-relaxed mb-4 ${isLarge ? "text-sm line-clamp-4" : "text-xs sm:text-sm line-clamp-2"}`}
            style={{ fontFamily: "var(--font-body)" }}
          >
            {project.description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, isLarge ? 6 : 4).map((tag) => (
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

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          {safeLiveUrl && safeLiveUrl !== "#" && (
            <a
              href={safeLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
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
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
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
            Selected Work
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

        {/* Tile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 auto-rows-auto">
          {projects.map((project, i) => {
            const tileSize = (project as any).tileSize || "medium";
            const { gridClass, aspectClass, layout } = getTileClasses(tileSize);

            return (
              <div key={project.id} className={`${gridClass}`}>
                {layout === "overlay" ? (
                  <div className={aspectClass}>
                    <OverlayTileCard project={project} index={i} />
                  </div>
                ) : (
                  <StackedTileCard project={project} index={i} tileSize={tileSize} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
