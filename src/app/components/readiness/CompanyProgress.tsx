"use client";

import { useState, useMemo } from "react";
import { Building2, ChevronRight, Search, Loader2 } from "lucide-react";
import CompanyLogo from "@/components/data-display/CompanyLogo";
import type { CompanyStat } from "@/hooks/useCompanyReadiness";

interface CompanyProgressProps {
  stats: CompanyStat[];
  allCompanies: string[];
  loading: boolean;
  selectedCompany: string | null;
  onSelectCompany: (company: string | null) => void;
  onLoadCompany: (company: string) => void;
  fetchingCompany: string | null;
}

const SkeletonRow = () => (
  <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
    <div className="size-5 rounded-full bg-secondary" />
    <div className="flex-1 space-y-1">
      <div className="h-2.5 w-20 bg-secondary rounded" />
      <div className="h-1.5 bg-secondary rounded" />
    </div>
    <div className="h-3 w-8 bg-secondary rounded" />
  </div>
);

const CompanyProgress = ({ stats, allCompanies, loading, selectedCompany, onSelectCompany, onLoadCompany, fetchingCompany }: CompanyProgressProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const loadedSet = useMemo(() => new Set(stats.map((s) => s.company)), [stats]);

  const visibleCompanies = useMemo(() => {
    const lower = searchQuery.toLowerCase().trim();
    if (!lower) {
      const loaded = stats.map((s) => s.company);
      const suggestions = allCompanies
        .filter((c) => !loadedSet.has(c))
        .slice(0, 3);
      return [...loaded, ...suggestions];
    }
    return allCompanies
      .filter((c) => c.toLowerCase().includes(lower))
      .slice(0, 20);
  }, [searchQuery, stats, allCompanies, loadedSet]);

  return (
    <div className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex size-6 items-center justify-center rounded bg-success/10">
          <Building2 className="size-3.5 text-success" />
        </div>
        <h2 className="text-sm font-bold text-foreground">Company Progress</h2>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search companies..."
          className="w-full rounded-lg border border-border bg-secondary py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/20 transition-colors"
        />
      </div>

      {loading && stats.length === 0 ? (
        <div className="space-y-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : visibleCompanies.length === 0 && !searchQuery.trim() ? (
        <div className="text-xs text-muted-foreground/50 text-center py-6">
          Search for a company to get started
        </div>
      ) : visibleCompanies.length === 0 ? (
        <div className="text-xs text-muted-foreground/50 text-center py-6">
          No companies found
        </div>
      ) : (
        <div className="divide-y divide-border/40 max-h-[420px] overflow-y-auto">
          {visibleCompanies.map((company) => {
            const stat = stats.find((s) => s.company === company);
            const isLoaded = !!stat;
            const isSelected = selectedCompany === company;
            const isFetching = fetchingCompany === company;

            if (!isLoaded) {
              return (
                <button
                  key={company}
                  type="button"
                  onClick={() => {
                    onLoadCompany(company);
                    onSelectCompany(company);
                  }}
                  disabled={isFetching}
                  className="w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left group hover:bg-accent/30 rounded-sm disabled:opacity-50"
                >
                  <CompanyLogo company={company} size="sm" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      {company}
                    </span>
                  </div>
                  {isFetching ? (
                    <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-3 text-muted-foreground/30" />
                  )}
                </button>
              );
            }

            const pct = stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0;
            const color = pct >= 80 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive";

            return (
              <button
                key={company}
                type="button"
                onClick={() => onSelectCompany(isSelected ? null : company)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left group ${
                  isSelected ? "bg-accent/50 rounded-sm" : "hover:bg-accent/30 rounded-sm"
                }`}
              >
                <CompanyLogo company={company} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold truncate ${isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors"}`}>
                      {company}
                    </span>
                    <span className="text-[10px] font-bold tabular-nums text-foreground">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-[9px] text-muted-foreground/50 mt-0.5 tabular-nums">
                    {stat.solved} solved · {stat.total - stat.solved} remaining
                  </div>
                </div>
                <ChevronRight className={`size-3.5 transition-all ${
                  isSelected ? "text-foreground rotate-90" : "text-muted-foreground/30 group-hover:text-muted-foreground/60"
                }`} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompanyProgress;
