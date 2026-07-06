"use client";

import { useMemo } from "react";
import { Zap, BarChart3, Trophy } from "lucide-react";
import type { CalendarInsightsData } from "@/hooks/useCalendarData";

interface CalendarInsightsProps {
  insights: CalendarInsightsData;
  className?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMonth(monthStr: string): string {
  const d = new Date(monthStr + "-01T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short" });
}

const TrendBar = ({ value, max, label }: { value: number; max: number; label: string }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-8 text-right text-muted-foreground/50 shrink-0 tabular-nums">{label}</span>
      <div className="flex-1 h-2 rounded-sm bg-secondary overflow-hidden">
        <div
          className="h-full rounded-sm bg-gradient-to-r from-success/60 to-success transition-all duration-500"
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
      <span className="w-5 text-right text-foreground font-semibold tabular-nums shrink-0">{value}</span>
    </div>
  );
};

const CalendarInsights = ({ insights, className = "" }: CalendarInsightsProps) => {
  const maxMonthly = Math.max(...insights.monthlyTrend.map((m) => m.count), 1);
  const maxWeekly = Math.max(...insights.weeklyTrend.map((w) => w.count), 1);

  const formattedBestDay = useMemo(() => {
    if (!insights.mostProductiveDay) return null;
    return {
      date: formatDate(insights.mostProductiveDay.date),
      count: insights.mostProductiveDay.count,
    };
  }, [insights.mostProductiveDay]);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
      {/* Highlights */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex size-5 items-center justify-center rounded bg-zap/10">
            <Zap className="size-3 text-zap" />
          </div>
          <h3 className="text-[11px] font-semibold text-foreground">Highlights</h3>
        </div>
        {formattedBestDay ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-gradient-to-br from-zap/10 to-zap/5 border border-zap/15 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-zap flex items-center gap-1">
                  <Trophy className="size-3" /> Best Day
                </span>
                <span className="flex items-baseline gap-0.5">
                  <span className="text-lg font-bold text-foreground tabular-nums leading-none">{formattedBestDay.count}</span>
                  <span className="text-[10px] text-muted-foreground/60">submissions</span>
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground/70">{formattedBestDay.date}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {insights.mostProductiveWeek && (
                <div className="rounded-lg bg-secondary/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Best Week</div>
                  <div className="text-sm font-bold text-foreground tabular-nums mt-0.5">{insights.mostProductiveWeek.count}</div>
                </div>
              )}
              {insights.mostProductiveMonth && (
                <div className="rounded-lg bg-secondary/30 p-2.5">
                  <div className="text-[10px] text-muted-foreground">Best Month</div>
                  <div className="text-sm font-bold text-foreground tabular-nums mt-0.5">{insights.mostProductiveMonth.count}</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-6 text-[11px] text-muted-foreground/50">
            No activity yet
          </div>
        )}
      </div>

      {/* Trends */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex size-5 items-center justify-center rounded bg-success/10">
            <BarChart3 className="size-3 text-success" />
          </div>
          <h3 className="text-[11px] font-semibold text-foreground">Trends</h3>
        </div>
        <div className="space-y-2">
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">Monthly</div>
            <div className="space-y-1">
              {insights.monthlyTrend.length > 0 ? (
                insights.monthlyTrend.slice(-6).map((m) => (
                  <TrendBar key={m.month} value={m.count} max={maxMonthly} label={formatMonth(m.month)} />
                ))
              ) : (
                <div className="text-[11px] text-muted-foreground/50 py-1">No data yet</div>
              )}
            </div>
          </div>
          <div className="pt-1.5 border-t border-border">
            <div className="text-[10px] text-muted-foreground mb-1">Weekly</div>
            <div className="space-y-1">
              {insights.weeklyTrend.length > 0 ? (
                insights.weeklyTrend.slice(-8).map((w) => (
                  <TrendBar key={w.weekLabel} value={w.count} max={maxWeekly} label={formatShortDate(w.weekLabel)} />
                ))
              ) : (
                <div className="text-[11px] text-muted-foreground/50 py-1">No data yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarInsights;
