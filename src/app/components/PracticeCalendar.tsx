"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import type { CalendarDay, CalendarMonth, CalendarStats } from "@/hooks/useCalendarData";
import ActivityDayDetail from "@/app/activity/ActivityDayDetail";

interface PracticeCalendarProps {
  month: CalendarMonth;
  stats: CalendarStats;
  isCurrentMonth: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getIntensity(count: number): number {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

const INTENSITY_CLASSES: Record<number, string> = {
  0: "",
  1: "bg-success/10",
  2: "bg-success/25",
  3: "bg-success/45",
  4: "bg-success/65",
};

function useClientToday(): string {
  const [today, setToday] = useState("");
  useEffect(() => { setToday(new Date().toISOString().slice(0, 10)); }, []);
  return today;
}

const DayCell = ({ day, isSelected, onSelect, todayStr }: { day: CalendarDay; isSelected: boolean; onSelect: () => void; todayStr: string }) => {
  const isPast = todayStr ? day.date < todayStr : false;
  const isToday = todayStr ? day.date === todayStr : false;
  const hasActivity = day.totalCount > 0;
  const isMissed = isPast && !hasActivity && day.isCurrentMonth;
  const intensity = getIntensity(day.totalCount);

  if (!day.isCurrentMonth) {
    return <div />;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative group flex h-7 sm:h-8 w-full items-center justify-center rounded text-xs font-medium transition-all duration-150 cursor-pointer outline-none
        ${hasActivity
          ? `${INTENSITY_CLASSES[intensity]} text-success hover:brightness-110`
          : isMissed
            ? "bg-destructive/5 text-muted-foreground/30 hover:bg-destructive/10"
            : isToday
              ? "ring-1 ring-inset ring-border text-foreground font-semibold"
              : "text-muted-foreground/20 hover:text-muted-foreground/40 hover:bg-accent/30"
        }
        ${isSelected && hasActivity ? "ring-2 ring-inset ring-success brightness-110" : ""}
        ${isSelected && !hasActivity && day.isCurrentMonth ? "ring-2 ring-inset ring-border" : ""}
        ${isToday && hasActivity ? "ring-1 ring-inset ring-success" : ""}
      `}
      aria-label={`${day.date}${hasActivity ? ` - ${day.totalCount} submission${day.totalCount !== 1 ? "s" : ""}` : ""}`}
    >
      <span className={isToday && !hasActivity && !isMissed ? "font-bold" : ""}>{day.day}</span>

      {hasActivity && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-current" />
      )}

      {isToday && !hasActivity && !isMissed && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-foreground/30" />
      )}

      <div className="absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <div className="whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-1.5 text-[11px] text-popover-foreground shadow-lg">
          {hasActivity ? (
            <>
              <div className="font-medium">{day.totalCount} submission{day.totalCount !== 1 ? "s" : ""}</div>
              <div className="text-success">{day.solvedCount} solved{day.attemptedCount > 0 ? `, ${day.attemptedCount} attempted` : ""}</div>
            </>
          ) : isMissed ? (
            <span className="text-muted-foreground">No submissions — repair your streak</span>
          ) : (
            <span className="text-muted-foreground/60">No activity</span>
          )}
        </div>
      </div>
    </button>
  );
};

const PracticeCalendar = ({
                            month,
                            stats,
                            isCurrentMonth,
                            onPrevMonth,
                            onNextMonth,
                            onToday,
                          }: PracticeCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const todayStr = useClientToday();

  const handleSelect = (date: string) => {
    setSelectedDate((prev) => prev === date ? null : date);
  };

  const selectedDay = selectedDate
    ? month.weeks.flatMap((w) => w.days).find((d) => d.date === selectedDate) ?? null
    : null;

  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onPrevMonth}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onToday}
          className="text-xs font-semibold text-foreground hover:text-success transition-colors"
        >
          {month.label}
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>

      {/* Streak banner */}
      {stats.currentStreak > 0 && isCurrentMonth && (
        <div className="flex items-center gap-1 mb-2 text-[11px] text-muted-foreground">
          <Flame className="size-3 text-orange-400" />
          <span className="font-semibold text-orange-400">Day {stats.currentStreak}</span>
          <span>— keep going!</span>
        </div>
      )}

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-px mb-0.5">
        {DAY_LABELS.map((label, i) => (
          <div key={`${label}-${i}`} className="text-center text-[10px] font-semibold text-muted-foreground/40 py-0.5">
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-px">
        {month.weeks.map((week, wi) =>
          week.days.map((day, di) => (
            <DayCell
              key={`${wi}-${di}`}
              day={day}
              isSelected={selectedDate === day.date}
              onSelect={() => handleSelect(day.date)}
              todayStr={todayStr}
            />
          ))
        )}
      </div>

      {/* Selected day detail */}
      {selectedDay && <ActivityDayDetail day={selectedDay} />}
    </div>
  );
};

export default PracticeCalendar;
