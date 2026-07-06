"use client";

import type { PatternCoverage as PatternCoverageData } from "@/hooks/useInterviewReadiness";

interface PatternCoverageProps {
  patterns: PatternCoverageData[];
}

const PatternCoverage = ({ patterns }: PatternCoverageProps) => {
  if (patterns.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="flex size-5 items-center justify-center rounded bg-info/10">
          <svg className="size-3 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h2 className="text-xs font-semibold text-foreground">Pattern Coverage</h2>
      </div>
      <div className="space-y-2">
        {patterns.slice(0, 10).map((p) => {
          const color = p.completion >= 80 ? "bg-success" : p.completion >= 50 ? "bg-warning" : "bg-destructive";
          return (
            <div key={p.pattern} className="flex items-center gap-2 text-[11px]">
              <span className="w-28 shrink-0 text-muted-foreground truncate" title={p.pattern}>{p.pattern}</span>
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${p.completion}%` }} />
              </div>
              <span className="w-7 shrink-0 text-right font-semibold text-foreground tabular-nums">{p.completion}%</span>
              <span className="w-10 shrink-0 text-right text-[10px] text-muted-foreground/50 tabular-nums">{p.solved}/{p.total}</span>
            </div>
          );
        })}
      </div>
      {patterns.length > 10 && (
        <div className="text-[10px] text-center text-muted-foreground/50 mt-2">
          +{patterns.length - 10} more patterns
        </div>
      )}
    </div>
  );
};

export default PatternCoverage;
