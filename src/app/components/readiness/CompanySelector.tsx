"use client";

import { ChevronDown, Building2 } from "lucide-react";
import { READINESS_COMPANIES } from "@/hooks/useCompanyReadiness";
import CompanyLogo from "@/components/data-display/CompanyLogo";

interface CompanySelectorProps {
  selected: string | null;
  onChange: (company: string | null) => void;
}

const CompanySelector = ({ selected, onChange }: CompanySelectorProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
        <Building2 className="size-4" />
        <span className="font-medium">Target Company</span>
      </div>
      <div className="relative">
        <select
          value={selected ?? "__overall__"}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "__overall__" ? null : val);
          }}
          className="appearance-none rounded-xl border border-border bg-card py-2.5 pl-10 pr-10 text-sm font-semibold text-foreground outline-none cursor-pointer hover:border-foreground/20 hover:bg-accent transition-all min-w-[160px] shadow-xs"
        >
          <option value="__overall__">Overall</option>
          {READINESS_COMPANIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {selected ? (
            <CompanyLogo company={selected} size="sm" />
          ) : (
            <Building2 className="size-4 text-muted-foreground" />
          )}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
      {selected && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          Clear filter
        </button>
      )}
    </div>
  );
};

export default CompanySelector;
