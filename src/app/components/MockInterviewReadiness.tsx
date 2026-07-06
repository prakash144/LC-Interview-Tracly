"use client";

import type { MockInterviewItem } from "@/hooks/useInterviewReadiness";

interface MockInterviewReadinessProps {
  items: MockInterviewItem[];
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Ready";
  if (score >= 60) return "Almost";
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

const MockInterviewReadiness = ({ items }: MockInterviewReadinessProps) => {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="flex size-5 items-center justify-center rounded bg-zap/10">
          <svg className="size-3 text-zap" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xs font-semibold text-foreground">Mock Interview Readiness</h2>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const label = scoreLabel(item.overall);
          const color = scoreColor(item.overall);
          return (
            <div key={item.company} className="rounded-lg border border-border p-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground">{item.company}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>{label}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Coding", value: item.coding },
                  { label: "Revision", value: item.revision },
                  { label: "Topics", value: item.topics },
                ].map((f) => (
                  <div key={f.label} className="text-center">
                    <div className="text-[10px] font-semibold text-foreground tabular-nums">{f.value}%</div>
                    <div className="text-[9px] text-muted-foreground">{f.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${barColor(item.overall)}`} style={{ width: `${item.overall}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MockInterviewReadiness;
