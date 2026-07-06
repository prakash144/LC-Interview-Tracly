"use client";

import { AlertTriangle, ArrowRight, Layers, BarChart3, BookOpen } from "lucide-react";
import Link from "next/link";
import type { WeakTopic } from "@/hooks/useInterviewReadiness";

interface WeakAreasProps {
  weakTopics: WeakTopic[];
  weakDifficulties: { difficulty: string; completion: number }[];
  weakPatterns: { pattern: string; completion: number }[];
}

const diffColors: Record<string, string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-destructive",
};

const WeakAreas = ({ weakTopics, weakDifficulties, weakPatterns }: WeakAreasProps) => {
  const hasAny = weakTopics.length > 0 || weakDifficulties.length > 0 || weakPatterns.length > 0;
  if (!hasAny) return null;

  return (
    <div className="rounded-xl border border-border bg-card/80 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex size-6 items-center justify-center rounded bg-destructive/10">
          <AlertTriangle className="size-3.5 text-destructive" />
        </div>
        <h2 className="text-sm font-bold text-foreground">Weak Areas</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Topics */}
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="size-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Topics</span>
          </div>
          {weakTopics.length > 0 ? (
            <div className="space-y-1.5">
              {weakTopics.slice(0, 3).map((t) => (
                <div key={t.topic} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground truncate mr-2">{t.topic as string}</span>
                  <span className={`tabular-nums font-medium ${
                    t.completion < 30 ? "text-destructive" : t.completion < 60 ? "text-warning" : "text-muted-foreground"
                  }`}>{t.completion}%</span>
                </div>
              ))}
              {weakTopics.length > 3 && (
                <div className="text-[10px] text-muted-foreground/50">
                  +{weakTopics.length - 3} more
                </div>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground/50 py-1">No weak areas</div>
          )}
        </div>

        {/* Patterns */}
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="size-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Patterns</span>
          </div>
          {weakPatterns.length > 0 ? (
            <div className="space-y-1.5">
              {weakPatterns.slice(0, 3).map((p) => (
                <div key={p.pattern} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground truncate mr-2">{p.pattern}</span>
                  <span className={`tabular-nums font-medium ${
                    p.completion < 30 ? "text-destructive" : p.completion < 60 ? "text-warning" : "text-muted-foreground"
                  }`}>{p.completion}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground/50 py-1">No pattern data</div>
          )}
        </div>

        {/* Difficulty */}
        <div className="rounded-lg border border-border/50 bg-card/50 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <BarChart3 className="size-3.5 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Difficulty</span>
          </div>
          {weakDifficulties.length > 0 ? (
            <div className="space-y-1.5">
              {weakDifficulties.map((d) => (
                <div key={d.difficulty} className="flex items-center justify-between text-[11px]">
                  <span className={`font-medium ${diffColors[d.difficulty] ?? "text-muted-foreground"}`}>{d.difficulty}</span>
                  <span className="tabular-nums text-foreground font-medium">{d.completion}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground/50 py-1">No difficulty data</div>
          )}
        </div>
      </div>

      <Link
        href="/problems"
        className="inline-flex items-center gap-1.5 text-xs text-info hover:text-info/80 transition-colors mt-3"
      >
        <ArrowRight className="size-3" />
        Practice weak areas
      </Link>
    </div>
  );
};

export default WeakAreas;
