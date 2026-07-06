"use client";

import { Trophy, Flame, Target, CalendarClock, CheckCircle2, Circle, TrendingUp, Activity } from "lucide-react";
import type { CalendarStats } from "@/hooks/useCalendarData";

interface ProgressSummaryProps {
  stats: CalendarStats;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
}

const StatCard = ({ label, value, icon, accent = "" }: StatCardProps) => (
  <div className="rounded-lg border border-border bg-secondary/50 p-3 transition-colors hover:bg-accent/30">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className={`${accent || "text-muted-foreground"}`}>{icon}</span>
    </div>
    <div className={`text-lg font-bold ${accent || "text-foreground"}`}>{value}</div>
  </div>
);

const ProgressSummary = ({ stats }: ProgressSummaryProps) => {
  const cards: StatCardProps[] = [
    {
      label: "Solved",
      value: stats.totalSolved,
      icon: <CheckCircle2 className="size-3.5" />,
      accent: "text-success",
    },
    {
      label: "Attempted",
      value: stats.totalAttempted,
      icon: <Circle className="size-3.5" />,
      accent: "text-info",
    },
    {
      label: "Submissions",
      value: stats.totalSubmissions,
      icon: <Activity className="size-3.5" />,
    },
    {
      label: "Acceptance",
      value: `${stats.acceptanceRate}%`,
      icon: <Target className="size-3.5" />,
      accent: stats.acceptanceRate >= 70 ? "text-success" : stats.acceptanceRate >= 40 ? "text-warning" : "text-error",
    },
    {
      label: "Current Streak",
      value: `${stats.currentStreak}d`,
      icon: <Flame className="size-3.5" />,
      accent: stats.currentStreak > 0 ? "text-orange-400" : "text-muted-foreground",
    },
    {
      label: "Best Streak",
      value: `${stats.longestStreak}d`,
      icon: <Trophy className="size-3.5" />,
      accent: "text-yellow-400",
    },
    {
      label: "Active Days",
      value: stats.activeDays,
      icon: <CalendarClock className="size-3.5" />,
    },
    {
      label: "Avg / Day",
      value: stats.avgPerDay,
      icon: <TrendingUp className="size-3.5" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default ProgressSummary;
