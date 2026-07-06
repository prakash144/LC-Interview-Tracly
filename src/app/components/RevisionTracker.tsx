"use client";

import { useState } from "react";
import { BookOpen, CheckCircle, SkipForward, AlertTriangle, CalendarClock } from "lucide-react";
import type { RevisionBuckets, RevisionStats, RevisionItem } from "@/hooks/useRevisionTracker";

interface RevisionTrackerProps {
  buckets: RevisionBuckets;
  stats: RevisionStats;
  onMarkReviewed: (problemId: string) => void;
  onMarkSkipped: (problemId: string) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-destructive",
};

const BucketCard = ({
                      title,
                      icon: Icon,
                      items,
                      emptyMessage,
                      accentColor,
                      onReview,
                      onSkip,
                      defaultCollapsed = false,
                    }: {
  title: string;
  icon: typeof AlertTriangle;
  items: RevisionItem[];
  emptyMessage: string;
  accentColor: string;
  onReview: (id: string) => void;
  onSkip: (id: string) => void;
  defaultCollapsed?: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between w-full p-2.5 hover:bg-accent transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-1.5">
          <Icon className={`size-3.5 ${accentColor}`} />
          <span className="text-[11px] font-semibold text-foreground">{title}</span>
          <span className={`text-[10px] font-semibold ${accentColor} tabular-nums`}>{items.length}</span>
        </div>
        <span className="text-[10px] text-muted-foreground/50">{collapsed ? "Show" : "Hide"}</span>
      </button>

      {!collapsed && (
        <div className="border-t border-border">
          {items.length === 0 ? (
            <div className="px-3 py-3 text-[11px] text-muted-foreground/50 text-center">{emptyMessage}</div>
          ) : (
            <div className="divide-y divide-border max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.problemId} className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] hover:bg-accent/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground truncate">{item.title}</span>
                      <span className={`shrink-0 text-[10px] font-medium ${DIFFICULTY_COLORS[item.difficulty] || "text-muted-foreground"}`}>
                        {item.difficulty}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {item.daysSinceSolved}d ago{item.company ? ` · ${item.company}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onReview(item.problemId)}
                      className="flex size-6 items-center justify-center rounded text-success hover:bg-success/10 transition-colors"
                      aria-label="Mark reviewed"
                    >
                      <CheckCircle className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSkip(item.problemId)}
                      className="flex size-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      aria-label="Skip"
                    >
                      <SkipForward className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RevisionTracker = ({ buckets, onMarkReviewed, onMarkSkipped }: RevisionTrackerProps) => {
  const totalDue = buckets.reviewToday.length + buckets.overdue.length;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="flex size-5 items-center justify-center rounded bg-info/10">
            <BookOpen className="size-3 text-info" />
          </div>
          <h2 className="text-xs font-semibold text-foreground">Revision Queue</h2>
        </div>
        {totalDue > 0 && (
          <span className="text-[10px] font-medium text-muted-foreground tabular-nums">{totalDue} due</span>
        )}
      </div>

      <div className="space-y-1.5">
        <BucketCard
          title="Review Today"
          icon={CalendarClock}
          items={buckets.reviewToday}
          emptyMessage="No problems due for review today."
          accentColor="text-success"
          onReview={onMarkReviewed}
          onSkip={onMarkSkipped}
          defaultCollapsed={buckets.reviewToday.length === 0}
        />
        <BucketCard
          title="Overdue Review"
          icon={AlertTriangle}
          items={buckets.overdue}
          emptyMessage="No overdue reviews."
          accentColor="text-warning"
          onReview={onMarkReviewed}
          onSkip={onMarkSkipped}
          defaultCollapsed={buckets.overdue.length === 0}
        />
      </div>
    </div>
  );
};

export default RevisionTracker;
