"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Briefcase, CheckCircle, CircleSlash, Filter } from "lucide-react";
import type { CompanyStat, DifficultyBreakdown, TopicBreakdown } from "@/hooks/useCompanyReadiness";
import type { Problem } from "@/lib/progressTypes";
import CompanyLogo from "@/components/data-display/CompanyLogo";

interface CompanyReadinessProps {
  stats: CompanyStat[];
  loading: boolean;
  selectedCompany: string | null;
  selectedProblems: Problem[] | null;
  difficultyBreakdown: DifficultyBreakdown | null;
  topicBreakdown: TopicBreakdown[] | null;
  solvedSet: Set<string>;
  onSelectCompany: (company: string | null) => void;
}

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"] as const;
const STATUSES = ["All", "Solved", "Unsolved"] as const;

const SkeletonCard = () => (
  <div className="rounded-lg border border-border bg-card p-3 animate-pulse">
    <div className="h-4 w-24 bg-secondary rounded mb-2" />
    <div className="h-2 bg-secondary rounded mb-2" />
    <div className="h-3 w-16 bg-secondary rounded" />
  </div>
);

const CompanyCard = ({ stat, onClick }: { stat: CompanyStat; onClick: () => void }) => {
  const pct = stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0;

  if (stat.loading) return <SkeletonCard />;

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-border bg-card p-3 text-left hover:bg-accent hover:border-foreground/20 transition-all cursor-pointer w-full"
    >
      <div className="flex items-center gap-2 mb-1.5 min-w-0">
        <CompanyLogo company={stat.company} size="sm" />
        <div className="text-xs font-bold text-foreground truncate" title={stat.company}>{stat.company}</div>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-1.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-success/60 to-success transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{stat.solved}/{stat.total}</span>
        <span className={`font-semibold tabular-nums ${pct >= 80 ? "text-success" : pct >= 50 ? "text-warning" : "text-muted-foreground"}`}>
          {pct}%
        </span>
      </div>
    </button>
  );
};

const DifficultyRow = ({ label, total, solved, color }: { label: string; total: number; solved: number; color: string }) => {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`w-12 font-medium ${color}`}>{label}</span>
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-current/60 to-current transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 text-right text-muted-foreground tabular-nums">{solved}/{total}</span>
      <span className={`w-8 text-right font-semibold tabular-nums ${color}`}>{pct}%</span>
    </div>
  );
};

function matchesDifficulty(difficulty: string, filter: string): boolean {
  if (filter === "All") return true;
  return difficulty === filter;
}

function matchesStatus(solved: boolean, filter: string): boolean {
  if (filter === "All") return true;
  return filter === "Solved" ? solved : !solved;
}

