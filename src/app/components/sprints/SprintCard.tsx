"use client";

import { ChevronRight, Play, CheckCircle2, CalendarDays, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sprint, SprintTaskV2 } from "@/lib/sprints";
import { Button } from "@/components/ui/button";

interface SprintCardProps {
  sprint: Sprint;
  tasks?: SprintTaskV2[];
  onClick?: (id: string) => void;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  planned: { label: "Planned", color: "text-muted-foreground", bg: "bg-secondary", dot: "bg-muted-foreground/40" },
  active: { label: "Active", color: "text-success", bg: "bg-success/15", dot: "bg-success" },
  completed: { label: "Completed", color: "text-info", bg: "bg-info/15", dot: "bg-info" },
};

const SprintCard = ({ sprint, tasks = [], onClick, onStart, onComplete, onDelete }: SprintCardProps) => {
  const cfg = statusConfig[sprint.status];
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      onClick={() => onClick?.(sprint.id)}
      className={cn(
        "group relative rounded-lg border border-border/70 bg-card/90 p-4 shadow-sm transition-all duration-200 cursor-pointer",
        "hover:border-foreground/15 hover:shadow-md hover:shadow-foreground/[0.02] hover:-translate-y-0.5",
        sprint.status === "active" && "border-success/20 bg-success/[0.02]"
      )}
    >
      {/* Status indicator line */}
      <div className={cn(
        "absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-all duration-300",
        sprint.status === "active" ? "bg-success" : sprint.status === "completed" ? "bg-info" : "bg-border",
        "group-hover:opacity-80"
      )} />

      <div className="flex items-start justify-between gap-3 pl-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground truncate">{sprint.name}</h3>
            <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-medium", cfg.color, cfg.bg)}>
              {cfg.label}
            </span>
          </div>
          {sprint.goal && (
            <p className="text-xs text-muted-foreground/70 line-clamp-1 flex items-center gap-1">
              <Target className="size-3 shrink-0" />
              {sprint.goal}
            </p>
          )}
        </div>
        <div className={cn(
          "size-6 rounded-md flex items-center justify-center transition-all shrink-0",
          "text-muted-foreground/30 group-hover:text-foreground/50 group-hover:bg-accent"
        )}>
          <ChevronRight className="size-4" />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 pl-3 text-[11px] text-muted-foreground/60">
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3" />
          {sprint.startDate} → {sprint.endDate}
        </span>
        {sprint.retro && (
          <span className="text-success/70 text-[10px] flex items-center gap-0.5">
            <Sparkles className="size-2.5" />
            Retro done
          </span>
        )}
      </div>

      {total > 0 && (
        <div className="mt-3 pl-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground/60 mb-1.5">
            <span className="flex items-center gap-2">
              <span className="text-foreground/70 font-medium">{done}/{total}</span> tasks
              {inProgress > 0 && (
                <span className="text-warning/70">{inProgress} active</span>
              )}
            </span>
            <span className={cn(
              "font-medium tabular-nums",
              pct >= 80 ? "text-success" : pct >= 50 ? "text-warning" : "text-muted-foreground/60"
            )}>
              {pct}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary/80">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                pct >= 80 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-info"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {!total && sprint.status === "planned" && (
        <div className="mt-3 pl-3">
          <p className="text-[10px] text-muted-foreground/40 italic">No tasks yet</p>
        </div>
      )}

      {sprint.status !== "completed" && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/50 pl-3">
          {sprint.status === "planned" && onStart && (
            <Button
              onClick={(e) => { e.stopPropagation(); onStart(sprint.id); }}
              className="h-6 text-[10px] bg-success/15 text-success hover:bg-success/25 cursor-pointer rounded-md"
            >
              <Play className="size-3 mr-1" />
              Start Sprint
            </Button>
          )}
          {sprint.status === "active" && onComplete && (
            <Button
              onClick={(e) => { e.stopPropagation(); onComplete(sprint.id); }}
              className="h-6 text-[10px] bg-info/15 text-info hover:bg-info/25 cursor-pointer rounded-md"
            >
              <CheckCircle2 className="size-3 mr-1" />
              Complete
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={(e) => { e.stopPropagation(); onDelete(sprint.id); }}
              variant="outline"
              className="h-6 text-[10px] ml-auto text-muted-foreground/50 border-border/50 bg-transparent hover:bg-accent cursor-pointer rounded-md"
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SprintCard;
