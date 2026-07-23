"use client";

import type { Achievement } from "@/hooks/useAchievements";

interface AchievementBadgesProps {
  achievements: Achievement[];
}

export const AchievementBadges = ({ achievements }: AchievementBadgesProps) => {
  if (achievements.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {achievements.map((a) => (
        <div
          key={a.id}
          className="group relative inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary/30 px-2 py-1 text-xs"
          title={a.description}
        >
          <span className="text-sm">{a.icon}</span>
          <span className="text-muted-foreground hidden sm:inline">{a.name}</span>
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-[10px] text-foreground shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
            {a.description}
          </div>
        </div>
      ))}
    </div>
  );
};
