"use client";

import { Swords } from "lucide-react";
import type { MockInterviewItem } from "@/hooks/useInterviewReadiness";

interface MockInterviewSectionProps {
  items: MockInterviewItem[];
  selectedCompany?: string | null;
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Ready";
  if (score >= 60) return "Almost Ready";
  if (score >= 40) return "Needs Work";
  return "Not Ready";
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  if (score >= 40) return "text-orange-400";
  return "text-destructive";
}

function barColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  if (score >= 40) return "bg-orange-400";
  return "bg-destructive";
}

const MiniBar = ({ label, value }: { label: string; value: number }) => {
  const color = value >= 80 ? "bg-success" : value >= 60 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-14 text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-7 text-right font-semibold text-foreground tabular-nums">{value}%</span>
    </div>
  );
};

const MockInterviewSection = ({ items, selectedCompany }: MockInterviewSectionProps) => {
  // Find the relevant item: if company selected, show that; otherwise show the best overall
  const activeItem = selectedCompany
    ? items.find((i) => i.company === selectedCompany)
    : items.length > 0
      ? [...items].sort((a, b) => b.overall - a.overall)[0]
      : null;

  if (!activeItem) return null;

  const label = scoreLabel(activeItem.overall);
  const color = scoreColor(activeItem.overall);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex size-6 items-center justify-center rounded bg-zap/10">
          <Swords className="size-3.5 text-zap" />
        </div>
        <h2 className="text-sm font-bold text-foreground">Mock Interview Readiness</h2>
        {selectedCompany && (
          <span className="text-[10px] text-muted-foreground/50 ml-1">· {selectedCompany}</span>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-muted-foreground">Overall Status</div>
          <div className={`text-lg font-bold ${color}`}>{label}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-2xl font-bold text-foreground tabular-nums">{activeItem.overall}%</div>
          <div className="text-[10px] text-muted-foreground">ready</div>
        </div>
      </div>

      <div className="h-2 rounded-full bg-secondary overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor(activeItem.overall)}`}
          style={{ width: `${activeItem.overall}%` }}
        />
      </div>

      <div className="space-y-1.5">
        <MiniBar label="Coding" value={activeItem.coding} />
        <MiniBar label="Revision" value={activeItem.revision} />
        <MiniBar label="Topics" value={activeItem.topics} />
      </div>
    </div>
  );
};

export default MockInterviewSection;
