/**
 * Sortable project tile card for drag-and-drop reordering in the admin panel.
 * Displays as a tile with image thumbnail, title, badges, and action buttons.
 * Uses @dnd-kit/sortable for accessible drag-and-drop.
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, FolderOpen, ExternalLink, Github, Copy } from "lucide-react";

interface SortableProjectItemProps {
  project: {
    id: number;
    title: string;
    description: string | null;
    imageUrl?: string | null;
    liveUrl?: string | null;
    githubUrl?: string | null;
    featured: number;
    tileSize?: string;
    tags?: string | null;
    sortOrder: number;
  };
  onEdit: (project: any) => void;
  onDelete: (id: number) => void;
  onDuplicate?: (project: any) => void;
}

export function SortableProjectItem({ project, onEdit, onDelete, onDuplicate }: SortableProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : "auto" as any,
  };

  const tags = project.tags
    ? project.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`warm-card overflow-hidden group ${isDragging ? "shadow-lg ring-2 ring-terracotta/30" : ""}`}
    >
      {/* Image thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-warm-50">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen className="w-10 h-10 text-warm-300" />
          </div>
        )}

        {/* Drag handle overlay — top left */}
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Badges overlay — top right */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          {project.featured === 1 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-terracotta/90 text-white font-semibold backdrop-blur-sm">
              Featured
            </span>
          )}
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-black/40 text-white backdrop-blur-sm capitalize">
            {project.tileSize || "medium"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h4
          className="text-sm sm:text-base text-charcoal truncate mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h4>
        {project.description && (
          <p
            className="text-xs text-charcoal-light line-clamp-2 mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {project.description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-warm-100 text-charcoal-light border border-warm-200/60"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-warm-100 text-charcoal-light">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {project.liveUrl && project.liveUrl !== "#" && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full hover:bg-warm-100 transition-colors"
                title="Open live site"
              >
                <ExternalLink className="w-3.5 h-3.5 text-charcoal-light" />
              </a>
            )}
            {project.githubUrl && project.githubUrl !== "#" && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full hover:bg-warm-100 transition-colors"
                title="Open GitHub"
              >
                <Github className="w-3.5 h-3.5 text-charcoal-light" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-1">
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(project)}
                className="p-1.5 rounded-full hover:bg-warm-100 transition-colors"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5 text-charcoal-light" />
              </button>
            )}
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-full hover:bg-warm-100 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5 text-charcoal-light" />
            </button>
            <button
              onClick={() => {
                if (confirm("Delete this project?")) onDelete(project.id);
              }}
              className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
