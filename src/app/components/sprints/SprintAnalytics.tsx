"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { BarChart3, Clock, CheckCircle2, Layers, TrendingUp } from "lucide-react";
import type { SprintTaskV2 } from "@/lib/sprints";

interface SprintAnalyticsProps {
  tasks: SprintTaskV2[];
}

const SprintAnalytics = ({ tasks }: SprintAnalyticsProps) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const review = tasks.filter((t) => t.status === "review").length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const backlog = tasks.filter((t) => t.status === "backlog").length;

    const estimatedHours = tasks.reduce((s, t) => s + (t.estimatedHours || 0), 0);
    const actualHours = tasks.reduce((s, t) => s + (t.actualHours || 0), 0);

    const trackBreakdown: Record<string, { count: number; done: number; estimatedHours: number; actualHours: number }> = {};
    for (const t of tasks) {
      if (!t.track) continue;
      if (!trackBreakdown[t.track]) trackBreakdown[t.track] = { count: 0, done: 0, estimatedHours: 0, actualHours: 0 };
      trackBreakdown[t.track].count++;
      trackBreakdown[t.track].estimatedHours += t.estimatedHours || 0;
      trackBreakdown[t.track].actualHours += t.actualHours || 0;
      if (t.status === "done") trackBreakdown[t.track].done++;
    }

    const priorityBreakdown = {
      critical: tasks.filter((t) => t.priority === "critical").length,
      high: tasks.filter((t) => t.priority === "high").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      low: tasks.filter((t) => t.priority === "low").length,
    };

    return { total, done, inProgress, review, todo, backlog, estimatedHours, actualHours, trackBreakdown, priorityBreakdown };
  }, [tasks]);

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="flex items-center gap-2">
        <BarChart3 className="size-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Sprint Analytics</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border/40 bg-card/30 p-3 text-center">
          <p className="text-lg font-semibold text-foreground tabular-nums">{stats.total}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">Total Tasks</p>
        </div>
        <div className="rounded-lg border border-border/40 bg-card/30 p-3 text-center">
          <p className="text-lg font-semibold text-success tabular-nums">{stats.done}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">Completed</p>
        </div>
        <div className="rounded-lg border border-border/40 bg-card/30 p-3 text-center">
          <p className="text-lg font-semibold text-warning tabular-nums">{stats.estimatedHours}h</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">Estimated</p>
        </div>
        <div className="rounded-lg border border-border/40 bg-card/30 p-3 text-center">
          <p className="text-lg font-semibold text-info tabular-nums">{stats.actualHours}h</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">Actual</p>
        </div>
      </div>

      {Object.keys(stats.trackBreakdown).length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium flex items-center gap-1.5">
            <Layers className="size-3" />
            Track Breakdown
          </p>
          <div className="space-y-1.5">
            {Object.entries(stats.trackBreakdown).map(([track, data]) => {
              const pct = stats.total > 0 ? Math.round((data.count / stats.total) * 100) : 0;
              const donePct = data.count > 0 ? Math.round((data.done / data.count) * 100) : 0;
              return (
                <div key={track} className="flex items-center gap-2 text-xs">
                  <span className="w-24 truncate text-muted-foreground">{track}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden relative">
                    <div className="h-full rounded-full bg-primary/20" style={{ width: `${pct}%` }} />
                    <div className="absolute inset-0 h-full rounded-full bg-success/50" style={{ width: `${donePct}%` }} />
                  </div>
                  <span className="w-8 text-right text-[10px] text-muted-foreground/60 tabular-nums">{data.count}</span>
                  <span className="w-8 text-right text-[10px] text-success/80 tabular-nums">{donePct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium flex items-center gap-1.5">
          <TrendingUp className="size-3" />
          Priority Distribution
        </p>
        <div className="flex gap-1.5 text-xs">
          {(["critical", "high", "medium", "low"] as const).map((p) => {
            const count = stats.priorityBreakdown[p];
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            const colors: Record<string, string> = {
              critical: "bg-destructive/15 text-destructive border-destructive/20",
              high: "bg-warning/15 text-warning border-warning/20",
              medium: "bg-info/15 text-info border-info/20",
              low: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
            };
            return (
              <div key={p} className={cn("flex-1 rounded-lg border p-2 text-center", colors[p])}>
                <p className="text-sm font-semibold tabular-nums">{count}</p>
                <p className="text-[9px] uppercase tracking-wider mt-0.5">{p}</p>
                <p className="text-[9px] opacity-70">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] text-muted-foreground/50 pt-1">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="size-3" /> {stats.done} done
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" /> {stats.inProgress} in progress
        </span>
        <span className="flex items-center gap-1">
          <BarChart3 className="size-3" /> {stats.review} in review
        </span>
        <span>{stats.todo} to do · {stats.backlog} backlog</span>
      </div>
    </div>
  );
};

export default SprintAnalytics;
