"use client";

import { Building2, ChevronRight } from "lucide-react";
import { READINESS_COMPANIES } from "@/hooks/useCompanyReadiness";
import CompanyLogo from "@/components/data-display/CompanyLogo";

interface CompanyStatItem {
  company: string;
  total: number;
  solved: number;
  loading: boolean;
}

interface CompanyProgressProps {
  stats: CompanyStatItem[];
  loading: boolean;
  selectedCompany: string | null;
  onSelectCompany: (company: string | null) => void;
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

const CompanyProgress = ({ stats, loading, selectedCompany, onSelectCompany }: CompanyProgressProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex size-6 items-center justify-center rounded bg-success/10">
          <Building2 className="size-3.5 text-success" />
        </div>
        <h2 className="text-sm font-bold text-foreground">Company Progress</h2>
      </div>

      {loading && stats.every((s) => s.loading) ? (
        <div className="space-y-1">
          {stats.slice(0, 5).map((s) => (
            <SkeletonRow key={s.company} />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <div className="text-xs text-muted-foreground/50 text-center py-6">
          No company data available
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {READINESS_COMPANIES.map((company) => {
            const stat = stats.find((s) => s.company === company);
            if (!stat || stat.loading) {
              return (
                <div key={company} className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
                  <div className="size-5 rounded-full bg-secondary" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2.5 w-20 bg-secondary rounded" />
                    <div className="h-1.5 bg-secondary rounded" />
                  </div>
                  <div className="h-3 w-8 bg-secondary rounded" />
                </div>
              );
            }
            const pct = stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0;
            const isSelected = selectedCompany === company;
            const color = pct >= 80 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive";

            return (
              <button
                key={company}
                type="button"
                onClick={() => onSelectCompany(isSelected ? null : company)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left group ${
                  isSelected
                    ? "bg-accent/50 rounded-sm"
                    : "hover:bg-accent/30 rounded-sm"
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
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${pct}%` }}
                    />
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
