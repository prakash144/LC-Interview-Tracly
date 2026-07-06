"use client";

import { CheckCircle2, Circle, Zap, BookOpen, Target, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { ActionItem } from "@/hooks/useInterviewReadiness";

interface ActionPlanProps {
  actions: ActionItem[];
}

const typeIcons: Record<string, typeof Zap> = {
  solve: Zap,
  revise: RefreshCw,
  practice: BookOpen,
  complete: Target,
};

const typeColors: Record<string, string> = {
  solve: "text-zap bg-zap/10 border-zap/20",
  revise: "text-info bg-info/10 border-info/20",
  practice: "text-success bg-success/10 border-success/20",
  complete: "text-warning bg-warning/10 border-warning/20",
};

const ActionPlan = ({ actions }: ActionPlanProps) => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  if (actions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/80 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-6 items-center justify-center rounded bg-zap/10">
            <Zap className="size-3.5 text-zap" />
          </div>
          <h2 className="text-sm font-bold text-foreground">Today&apos;s Action Plan</h2>
        </div>
        <div className="text-xs text-muted-foreground/50 text-center py-6">
          No actions needed &mdash; you&apos;re on track!
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/80 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex size-6 items-center justify-center rounded bg-zap/10">
          <Zap className="size-3.5 text-zap" />
        </div>
        <h2 className="text-sm font-bold text-foreground">Today&apos;s Action Plan</h2>
      </div>
      <div className="space-y-2">
        {actions.map((action) => {
          const isDone = completed.has(action.id);
          const Icon = typeIcons[action.type] ?? Zap;
          const colorClasses = typeColors[action.type] ?? "text-muted-foreground bg-secondary/50 border-border/50";

          return (
            <div
              key={action.id}
              className={`rounded-lg border p-3 transition-all duration-200 ${
                isDone
                  ? "border-success/20 bg-success/5 opacity-60"
                  : `${colorClasses} hover:shadow-sm`
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCompleted((prev) => {
                      const next = new Set(prev);
                      if (next.has(action.id)) next.delete(action.id);
                      else next.add(action.id);
                      return next;
                    });
                  }}
                  className="mt-0.5 shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="size-4 text-success" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`flex size-5 items-center justify-center rounded ${colorClasses.split(" ").slice(1).join(" ")}`}>
                      <Icon className="size-3" />
                    </div>
                    <span className={`text-xs font-semibold ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {action.description}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5 ml-7">
                    {action.explanation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionPlan;
