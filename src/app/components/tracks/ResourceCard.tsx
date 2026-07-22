"use client";

import { Star, PencilLine, Trash2, Calendar } from "lucide-react";
import type { KnowledgeResource, ResourceStatus, UserResourceProgress } from "@/lib/knowledgeBase";
import { STATUS_COLORS, STATUS_LABELS, LINK_TYPE_ICONS, LINK_LABELS } from "@/lib/knowledgeBase";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";
import CompanyBadge from "@/components/data-display/CompanyBadge";
import ResourceNotesDialog from "./ResourceNotesDialog";

interface ResourceCardProps {
  resource: KnowledgeResource;
  progress?: UserResourceProgress;
  progressEnabled?: boolean;
  onRequireAuth?: () => void;
  onStatusChange?: (resourceId: string, status: ResourceStatus) => void;
  onToggleRevision?: (resourceId: string) => void;
  onSaveNotes?: (resourceId: string, notes: string) => void;
  onEdit?: (resource: KnowledgeResource) => void;
  onDelete?: (resourceId: string) => void;
}

const statusOptions: { value: ResourceStatus; label: string }[] = [
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const ResourceCard = ({
  resource,
  progress,
  progressEnabled = false,
  onRequireAuth,
  onStatusChange,
  onToggleRevision,
  onSaveNotes,
  onEdit,
  onDelete,
}: ResourceCardProps) => {
  const currentStatus = progress?.status ?? "not-started";
  const inRevision = Boolean(progress?.inRevisionList);
  const personalNotes = progress?.personalNotes ?? "";

  const handleStatusClick = () => {
    if (!progressEnabled) { onRequireAuth?.(); return; }
    const idx = statusOptions.findIndex((o) => o.value === currentStatus);
    const next = statusOptions[(idx + 1) % statusOptions.length].value;
    onStatusChange?.(resource.id, next);
  };

  return (
    <div className="group rounded-xl border border-border bg-card hover:shadow-sm hover:border-foreground/20 transition-all">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <CompanyBadge company={resource.company} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-semibold text-foreground truncate">{resource.title}</h4>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(resource)}
                  className="opacity-0 group-hover:opacity-100 shrink-0 p-0.5 text-muted-foreground hover:text-foreground transition-all"
                  title="Edit"
                >
                  <PencilLine className="size-3" />
                </button>
              )}
              {onDelete && !resource.id.startsWith("sample-") && (
                <button
                  type="button"
                  onClick={() => onDelete(resource.id)}
                  className="opacity-0 group-hover:opacity-100 shrink-0 p-0.5 text-muted-foreground hover:text-destructive transition-all"
                  title="Delete"
                >
                  <Trash2 className="size-3" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <DifficultyBadge difficulty={resource.difficulty} size="sm" />
              {resource.askedAt && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/60 bg-secondary px-1.5 py-0.5 rounded-full">
                  <Calendar className="size-2.5" />
                  {resource.askedAt}
                </span>
              )}
              {resource.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/50">
                  {tag}
                </span>
              ))}
              {resource.tags.length > 4 && (
                <span className="text-[10px] text-muted-foreground/50">+{resource.tags.length - 4}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {resource.notes && (
        <div className="px-4 pb-2">
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed line-clamp-2 border-l-2 border-border/50 pl-2.5">
            {resource.notes}
          </p>
        </div>
      )}

      {/* Resource Links */}
      {resource.resourceLinks.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {resource.resourceLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 bg-secondary/80 hover:bg-accent text-[10px] text-muted-foreground hover:text-foreground transition-colors border border-border/50"
              title={link.label}
            >
              <span>{LINK_TYPE_ICONS[link.type]}</span>
              <span>{link.label || LINK_LABELS[link.type]}</span>
            </a>
          ))}
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center gap-1 border-t border-border/50 px-4 py-2 bg-secondary/30 rounded-b-xl">
        <button
          type="button"
          onClick={handleStatusClick}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors cursor-pointer ${STATUS_COLORS[currentStatus]}`}
          title="Click to cycle status"
        >
          {STATUS_LABELS[currentStatus]}
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => { if (!progressEnabled) { onRequireAuth?.(); return; } onToggleRevision?.(resource.id); }}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-colors cursor-pointer ${
            inRevision
              ? "bg-amber-500/20 text-amber-400"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
          title={inRevision ? "Remove from bookmarks" : "Bookmark for quick access"}
        >
          <Star className={`size-3 ${inRevision ? "fill-amber-400" : ""}`} />
          {inRevision ? "Bookmarked" : "Bookmark"}
        </button>

        <ResourceNotesDialog
          resourceId={resource.id}
          resourceTitle={resource.title}
          notes={personalNotes}
          disabled={!progressEnabled}
          onRequireAuth={onRequireAuth}
          onSave={onSaveNotes ?? (() => {})}
        />
      </div>
    </div>
  );
};

export default ResourceCard;
