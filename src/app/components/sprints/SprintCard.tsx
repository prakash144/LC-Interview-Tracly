"use client";

import { ChevronRight, Play, CheckCircle2, CalendarDays, Target } from "lucide-react";
import type { Sprint, SprintTask } from "@/lib/sprints";
import { Button } from "@/components/ui/button";

interface SprintCardProps {
  sprint: Sprint;
  tasks?: SprintTask[];
  onClick?: (id: string) => void;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  planned: { label: "Planned", color: "text-muted-foreground", bg: "bg-secondary" },
  active: { label: "Active", color: "text-success", bg: "bg-success/15" },
  completed: { label: "Completed", color: "text-info", bg: "bg-info/15" },
};

const SprintCard = ({ sprint, tasks = [], onClick, onStart, onComplete, onDelete }: SprintCardProps) => {
  const cfg = statusConfig[sprint.status];
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      onClick={() => onClick?.(sprint.id)}
      className="group relative rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors p-4 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground truncate">{sprint.name}</h3>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
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
        <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors shrink-0 mt-1" />
      </div>

      <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
        <CalendarDays className="size-3" />
        <span>{sprint.startDate} → {sprint.endDate}</span>
        {sprint.retro && (
          <span className="text-success text-[10px]">✓ Retro done</span>
        )}
      </div>

      {total > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>{done}/{total} tasks</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-success transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {sprint.status !== "completed" && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
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
              className="h-6 text-[10px] ml-auto text-muted-foreground border-border bg-secondary hover:bg-accent cursor-pointer rounded-md"
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
