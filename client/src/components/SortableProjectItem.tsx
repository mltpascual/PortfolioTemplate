/**
 * Sortable project item for drag-and-drop reordering in the admin panel.
 * Uses @dnd-kit/sortable for accessible drag-and-drop.
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

interface SortableProjectItemProps {
  project: {
    id: number;
    title: string;
    description: string | null;
    featured: number;
    tileSize?: string;
    sortOrder: number;
  };
  onEdit: (project: any) => void;
  onDelete: (id: number) => void;
}

export function SortableProjectItem({ project, onEdit, onDelete }: SortableProjectItemProps) {
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
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto" as any,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`warm-card p-4 flex items-center gap-4 ${isDragging ? "shadow-lg ring-2 ring-terracotta/30" : ""}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 rounded hover:bg-warm-100 transition-colors cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-warm-300" />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4
            className="text-base text-charcoal truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h4>
          {project.featured === 1 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta font-medium">
              Featured
            </span>
          )}
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600 capitalize">
            {project.tileSize || "medium"}
          </span>
        </div>
        <p
          className="text-sm text-charcoal-light truncate"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {project.description || "No description"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(project)}
          className="p-2 rounded-full hover:bg-warm-100 transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4 text-charcoal-light" />
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this project?")) onDelete(project.id);
          }}
          className="p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
}
