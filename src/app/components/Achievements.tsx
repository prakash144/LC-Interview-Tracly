"use client";

import type { Achievement } from "@/hooks/useInterviewReadiness";

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements = ({ achievements }: AchievementsProps) => {
  if (achievements.length === 0) return null;

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-1.5 mb-3">
        <div className="flex size-5 items-center justify-center rounded bg-warning/10">
          <svg className="size-3 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h2 className="text-xs font-semibold text-foreground">Achievements</h2>
      </div>
      {unlocked.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {unlocked.map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-1.5 rounded-lg bg-success/10 border border-success/20 px-2.5 py-1.5"
              title={a.description}
            >
              <span className="text-xs">{a.icon}</span>
              <span className="text-[10px] font-medium text-success">{a.label}</span>
            </div>
          ))}
        </div>
      )}
      {locked.length > 0 && unlocked.length > 0 && (
        <div className="border-t border-border pt-2 mt-1" />
      )}
      {locked.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {locked.map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-1.5 rounded-lg bg-secondary/30 border border-border/50 px-2.5 py-1.5 opacity-50"
              title={a.description}
            >
              <span className="text-xs grayscale">{a.icon}</span>
              <span className="text-[10px] text-muted-foreground">{a.label}</span>
            </div>
          ))}
        </div>
      )}
      {unlocked.length === 0 && (
        <div className="text-[11px] text-muted-foreground/50 text-center py-3">
          Solve more problems to unlock achievements.
        </div>
      )}
    </div>
  );
};

export default Achievements;
