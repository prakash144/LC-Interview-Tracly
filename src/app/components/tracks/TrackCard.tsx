"use client";

import { ChevronRight, Archive, RotateCcw } from "lucide-react";
import type { Track } from "@/lib/tracks";

interface TrackCardProps {
  track: Track;
  total?: number;
  completed?: number;
  inRevision?: number;
  onClick?: (id: string) => void;
  onArchive?: (archived: boolean) => void;
}

const TrackCard = ({ track, total = 0, completed = 0, inRevision = 0, onClick, onArchive }: TrackCardProps) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      onClick={() => { if (!track.archived) onClick?.(track.id); }}
      className={`group block rounded-lg border bg-card/90 p-5 shadow-sm backdrop-blur transition-all duration-200 ${track.archived ? "border-dashed border-muted-foreground/20 opacity-60 hover:opacity-80" : "border-border/70 hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-card hover:shadow-md cursor-pointer"}`}
    >
      <div className="flex items-start gap-4">
        <div className="relative flex size-12 shrink-0 items-center justify-center rounded-md border border-border/70 bg-secondary/80 text-2xl shadow-inner">
          {track.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-base font-bold ${track.color} ${track.archived ? "line-through decoration-muted-foreground/30" : ""}`}>{track.name}</h3>
            {track.archived && <span className="rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground/50">Archived</span>}
          </div>
          <p className="text-xs text-muted-foreground/80 line-clamp-1 mb-2">{track.shortDescription}</p>
          {total > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{completed}/{total}</span>
                <span className="w-px h-2.5 bg-border" />
                <span>{pct}%</span>
                {inRevision > 0 && (
                  <>
                    <span className="w-px h-2.5 bg-border" />
                    <span className="text-cyan-400">{inRevision} revising</span>
                  </>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary/80">
                <div className="h-full rounded-full bg-gradient-to-r from-success to-info transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
          {onArchive && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onArchive(!track.archived); }}
              className="opacity-0 group-hover:opacity-100 size-6 flex items-center justify-center rounded text-muted-foreground/30 hover:text-foreground hover:bg-accent transition-all"
              aria-label={track.archived ? "Restore track" : "Archive track"}
            >
              {track.archived ? <RotateCcw className="size-3" /> : <Archive className="size-3" />}
            </button>
          )}
          <ChevronRight className="size-5 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
