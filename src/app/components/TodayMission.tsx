"use client";

import { useMemo, useState, useEffect } from "react";
import { Target, CheckCircle, Settings } from "lucide-react";
import type { GoalSettings } from "@/hooks/useGoals";
import type { ProgressMap, Problem } from "@/lib/progressTypes";

interface TodayMissionProps {
  progressMap: ProgressMap;
  questions: Problem[];
  settings: GoalSettings;
  weeklySolved: number;
  monthlySolved: number;
  onOpenSettings: () => void;
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function ProgressRing({ pct, size = 80, stroke = 6 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 100 ? "stroke-success" : pct >= 50 ? "stroke-warning" : "stroke-zap";
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-secondary" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        className={`${color} transition-all duration-700 ease-out`}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" dominantBaseline="central" className="fill-foreground font-bold tabular-nums" fontSize={size * 0.22}>
        {pct}%
      </text>
      <text x={size / 2} y={size / 2 + 12} textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground" fontSize={size * 0.09}>
        daily
      </text>
    </svg>
  );
}

const TodayMission = ({
                        progressMap,
                        questions,
                        settings,
                        weeklySolved,
                        monthlySolved,
                        onOpenSettings,
                      }: TodayMissionProps) => {
  const todayStr = getTodayStr();
  const [todayLabel, setTodayLabel] = useState("");
  useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    );
  }, []);

  const todayStats = useMemo(() => {
    let solved = 0;
    let medium = 0;
    let company = 0;
    let revised = 0;

    const questionMap = new Map<string, Problem>();
    for (const q of questions) questionMap.set(q.problemId, q);

    for (const [, p] of Object.entries(progressMap)) {
      const isSolved = p.solved && p.solvedAt;
      const solvedDate = isSolved ? new Date(p.solvedAt!.seconds * 1000).toISOString().slice(0, 10) : null;
      const isAttempted = p.attempted && p.attemptedAt;
      const attemptedDate = isAttempted ? new Date(p.attemptedAt!.seconds * 1000).toISOString().slice(0, 10) : null;

      if (solvedDate === todayStr) {
        solved++;
        const q = questionMap.get(p.problemId);
        if (q?.difficulty === "Medium") medium++;
        if (q?.company && q.company.length > 0) company++;
      }
      if (attemptedDate === todayStr) {
        revised++;
      }
    }

    return { solved, medium, company, revised };
  }, [progressMap, questions, todayStr]);

  const completed = todayStats.solved;
  const total = settings.dailyTarget;
  const pct = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0;

  const dailyDone = completed >= total;
  const mediumDone = todayStats.medium >= settings.mediumTarget;
  const companyDone = todayStats.company >= settings.companyTarget;
  const revisionDone = todayStats.revised >= settings.revisionTarget;

  const subGoals = [
    { label: `Solve ${total} problems`, done: dailyDone, current: completed, target: total },
    { label: `Solve ${settings.mediumTarget} Medium`, done: mediumDone, current: todayStats.medium, target: settings.mediumTarget },
    { label: `Solve ${settings.companyTarget} Company`, done: companyDone, current: todayStats.company, target: settings.companyTarget },
    { label: `Revise ${settings.revisionTarget} question${settings.revisionTarget > 1 ? "s" : ""}`, done: revisionDone, current: todayStats.revised, target: settings.revisionTarget },
  ];

  const weeklyPct = settings.weeklyTarget > 0 ? Math.min(Math.round((weeklySolved / settings.weeklyTarget) * 100), 100) : 0;
  const monthlyPct = settings.monthlyTarget > 0 ? Math.min(Math.round((monthlySolved / settings.monthlyTarget) * 100), 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-zap/[0.03] to-success/[0.03] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Target className="size-3.5 text-zap" />
          <h2 className="text-xs font-semibold text-foreground">Today&apos;s Mission</h2>
        </div>
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Goal settings"
        >
          <Settings className="size-3" />
        </button>
      </div>

      <div className="text-[11px] text-muted-foreground mb-4" suppressHydrationWarning>
        {todayLabel || new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* Ring */}
        <div className="shrink-0 flex flex-col items-center self-center sm:self-start">
          <ProgressRing pct={pct} size={88} stroke={7} />
        </div>

        {/* Bars + sub-goals */}
        <div className="flex-1 min-w-0 w-full space-y-3">
          {/* Weekly & Monthly */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted-foreground">Weekly</span>
                <span className="text-[11px] font-semibold text-foreground tabular-nums">{weeklySolved}/{settings.weeklyTarget}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-zap to-success transition-all duration-700 ease-out" style={{ width: `${weeklyPct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted-foreground">Monthly</span>
                <span className="text-[11px] font-semibold text-foreground tabular-nums">{monthlySolved}/{settings.monthlyTarget}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-info to-success transition-all duration-700 ease-out" style={{ width: `${monthlyPct}%` }} />
              </div>
            </div>
          </div>

          {/* Sub-goals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {subGoals.map((goal) => (
              <div key={goal.label} className="flex items-center gap-1.5">
                <div className={`flex size-3.5 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                  goal.done
                    ? "bg-success border-success text-success-foreground"
                    : "border-border bg-secondary"
                }`}>
                  {goal.done && <CheckCircle className="size-2.5" />}
                </div>
                <span className={`text-[10px] truncate ${goal.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {goal.label}
                </span>
                <span className={`text-[10px] tabular-nums shrink-0 ${
                  goal.current >= goal.target ? "text-success font-medium" : "text-muted-foreground/60"
                }`}>
                  {goal.current}/{goal.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayMission;
