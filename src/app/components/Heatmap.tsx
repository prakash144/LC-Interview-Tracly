"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useHeatmapData, type HeatmapDay } from "@/hooks/useHeatmapData";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";

type TimeRange = "current" | "2025" | "2024" | "2023" | "180d" | "90d" | "30d";

const TIME_RANGES: { label: string; value: TimeRange }[] = [
    { label: "Current", value: "current" },
    { label: "2025", value: "2025" },
    { label: "2024", value: "2024" },
    { label: "2023", value: "2023" },
    { label: "180 Days", value: "180d" },
    { label: "90 Days", value: "90d" },
    { label: "30 Days", value: "30d" },
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const CELL = 11;
const GAP = 3;
const DAY_LABEL_W = 28;

const getActivityOpacity = (count: number) => {
    if (count >= 10) return 0.9;
    if (count >= 6) return 0.7;
    if (count >= 3) return 0.5;
    if (count >= 1) return 0.3;
    return 1;
};

const getCellLabel = (count: number) => {
    if (count === 0) return "No submissions";
    return `${count} ${count === 1 ? "submission" : "submissions"}`;
};

const LEVELS = [0, 1, 3, 6, 10];
const LEVEL_OPACITIES = [0, 0.3, 0.5, 0.7, 0.9];

interface CalendarData {
    weeks: HeatmapDay[][];
    monthLabels: { label: string; weekIndex: number }[];
}

const buildCalendarData = (days: HeatmapDay[]): CalendarData => {
    if (days.length === 0) return { weeks: [], monthLabels: [] };

    const startDate = new Date(days[0].date);
    const startDay = startDate.getDay();
    const paddedDays: HeatmapDay[] = [];

    if (startDay > 0) {
        const padStart = new Date(startDate);
        padStart.setDate(padStart.getDate() - startDay);
        for (let i = 0; i < startDay; i++) {
            const d = new Date(padStart);
            d.setDate(d.getDate() + i);
            paddedDays.push({ date: d.toISOString().slice(0, 10), count: 0 });
        }
    }

    const allDays = [...paddedDays, ...days];

    const weeks: HeatmapDay[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
        weeks.push(allDays.slice(i, i + 7));
    }

    const monthLabels: { label: string; weekIndex: number }[] = [];
    let lastMonth = "";

    weeks.forEach((week, idx) => {
        const anchor = week[3] || week[0];
        if (!anchor) return;
        const month = new Date(anchor.date).toLocaleString("en", { month: "short" });
        if (month !== lastMonth) {
            monthLabels.push({ label: month, weekIndex: idx });
            lastMonth = month;
        }
    });

    return { weeks, monthLabels };
};

const computeHeatmapStats = (days: HeatmapDay[]) => {
    const today = new Date().toISOString().slice(0, 10);
    const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date));

    const totalSubmissions = days.reduce((sum, d) => sum + d.count, 0);
    const activeDays = days.filter((d) => d.count > 0).length;

    let currentStreak = 0;
    for (const day of sorted) {
        if (day.date > today) continue;
        if (day.count > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    let maxStreak = 0;
    let streak = 0;
    for (const day of sorted) {
        if (day.date > today) continue;
        if (day.count > 0) {
            streak++;
            maxStreak = Math.max(maxStreak, streak);
        } else {
            streak = 0;
        }
    }

    return { totalSubmissions, activeDays, currentStreak, maxStreak };
};

interface HeatmapProps {
    uid?: string | null;
}

const Heatmap = memo(function Heatmap({ uid }: HeatmapProps) {
    const { days: rawDays, loading, error } = useHeatmapData(uid);
    const [timeRange, setTimeRange] = useState<TimeRange>("current");
    const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredDays = useMemo(() => {
        if (rawDays.length === 0) return [];
        const now = new Date();
        switch (timeRange) {
            case "30d":
                return rawDays.filter((d) => {
                    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return d.date >= cutoff.toISOString().slice(0, 10);
                });
            case "90d":
                return rawDays.filter((d) => {
                    const cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    return d.date >= cutoff.toISOString().slice(0, 10);
                });
            case "180d":
                return rawDays.filter((d) => {
                    const cutoff = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
                    return d.date >= cutoff.toISOString().slice(0, 10);
                });
            case "2023":
                return rawDays.filter((d) => d.date.startsWith("2023-"));
            case "2024":
                return rawDays.filter((d) => d.date.startsWith("2024-"));
            case "2025":
                return rawDays.filter((d) => d.date.startsWith("2025-"));
            default: {
                const cutoff = new Date(now.getTime() - 364 * 24 * 60 * 60 * 1000);
                return rawDays.filter((d) => d.date >= cutoff.toISOString().slice(0, 10));
            }
        }
    }, [rawDays, timeRange]);

    const { weeks, monthLabels } = useMemo(() => buildCalendarData(filteredDays), [filteredDays]);
    const stats = useMemo(() => computeHeatmapStats(filteredDays), [filteredDays]);
    const hasActivity = filteredDays.some((day) => day.count > 0);

    const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const handleMouseEnter = useCallback(
        (day: HeatmapDay, e: React.MouseEvent) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            setTooltip({
                date: new Date(day.date).toLocaleDateString("en", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
                count: day.count,
                x: rect.left + rect.width / 2,
                y: rect.top - 8,
            });
        },
        []
    );

    const handleMouseLeave = useCallback(() => {
        setTooltip(null);
    }, []);

    const handleDropdownToggle = useCallback(() => {
        setDropdownOpen((prev) => !prev);
    }, []);

    const handleDropdownSelect = useCallback((value: TimeRange) => {
        setTimeRange(value);
        setDropdownOpen(false);
    }, []);

    const svgWidth = weeks.length * (CELL + GAP) + DAY_LABEL_W;
    const svgHeight = 7 * (CELL + GAP) + 18;

    const currentLabel = TIME_RANGES.find((t) => t.value === timeRange)?.label || "Current";

    return (
        <section className="bg-card/80 border border-border rounded-xl p-5 transition-shadow duration-200 hover:shadow-md">
            {/* Header: submissions count + stats + dropdown */}
            {uid && !loading && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-lg font-semibold text-foreground">{stats.totalSubmissions}</span>
                        <span className="text-sm text-muted-foreground">submissions in the past one year</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Total active days:</span>
                            <span className="font-medium text-card-foreground">{stats.activeDays}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Max streak:</span>
                            <span className="font-medium text-card-foreground">{stats.maxStreak}</span>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={handleDropdownToggle}
                                className="flex cursor-pointer items-center rounded-md px-2.5 py-1 text-xs text-foreground bg-secondary hover:bg-accent border border-border transition-colors"
                            >
                                {currentLabel}
                                <ChevronDown className="ml-2 size-3" />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-1 z-50 w-32 rounded-lg border border-border bg-card py-1 shadow-xl">
                                    {TIME_RANGES.map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => handleDropdownSelect(t.value)}
                                            className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${timeRange === t.value ? "text-success bg-success/10" : "text-muted-foreground hover:text-card-foreground hover:bg-accent"}`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* States */}
            {error && <ErrorState message={error} />}
            {!uid && <EmptyState message="Sign in to see your activity heatmap." />}
            {uid && loading && (
              <div className="rounded-xl border border-border bg-card/70 px-4 py-6 transition-shadow">
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
            )}
            {uid && !loading && !error && !hasActivity && <EmptyState message="No activity yet. Solve or attempt a problem to start filling the heatmap." />}

            {/* SVG Heatmap */}
            {uid && !loading && hasActivity && (
                <>
                    <div className="overflow-x-auto scrollbar-thin-dark">
                        <svg
                            width={svgWidth}
                            height={svgHeight}
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="shrink-0"
                        >
                            {/* Day labels */}
                            {DAY_LABELS.map((label, i) => (
                                label ? (
                                    <text
                                        key={i}
                                        x={DAY_LABEL_W - 4}
                                        y={i * (CELL + GAP) + CELL - 1}
                                        textAnchor="end"
                                        fill="var(--color-muted-foreground)"
                                        fontSize={10}
                                        fontFamily="inherit"
                                    >
                                        {label}
                                    </text>
                                ) : null
                            ))}

                            {/* Grid cells */}
                            {weeks.map((week, weekIdx) =>
                                week.map((day, dayIdx) => {
                                    const isToday = day.date === todayStr;
                                    const hasActivity = day.date <= todayStr && day.count > 0;
                                    const isFuture = day.date > todayStr;
                                    return (
                                        <rect
                                            key={day.date}
                                            x={DAY_LABEL_W + weekIdx * (CELL + GAP)}
                                            y={dayIdx * (CELL + GAP)}
                                            width={CELL}
                                            height={CELL}
                                            rx={2}
                                            ry={2}
                                            fill={isFuture ? "transparent" : hasActivity ? "var(--color-success)" : "var(--color-secondary)"}
                                            opacity={hasActivity ? getActivityOpacity(day.count) : 1}
                                            stroke={isToday ? "var(--color-success)" : "none"}
                                            strokeWidth={isToday ? 1.5 : 0}
                                            className="cursor-pointer transition-colors duration-100"
                                            onMouseEnter={(e) => handleMouseEnter(day, e as unknown as React.MouseEvent)}
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    );
                                })
                            )}

                            {/* Month labels */}
                            {monthLabels.map((ml) => (
                                <text
                                    key={ml.label + ml.weekIndex}
                                    x={DAY_LABEL_W + ml.weekIndex * (CELL + GAP) + CELL / 2}
                                    y={svgHeight - 2}
                                    textAnchor="middle"
                                    fill="var(--color-muted-foreground)"
                                    fontSize={10}
                                    fontFamily="inherit"
                                >
                                    {ml.label}
                                </text>
                            ))}
                        </svg>
                    </div>

                    {/* Legend: Less █ █ █ █ █ More */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Less</span>
                        <div className="flex gap-0.5">
                            {LEVELS.map((count, i) => (
                                <span
                                    key={count}
                                    className="rounded-sm"
                                    style={{
                                        width: `${CELL}px`,
                                        height: `${CELL}px`,
                                        backgroundColor: i === 0 ? "var(--color-secondary)" : "var(--color-success)",
                                        opacity: i === 0 ? 1 : LEVEL_OPACITIES[i],
                                        display: "inline-block",
                                    }}
                                />
                            ))}
                        </div>
                        <span>More</span>
                    </div>

                    {/* Tooltip */}
                    {tooltip && (
                        <div
                            className="fixed z-50 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground shadow-lg pointer-events-none"
                            style={{
                                left: tooltip.x,
                                top: tooltip.y,
                                transform: "translate(-50%, -100%)",
                            }}
                        >
                            <div className="font-medium">{tooltip.date}</div>
                            <div className="text-muted-foreground">{getCellLabel(tooltip.count)}</div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
});

export default Heatmap;