const CompanyReadiness = ({
                            stats,
                            loading,
                            selectedCompany,
                            selectedProblems,
                            difficultyBreakdown,
                            topicBreakdown,
                            solvedSet,
                            onSelectCompany,
                          }: CompanyReadinessProps) => {
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [topicFilter, setTopicFilter] = useState<string>("All");

  const uniqueTopics = useMemo(() => {
    if (!selectedProblems) return [];
    const set = new Set<string>();
    for (const p of selectedProblems) for (const t of p.topics) if (t) set.add(t);
    return Array.from(set).sort();
  }, [selectedProblems]);

  const filteredProblems = useMemo(() => {
    if (!selectedProblems) return [];
    return selectedProblems.filter((p) => {
      const dMatch = matchesDifficulty(p.difficulty, difficultyFilter);
      const sMatch = matchesStatus(solvedSet.has(p.problemId), statusFilter);
      const tMatch = topicFilter === "All" || p.topics.includes(topicFilter);
      return dMatch && sMatch && tMatch;
    });
  }, [selectedProblems, difficultyFilter, statusFilter, topicFilter, solvedSet]);

  const selectedStat = selectedCompany ? stats.find((s) => s.company === selectedCompany) : null;
  const overallPct = selectedStat && selectedStat.total > 0 ? Math.round((selectedStat.solved / selectedStat.total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          {selectedCompany ? (
            <button
              type="button"
              onClick={() => onSelectCompany(null)}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Back to companies"
            >
              <ArrowLeft className="size-3.5" />
            </button>
          ) : (
            <div className="flex size-5 items-center justify-center rounded bg-success/10">
              <Briefcase className="size-3 text-success" />
            </div>
          )}
          <h2 className="text-xs font-semibold text-foreground">
            {selectedCompany ? selectedCompany : "Company Readiness"}
          </h2>
        </div>
      </div>

      {/* Grid View */}
      {!selectedCompany && (
        <>
          {loading && stats.every((s) => s.loading) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {stats.map((s) => <SkeletonCard key={s.company} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {stats.map((s) => (
                <CompanyCard key={s.company} stat={s} onClick={() => onSelectCompany(s.company)} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Detail View */}
      {selectedCompany && (
        <div className="space-y-3">
          {selectedStat && (
            <div className="rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Overall Progress</span>
                <span className="text-sm font-bold text-foreground tabular-nums">{overallPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden mb-1">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-success/60 to-success transition-all duration-500"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <div className="text-[11px] text-muted-foreground tabular-nums">
                {selectedStat.solved} solved · {selectedStat.total - selectedStat.solved} remaining · {selectedStat.total} total
              </div>
            </div>
          )}

          {difficultyBreakdown && (
            <div className="rounded-lg border border-border p-2.5">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Difficulty</div>
              <div className="space-y-1.5">
                <DifficultyRow label="Easy" total={difficultyBreakdown.Easy} solved={difficultyBreakdown.easySolved} color="text-success" />
                <DifficultyRow label="Medium" total={difficultyBreakdown.Medium} solved={difficultyBreakdown.mediumSolved} color="text-warning" />
                <DifficultyRow label="Hard" total={difficultyBreakdown.Hard} solved={difficultyBreakdown.hardSolved} color="text-destructive" />
              </div>
            </div>
          )}

          {topicBreakdown && topicBreakdown.length > 0 && (
            <div className="rounded-lg border border-border p-2.5">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Topics</div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {topicBreakdown.slice(0, 20).map((t) => (
                  <div key={t.topic} className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground truncate mr-2">{t.topic}</span>
                    <span className="tabular-nums shrink-0">
                      <span className={t.solved > 0 ? "text-success font-medium" : "text-muted-foreground"}>{t.solved}</span>
                      <span className="text-muted-foreground/50">/{t.total}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="size-3 text-muted-foreground" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-md border border-border bg-secondary px-2 py-1 text-[11px] text-foreground outline-none"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-secondary px-2 py-1 text-[11px] text-foreground outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="rounded-md border border-border bg-secondary px-2 py-1 text-[11px] text-foreground outline-none max-w-[140px]"
            >
              <option value="All">All Topics</option>
              {uniqueTopics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Problem List */}
          {filteredProblems.length > 0 ? (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {filteredProblems.slice(0, 50).map((p) => (
                <div key={p.problemId} className="flex items-center gap-2 text-[11px] py-1 px-2 rounded hover:bg-accent transition-colors">
                  {solvedSet.has(p.problemId) ? (
                    <CheckCircle className="size-3 text-success shrink-0" />
                  ) : (
                    <CircleSlash className="size-3 text-muted-foreground/40 shrink-0" />
                  )}
                  <span className={`truncate flex-1 ${solvedSet.has(p.problemId) ? "text-foreground" : "text-muted-foreground/60"}`}>
                    {p.title || p.problemId}
                  </span>
                  <span className={`shrink-0 font-medium ${
                    p.difficulty === "Easy" ? "text-success" : p.difficulty === "Medium" ? "text-warning" : "text-destructive"
                  }`}>{p.difficulty}</span>
                </div>
              ))}
              {filteredProblems.length > 50 && (
                <div className="text-[10px] text-center text-muted-foreground/50 py-1">
                  +{filteredProblems.length - 50} more
                </div>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground/50 text-center py-4">
              No problems match the selected filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyReadiness;
