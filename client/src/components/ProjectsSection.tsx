/*
 * DESIGN: Warm Monochrome Editorial
 * Staggered project cards with live iframe previews, warm shadows.
 * Toggle between live preview and static screenshot. Falls back to image if iframe fails.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight, Github, FolderOpen, Globe, Image, Loader2 } from "lucide-react";
import type { PortfolioData } from "@/hooks/usePortfolio";
import { parseTags } from "@/hooks/usePortfolio";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
];

interface ProjectPreviewProps {
  liveUrl: string | null;
  imageUrl: string | null;
  title: string;
  fallbackIndex: number;
}

function ProjectPreview({ liveUrl, imageUrl, title, fallbackIndex }: ProjectPreviewProps) {
  const [mode, setMode] = useState<"live" | "image">(liveUrl ? "live" : "image");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fallbackImage = imageUrl || FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];

  // Reset state when mode changes
  useEffect(() => {
    if (mode === "live") {
      setIframeLoaded(false);
      setIframeFailed(false);

      // Set a timeout — if iframe doesn't load in 8 seconds, mark as failed
      timeoutRef.current = setTimeout(() => {
        setIframeFailed(true);
      }, 8000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mode]);

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleIframeError = useCallback(() => {
    setIframeFailed(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const showLivePreview = mode === "live" && liveUrl && !iframeFailed;
  const hasToggle = liveUrl && (imageUrl || fallbackImage);

  return (
    <div className="relative w-full h-64 lg:h-full min-h-[280px] overflow-hidden group">
      {/* Toggle Button */}
      {hasToggle && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-charcoal/70 backdrop-blur-sm rounded-full p-1 shadow-lg">
          <button
            onClick={() => setMode("live")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              mode === "live"
                ? "bg-terracotta text-white shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
            title="Live Preview"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live</span>
          </button>
          <button
            onClick={() => setMode("image")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              mode === "image"
                ? "bg-terracotta text-white shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
            title="Static Image"
          >
            <Image className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Image</span>
          </button>
        </div>
      )}

      {/* Live Preview (iframe) */}
      {showLivePreview && (
        <div className="absolute inset-0">
          {/* Loading spinner while iframe loads */}
          {!iframeLoaded && (
            <div className="absolute inset-0 bg-warm-100 flex flex-col items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-terracotta animate-spin mb-2" />
              <span
                className="text-xs text-charcoal-light"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Loading preview...
              </span>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={liveUrl}
            title={`${title} - Live Preview`}
            className={`w-full h-full border-0 transition-opacity duration-300 ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: "scale(0.5)",
              transformOrigin: "top left",
              width: "200%",
              height: "200%",
              pointerEvents: "none",
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
          {(imageUrl || fallbackImage) ? (
            <>
              <img
                src={imageUrl || fallbackImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Show "site unavailable" badge if iframe failed */}
              {mode === "live" && iframeFailed && (
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-charcoal/70 backdrop-blur-sm text-white/90 text-xs px-3 py-1.5 rounded-full">
                  <Globe className="w-3 h-3" />
                  Site unavailable — showing image
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-warm-100 flex items-center justify-center">
              <FolderOpen className="w-16 h-16 text-warm-300" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ProjectsSectionProps {
  projects: PortfolioData["projects"];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-padding">
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
            Selected Work
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="text-4xl md:text-5xl text-charcoal leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Projects I'm
              <br />
              <span className="text-terracotta italic">proud of.</span>
            </h2>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-12">
          {projects.map((project, i) => {
            const tags = parseTags(project.tags);
            return (
              <div
                key={project.id}
                className={`warm-card overflow-hidden transition-all duration-600 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${150 + i * 150}ms` }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  {/* Preview */}
                  <div
                    className={`lg:col-span-3 overflow-hidden ${
                      i % 2 !== 0 ? "lg:order-2" : ""
                    }`}
                  >
                    <ProjectPreview
                      liveUrl={project.liveUrl}
                      imageUrl={project.imageUrl}
                      title={project.title}
                      fallbackIndex={i}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center ${
                      i % 2 !== 0 ? "lg:order-1" : ""
                    }`}
                  >
                    {project.featured === 1 && (
                      <span
                        className="inline-flex self-start items-center px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold mb-4"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Featured
                      </span>
                    )}
                    <h3
                      className="text-2xl md:text-3xl text-charcoal mb-3"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="text-charcoal-light leading-relaxed mb-6 text-sm md:text-base"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {project.description}
                    </p>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
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

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-auto">
                      {project.liveUrl && project.liveUrl !== "#" && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pill-primary-sm gap-2"
                        >
                          Live Demo
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                      {project.githubUrl && project.githubUrl !== "#" && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
                          aria-label="View source code"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
