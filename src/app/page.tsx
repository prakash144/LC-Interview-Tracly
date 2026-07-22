"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, BookOpen, CheckCircle2, Flame, FolderKanban, Kanban, Play, Layers } from "lucide-react";
import dynamic from "next/dynamic";
import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import CompanyLogo from "@/components/data-display/CompanyLogo";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { ProgressRingChart } from "@/app/components/ProgressRingChart";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useResources } from "@/hooks/useResources";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import { useSprints, useSprintTasks } from "@/hooks/useSprints";
import FavoriteResourcesWidget from "@/app/components/FavoriteResourcesWidget";
import DailyMissionWidget from "@/app/components/DailyMission";
import { useTracks } from "@/hooks/useTracks";
import { useRevisionTracker } from "@/hooks/useRevisionTracker";
import type { Problem, UserProblemProgress } from "@/lib/progressTypes";
import type { Sprint } from "@/lib/sprints";

const Heatmap = dynamic(() => import("@/app/components/Heatmap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-border bg-card/70 px-4 py-6 transition-shadow duration-200 hover:shadow-md">
      <div className="mx-auto mb-4 h-3 max-w-xs overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-success" />
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="size-3 rounded-sm bg-secondary animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
});

const computeStreak = (progressMap: Record<string, UserProblemProgress>): number => {
  const solvedDates = new Set<string>();
  for (const p of Object.values(progressMap)) {
    if (p.solved && p.solvedAt) {
      solvedDates.add(new Date(p.solvedAt.seconds * 1000).toISOString().slice(0, 10));
    }
  }
  if (solvedDates.size === 0) return 0;
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (solvedDates.has(d.toISOString().slice(0, 10))) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const DashboardPage = () => {
  const router = useRouter();
  const { auth, progress, questionsState } = useProblemWorkspaceData();
  const stats = useDashboardStats(questionsState.questions, progress.progressMap);
  const { resources: allResources } = useResources(auth.user?.uid);
  const { progressMap: resourceProgress } = useResourceProgress(auth.user?.uid);
  const { sprints } = useSprints(auth.user?.uid);
  const { tracks } = useTracks(auth.user?.uid);
  const revisionTracker = useRevisionTracker(progress.progressMap, questionsState.questions);
  const activeSprint = sprints.find((s) => s.status === "active");

  const solvedPercent = useMemo(() => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.solved / stats.total) * 100);
  }, [stats]);

  const streak = useMemo(
    () => (auth.user ? computeStreak(progress.progressMap) : 0),
    [auth.user, progress.progressMap]
  );

  const recentSolved = useMemo(() => {
    const solved: { problem: Problem; date: Date }[] = [];
    for (const [problemId, p] of Object.entries(progress.progressMap)) {
      if (p.solved && p.solvedAt) {
        const problem = questionsState.questions.find((q) => q.problemId === problemId);
        if (problem) solved.push({ problem, date: new Date(p.solvedAt.seconds * 1000) });
      }
    }
    return solved.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }, [progress.progressMap, questionsState.questions]);

  const lastAttempted = useMemo(() => {
    const entries: { problem: Problem; progress: UserProblemProgress }[] = [];
    for (const p of Object.values(progress.progressMap)) {
      if (p.attempted && !p.solved && p.attemptedAt) {
        const q = questionsState.questions.find((q) => q.problemId === p.problemId);
        if (q) entries.push({ problem: q, progress: p });
      }
    }
    if (entries.length === 0) return null;
    entries.sort((a, b) => (b.progress.attemptedAt!.seconds * 1000) - (a.progress.attemptedAt!.seconds * 1000));
    return entries[0];
  }, [questionsState.questions, progress.progressMap]);

  const lastSolved = useMemo(() => {
    let last: { problem: Problem; date: Date } | null = null;
    for (const [problemId, p] of Object.entries(progress.progressMap)) {
      if (p.solved && p.solvedAt) {
        const d = new Date(p.solvedAt.seconds * 1000);
        if (!last || d > last.date) {
          const problem = questionsState.questions.find((q) => q.problemId === problemId);
          if (problem) last = { problem, date: d };
        }
      }
    }
    return last;
  }, [questionsState.questions, progress.progressMap]);

  const topCompanies = useMemo(() => {
    return stats.companyStats
      .filter((c) => c.solved > 0)
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 5);
  }, [stats.companyStats]);

  const ringSegments = useMemo(() => {
    const colorMap: Record<string, string> = { Easy: "var(--color-success)", Medium: "var(--color-warning)", Hard: "var(--color-destructive)" };
    return stats.difficultyStats.map((d) => ({
      name: d.name, total: d.total, solved: d.solved, color: colorMap[d.name] || "var(--color-info)",
    }));
  }, [stats.difficultyStats]);

  const difficultyColors: Record<string, string> = {
    Easy: "bg-success/20 border-success/30 text-success",
    Medium: "bg-warning/20 border-warning/30 text-warning",
    Hard: "bg-error/20 border-error/30 text-error",
  };

  const difficultyBarColors: Record<string, string> = {
    Easy: "bg-success",
    Medium: "bg-warning",
    Hard: "bg-error",
  };

  const isLoading = questionsState.loading || progress.loading;
  const hasError = questionsState.error || auth.error || progress.error;

  const revisionItems = useMemo(
    () => [
      ...revisionTracker.buckets.overdue,
      ...revisionTracker.buckets.reviewToday,
      ...revisionTracker.buckets.reviewThisWeek,
    ],
    [revisionTracker.buckets]
  );

  const quickActions = [
    { title: "Continue Solving", description: "Resume your last problem", href: "/problems", icon: Play },
    { title: "Interview Tracks", description: "System design, backend, behavioral prep", href: "/tracks", icon: Layers },
    { title: "Collections", description: "Organize problems into collections", href: "/collections", icon: FolderKanban },
    { title: "Progress", description: "Detailed stats and history", href: "/progress", icon: BarChart3 },
  ];

  const handleDifficultyClick = useCallback(() => {
    router.push("/progress");
  }, [router]);

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow="Dashboard"
        title="Progress Overview"
        description="Track your journey. Crack your dream company. 🚀"
      />

      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {isLoading && <LoadingState />}
        {hasError && typeof hasError === "string" && <ErrorState message={hasError} />}

        {!isLoading && !hasError && (
          <>
            {/* Row 1: Profile Summary + Overall Progress */}
            <div className="grid gap-4 lg:grid-cols-3">
              <section className="lg:col-span-2 rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md transition-shadow duration-200 hover:shadow-md">
                <div className="flex flex-wrap items-center gap-5">
                  {auth.user ? (
                    <>
                      <Avatar className="size-14 border-2 border-success/30 shrink-0">
                        {auth.user.photoURL && <AvatarImage src={auth.user.photoURL} alt={auth.user.displayName ?? "User"} referrerPolicy="no-referrer" />}
                        <AvatarFallback className="bg-secondary text-lg text-success">
                          {(auth.user.displayName || auth.user.email || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-foreground truncate">{auth.user.displayName || "User"}</h3>
                        <p className="text-sm text-muted-foreground">{stats.total} problems in current dataset</p>
                        {streak > 0 && (
                          <div className="inline-flex items-center gap-1.5 rounded-md border border-warning/20 bg-warning/10 px-2.5 py-1 mt-1.5">
                            <Flame className="size-4 text-warning" />
                            <span className="text-sm font-bold text-warning">{streak}</span>
                            <span className="text-xs text-muted-foreground">day streak</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-6 text-center">
                        <div><div className="text-2xl font-bold text-success">{stats.solved}</div><div className="text-xs text-muted-foreground">Solved</div></div>
                        <div><div className="text-2xl font-bold text-info">{stats.attempted}</div><div className="text-xs text-muted-foreground">Attempted</div></div>
                        <div><div className="text-2xl font-bold text-warning">{stats.bookmarked}</div><div className="text-xs text-muted-foreground">Bookmarked</div></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-border bg-secondary text-2xl">🎯</div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Welcome to Interview Tracly</h3>
                        <p className="text-sm text-muted-foreground">Sign in to track your progress and unlock insights.</p>
                      </div>
                    </>
                  )}
                </div>
                {stats.total > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Overall Progress</span>
                      <span>{solvedPercent}%</span>
                    </div>
                    <div
                      className="h-2 rounded-full bg-secondary overflow-hidden"
                      role="progressbar"
                      aria-valuenow={solvedPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Overall progress"
                    >
                      <div className="h-full rounded-full bg-gradient-to-r from-success to-success/60 transition-all duration-500" style={{ width: `${solvedPercent}%` }} />
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <ProgressRingChart
                      segments={ringSegments}
                      size={140}
                      strokeWidth={20}
                      onSegmentClick={handleDifficultyClick}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold text-foreground">{stats.solved}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight">/ {stats.total}</span>
                    </div>
                  </div>
                  <div className="space-y-2.5 min-w-0 flex-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Progress</h3>
                    <div className="space-y-2 text-xs">
                      {ringSegments.map((s) => {
                        const pct = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
                        return (
                          <div key={s.name} className="space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">{s.name}</span>
                              <span className="text-card-foreground font-medium tabular-nums">{s.solved}/{s.total}</span>
                            </div>
                            <div
                              className="h-1.5 rounded-full bg-secondary overflow-hidden"
                              role="progressbar"
                              aria-valuenow={pct}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${s.name} progress`}
                            >
                              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Link href="/progress" className="inline-flex items-center gap-1 text-xs text-success hover:text-success mt-2">
                      Full stats <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* Row 2: Activity Heatmap */}
            <section>
              <Heatmap uid={auth.user?.uid} />
              {auth.user && (
                <div className="mt-1 text-right">
                  <Link href="/progress" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    View full history <ArrowRight className="size-3" />
                  </Link>
                </div>
              )}
            </section>

            {/* Row 3: Continue Solving + Recent Activity */}
            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Continue Solving</h3>
                {lastAttempted ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                        <Play className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-success uppercase tracking-wider">Last Attempted</div>
                        <div className="mt-0.5 truncate text-sm font-semibold text-foreground">{lastAttempted.problem.title}</div>
                      </div>
                      <DifficultyBadge difficulty={lastAttempted.problem.difficulty} />
                    </div>
                    <Link href="/problems" className="inline-flex items-center gap-1 text-xs text-success hover:text-success">
                      Resume <ArrowRight className="size-3" />
                    </Link>
                  </div>
                ) : lastSolved ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                        <Play className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Last Solved</div>
                        <div className="mt-0.5 truncate text-sm font-semibold text-foreground">{lastSolved.problem.title}</div>
                      </div>
                      <DifficultyBadge difficulty={lastSolved.problem.difficulty} />
                    </div>
                    <Link href="/problems" className="inline-flex items-center gap-1 text-xs text-success hover:text-success">
                      Solve another <ArrowRight className="size-3" />
                    </Link>
                  </div>
                ) : (
                  <Link href="/problems" className="group block">
                    <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center transition-colors hover:border-foreground/20">
                      <p className="text-sm text-muted-foreground">Start solving your first problem</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-success group-hover:text-success">
                        Browse Problems <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                )}
                {lastSolved && lastAttempted && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-3 text-success" />
                      Last solved: {formatRelativeTime(lastSolved.date)}
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Activity</h3>
                  {recentSolved.length > 0 && (
                    <Link href="/progress" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all</Link>
                  )}
                </div>
                {recentSolved.length > 0 ? (
                  <ul className="space-y-2">
                    {recentSolved.map((entry) => (
                      <li key={entry.problem.problemId}>
                        <a
                          href={entry.problem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-foreground">{entry.problem.title}</div>
                            <div className="text-xs text-muted-foreground">{formatRelativeTime(entry.date)}</div>
                          </div>
                          <DifficultyBadge difficulty={entry.problem.difficulty} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
                    <p className="text-sm text-muted-foreground">No solved problems yet</p>
                    <Link href="/problems" className="mt-2 inline-flex items-center gap-1 text-xs text-success hover:text-success">
                      Start solving <ArrowRight className="size-3" />
                    </Link>
                  </div>
                )}
              </section>
            </div>

            {/* Row 4: Difficulty Breakdown + Company Progress */}
            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Difficulty Breakdown</h3>
                {ringSegments.some((s) => s.solved > 0) ? (
                  <div className="space-y-3">
                    {ringSegments.map((seg) => {
                      const percent = seg.total > 0 ? Math.round((seg.solved / seg.total) * 100) : 0;
                      return (
                        <Link
                          key={seg.name}
                          href={`/progress`}
                          className={`block rounded-lg border p-3 transition-colors hover:opacity-80 ${difficultyColors[seg.name] || "bg-secondary/50 border-border text-foreground"}`}
                        >
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="font-medium">{seg.name}</span>
                            <span>{seg.solved}/{seg.total} ({percent}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${difficultyBarColors[seg.name] || "bg-success"}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No solved problems yet</p>
                )}
              </section>

              <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Company Progress</h3>
                {topCompanies.length > 0 ? (
                  <div className="space-y-3">
                    {topCompanies.map((company) => {
                      const percent = company.total > 0 ? Math.round((company.solved / company.total) * 100) : 0;
                      return (
                        <Link
                          key={company.name}
                          href={`/problems`}
                          className="block rounded-lg border border-border bg-background p-3 transition-colors hover:bg-accent"
                        >
                          <div className="flex items-center gap-3 mb-1.5">
                            <CompanyLogo company={company.name} size="sm" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-card-foreground truncate text-sm">{company.name}</span>
                                <span className="text-xs text-muted-foreground shrink-0 ml-2">{company.solved} solved</span>
                              </div>
                            </div>
                          </div>
                          <div
                            className="h-2 rounded-full bg-secondary overflow-hidden"
                            role="progressbar"
                            aria-valuenow={percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${company.name} progress`}
                          >
                            <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${percent}%` }} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : stats.companyStats.length > 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Start solving problems from different companies</p>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No company data available</p>
                )}
              </section>
            </div>

            {/* Row 5: Active Sprint */}
            {activeSprint && (
              <ActiveSprintWidget sprint={activeSprint} uid={auth.user?.uid} />
            )}

            {/* Row 6: Daily Mission */}
            <DailyMissionWidget
              uid={auth.user?.uid}
              sprintId={activeSprint?.id}
              revisionItems={revisionItems}
              onRevisionAction={(problemId, action) => {
                if (action === "review") revisionTracker.markReviewed(problemId);
                else revisionTracker.markSkipped(problemId);
              }}
            />

            {/* Row 7: Track Progress */}
            {allResources.length > 0 && (
              <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                    <BookOpen className="size-3.5" />
                    Track Progress
                  </h3>
                  <Link href="/tracks" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all</Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tracks.map((track) => {
                    const trackResources = allResources.filter((r) => r.track === track.id);
                    const total = trackResources.length;
                    if (total === 0) return null;
                    const completed = trackResources.filter((r) => resourceProgress[r.id]?.status === "completed").length;
                    const pct = Math.round((completed / total) * 100);
                    return (
                      <Link
                        key={track.id}
                        href={`/tracks/${track.id}`}
                        className="group rounded-lg border border-border bg-background p-3 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="text-lg">{track.icon}</span>
                          <span className={`text-sm font-medium ${track.color}`}>{track.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">{completed}/{total}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="mt-1 text-[10px] text-muted-foreground">{pct}% complete</div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Row 7: Bookmarks */}
            <FavoriteResourcesWidget />

            {/* Row 8: Quick Actions */}
            <section className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/80 p-4 text-center transition-all duration-200 hover:border-border hover:bg-accent hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{action.description}</div>
                    </div>
                  </Link>
                );
              })}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
};

const ActiveSprintWidget = ({ sprint, uid }: { sprint: Sprint; uid?: string | null }) => {
  const { tasks, todoTasks, inProgressTasks, doneTasks, taskStats, updateTaskStatus } = useSprintTasks(uid, sprint.id);
  const pct = taskStats.completion;

  const todayDue = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return tasks.filter((t) => t.dueDate && t.dueDate <= today && t.status !== "done");
  }, [tasks]);

  return (
    <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Kanban className="size-3.5 text-success" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{sprint.name}</h3>
            {sprint.goal && (
              <p className="text-[10px] text-muted-foreground/50 truncate max-w-48">{sprint.goal}</p>
            )}
          </div>
        </div>
        <Link href="/sprints" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View Sprint
        </Link>
      </div>

      {todayDue.length > 0 && (
        <div className="mb-3 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
          <p className="text-[10px] text-warning font-medium mb-1">
            {todayDue.length} task{todayDue.length !== 1 ? "s" : ""} due today or overdue
          </p>
          <div className="space-y-1">
            {todayDue.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => updateTaskStatus(t.id, "done")}
                  className="size-3.5 rounded border border-muted-foreground/30 hover:border-success hover:bg-success/20 transition-all shrink-0 flex items-center justify-center"
                  aria-label="Mark as done"
                />
                <span className="flex-1 truncate text-muted-foreground">{t.title}</span>
              </div>
            ))}
            {todayDue.length > 3 && (
              <p className="text-[10px] text-muted-foreground/50">+{todayDue.length - 3} more</p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative size-12 shrink-0">
            <svg className="size-12 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-secondary" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3"
                strokeDasharray={`${pct * 0.873} 87.3`}
                className="text-success"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">{pct}%</span>
          </div>
          <div className="flex gap-3 text-xs">
            <div><span className="font-medium text-muted-foreground">{todoTasks.length}</span><span className="text-muted-foreground/60 ml-1">todo</span></div>
            <div><span className="font-medium text-warning">{inProgressTasks.length}</span><span className="text-muted-foreground/60 ml-1">active</span></div>
            <div><span className="font-medium text-success">{doneTasks.length}</span><span className="text-muted-foreground/60 ml-1">done</span></div>
          </div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="text-right text-xs">
          <div className="text-lg font-bold text-foreground">{doneTasks.length}/{taskStats.total}</div>
          <div className="text-muted-foreground">tasks done</div>
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {inProgressTasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">In Progress</p>
          {inProgressTasks.slice(0, 3).map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => updateTaskStatus(t.id, "done")}
                className="size-3.5 rounded border border-muted-foreground/30 hover:border-success hover:bg-success/20 transition-all shrink-0 flex items-center justify-center"
                aria-label="Mark as done"
              />
              <span className="flex-1 truncate text-foreground">{t.title}</span>
              {t.estimatedHours ? (
                <span className="text-[10px] text-muted-foreground/50">{t.estimatedHours}h</span>
              ) : null}
            </div>
          ))}
          {inProgressTasks.length > 3 && (
            <p className="text-[10px] text-muted-foreground/50">+{inProgressTasks.length - 3} more</p>
          )}
        </div>
      )}
    </section>
  );
};

export default DashboardPage;
