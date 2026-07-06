"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import type { TimeRangeId } from "@/hooks/useCalendarData";
import { TIME_RANGES } from "@/hooks/useCalendarData";

interface ProgressFiltersProps {
  active: TimeRangeId;
  onChange: (id: TimeRangeId) => void;
  onCustomRange?: (start: string, end: string) => void;
  customStart?: string;
  customEnd?: string;
}

const VISIBLE_RANGES = TIME_RANGES.filter((r) => r.id !== "custom");

const ProgressFilters = ({ active, onChange, onCustomRange, customStart, customEnd }: ProgressFiltersProps) => {
  const [showCustom, setShowCustom] = useState(active === "custom");
  const [startDate, setStartDate] = useState(customStart || "");
  const [endDate, setEndDate] = useState(customEnd || "");
  const customRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active === "custom") {
      setShowCustom(true);
    }
  }, [active]);

  const handlePreset = (id: TimeRangeId) => {
    if (id === "custom") {
      setShowCustom((prev) => !prev);
    } else {
      setShowCustom(false);
      onChange(id);
    }
  };

  const applyCustom = () => {
    if (startDate && endDate && onCustomRange) {
      onChange("custom");
      onCustomRange(startDate, endDate);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-2">
      <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
        {VISIBLE_RANGES.map((range) => (
          <button
            key={range.id}
            type="button"
            onClick={() => handlePreset(range.id)}
            className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${
              active === range.id
                ? "bg-success text-success-foreground shadow-xs shadow-success/20"
                : "bg-secondary/60 text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
            }`}
          >
            {range.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handlePreset("custom")}
          className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 inline-flex items-center gap-1 ${
            active === "custom"
              ? "bg-success text-success-foreground shadow-xs shadow-success/20"
              : "bg-secondary/60 text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
          }`}
        >
          <CalendarDays className="size-3" />
          Custom
        </button>
      </div>

      {showCustom && (
        <div ref={customRef} className="flex items-center gap-2 text-xs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate || todayStr}
            className="rounded-md border border-border bg-secondary px-2 py-1.5 text-foreground outline-none focus:ring-1 focus:ring-success"
          />
          <span className="text-muted-foreground">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
            max={todayStr}
            className="rounded-md border border-border bg-secondary px-2 py-1.5 text-foreground outline-none focus:ring-1 focus:ring-success"
          />
          <button
            type="button"
            onClick={applyCustom}
            disabled={!startDate || !endDate}
            className="rounded-md bg-success px-3 py-1.5 text-xs font-medium text-success-foreground hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressFilters;
