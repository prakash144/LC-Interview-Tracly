"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { CalendarDay } from "@/hooks/useCalendarData";

interface ActivityDayDetailProps {
  day: CalendarDay;
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

const ActivityDayDetail = ({ day }: ActivityDayDetailProps) => {
  const hasItems = day.solvedTitles.length > 0 || day.attemptedTitles.length > 0;

  return (
    <div className="border-t border-border mt-2 pt-2 pb-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-foreground">
          {formatDateLabel(day.date)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {day.solvedCount} solved{day.attemptedCount > 0 ? `, ${day.attemptedCount} attempted` : ""}
        </span>
      </div>

      {!hasItems ? (
        <p className="text-[11px] text-muted-foreground/50 py-1">No activity on this day.</p>
      ) : (
        <div className="space-y-0.5">
          {day.solvedTitles.map((title, i) => (
            <div key={`solved-${i}`} className="flex items-center gap-1.5 text-[11px]">
              <span className="size-1.5 rounded-full bg-success shrink-0" />
              <span className="text-foreground truncate">{title}</span>
            </div>
          ))}
          {day.attemptedTitles.map((title, i) => (
            <div key={`attempted-${i}`} className="flex items-center gap-1.5 text-[11px]">
              <span className="size-1.5 rounded-full bg-warning shrink-0" />
              <span className="text-muted-foreground truncate">{title}</span>
              <span className="text-[10px] text-warning shrink-0">attempted</span>
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/progress?date=${day.date}`}
        className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors mt-2"
      >
        View Full History
        <ExternalLink className="size-2.5" />
      </Link>
    </div>
  );
};

export default ActivityDayDetail;
