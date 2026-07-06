"use client";

import { useState, useMemo } from "react";
import {
  Flame, Trophy, CalendarDays, TrendingUp, Clock, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";
import { useCalendarData, type TimeRangeId } from "@/hooks/useCalendarData";
import { useGoals } from "@/hooks/useGoals";
import PracticeCalendar from "@/app/components/PracticeCalendar";
import ProgressFilters from "@/app/components/ProgressFilters";
import CalendarInsights from "@/app/components/CalendarInsights";
import TodayMission from "@/app/components/TodayMission";
import GoalSettingsDialog from "@/app/components/GoalSettingsDialog";
import { useRevisionTracker } from "@/hooks/useRevisionTracker";
import RevisionTracker from "@/app/components/RevisionTracker";

function QuickStat({ icon: Icon, value, label, color }: {
  icon: typeof Flame;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-2.5">
      <Icon className={`size-4 shrink-0 ${color}`} />
      <div className="min-w-0">
        <div className="text-sm font-bold text-foreground tabular-nums leading-none">{value}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}

const ActivityPage = () => {
  const { auth, progress, questionsState } = useProblemWorkspaceData();
  const [timeRange, setTimeRange] = useState<TimeRangeId>("this-year");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const { settings, update } = useGoals();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const calendarData = useCalendarData(
    auth.user?.uid,
    progress.progressMap,
    questionsState.questions,
    timeRange,
    timeRange === "custom" ? { start: customStart, end: customEnd } : undefined,
  );

  const revisionTracker = useRevisionTracker(progress.progressMap, questionsState.questions);

  const weeklySolved = useMemo(() => {
    if (!progress.progressMap) return 0;
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    let count = 0;
    for (const [, p] of Object.entries(progress.progressMap)) {
      if (p.solved && p.solvedAt) {
        const solvedDate = new Date(p.solvedAt.seconds * 1000);
        if (solvedDate >= weekStart) count++;
      }
    }
    return count;
  }, [progress.progressMap]);

  const monthlySolved = useMemo(() => {
    if (!progress.progressMap) return 0;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let count = 0;
    for (const [, p] of Object.entries(progress.progressMap)) {
      if (p.solved && p.solvedAt) {
        const solvedDate = new Date(p.solvedAt.seconds * 1000);
        if (solvedDate >= monthStart) count++;
      }
    }
    return count;
  }, [progress.progressMap]);

  const isLoading = questionsState.loading || progress.loading || calendarData.loading;
  const hasError = questionsState.error || auth.error || progress.error || calendarData.error;

  const handleCustomRange = (start: string, end: string) => {
    setCustomStart(start);
    setCustomEnd(end);
  };

  return (
    <AppShell footer={<Footer />}>
      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 pb-10">
        {hasError && typeof hasError === "string" && <ErrorState message={hasError} />}
        {isLoading && <LoadingState message="Loading activity data..." />}

        {!auth.user && !isLoading && (
          <div className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-12 text-center">
            <Clock className="mx-auto size-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Sign in to track your activity and streaks.</p>
          </div>
        )}

        {auth.user && !isLoading && !hasError && (
          <div className="space-y-5 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Activity</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Your daily coding practice at a glance</p>
              </div>
            </div>

            <ProgressFilters
              active={timeRange}
              onChange={setTimeRange}
              onCustomRange={handleCustomRange}
              customStart={customStart}
              customEnd={customEnd}
            />

            {/* Today's Mission — Hero */}
            <TodayMission
              progressMap={progress.progressMap}
              questions={questionsState.questions}
              settings={settings}
              weeklySolved={weeklySolved}
              monthlySolved={monthlySolved}
              onOpenSettings={() => setSettingsOpen(true)}
            />

            <GoalSettingsDialog
              open={settingsOpen}
              settings={settings}
              onSave={update}
              onClose={() => setSettingsOpen(false)}
            />

            {/* Calendar + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="lg:col-span-3">
                <PracticeCalendar
                  month={calendarData.calendarMonth}
                  stats={calendarData.stats}
                  isCurrentMonth={calendarData.isCurrentMonth}
                  onPrevMonth={() => calendarData.navigateMonth(-1)}
                  onNextMonth={() => calendarData.navigateMonth(1)}
                  onToday={calendarData.goToToday}
                />
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Quick Stats
                </div>
                <QuickStat
                  icon={Flame}
                  value={`${calendarData.stats.currentStreak}d`}
                  label="Current Streak"
                  color="text-orange-400"
                />
                <QuickStat
                  icon={Trophy}
                  value={`${calendarData.stats.longestStreak}d`}
                  label="Best Streak"
                  color="text-yellow-400"
                />
                <QuickStat
                  icon={CalendarDays}
                  value={calendarData.stats.activeDays}
                  label="Active Days"
                  color="text-info"
                />
                <QuickStat
                  icon={TrendingUp}
                  value={calendarData.stats.avgPerDay}
                  label="Avg / Day"
                  color="text-success"
                />
              </div>
            </div>

            {/* Insights */}
            <CalendarInsights insights={calendarData.insights} />

            {/* Revision Queue */}
            <RevisionTracker
              buckets={revisionTracker.buckets}
              stats={revisionTracker.stats}
              onMarkReviewed={revisionTracker.markReviewed}
              onMarkSkipped={revisionTracker.markSkipped}
            />

            {/* Readiness link */}
            <div className="text-center">
              <Link
                href="/readiness"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View full readiness analysis
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default ActivityPage;
