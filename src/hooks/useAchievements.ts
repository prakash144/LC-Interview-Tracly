"use client";

import { useMemo } from "react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  justUnlocked: boolean;
}

const ACHIEVEMENT_STORAGE_KEY = "interview-tracly-achievements";

function getStoredUnlocked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function persistUnlocked(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(ids));
  } catch { /* noop */ }
}

export function useAchievements(solvedCount: number, streak: number, bookmarkedCount: number) {
  return useMemo(() => {
    const stored = getStoredUnlocked();
    const newUnlocks: string[] = [];
    const allAchievements: Achievement[] = [
      { id: "first-solve", name: "First Solve", description: "Solved your first problem", icon: "🎯", unlocked: solvedCount >= 1, justUnlocked: false },
      { id: "solver-10", name: "Problem Solver", description: "Solved 10 problems", icon: "⭐", unlocked: solvedCount >= 10, justUnlocked: false },
      { id: "solver-50", name: "Dedicated Coder", description: "Solved 50 problems", icon: "🏆", unlocked: solvedCount >= 50, justUnlocked: false },
      { id: "solver-100", name: "Century Club", description: "Solved 100 problems", icon: "💎", unlocked: solvedCount >= 100, justUnlocked: false },
      { id: "streak-7", name: "Weekly Warrior", description: "7-day streak", icon: "🔥", unlocked: streak >= 7, justUnlocked: false },
      { id: "streak-30", name: "Monthly Master", description: "30-day streak", icon: "🔥", unlocked: streak >= 30, justUnlocked: false },
      { id: "bookmarker", name: "Curator", description: "Bookmarked 5 problems", icon: "📌", unlocked: bookmarkedCount >= 5, justUnlocked: false },
    ];

    for (const a of allAchievements) {
      if (a.unlocked && !stored.has(a.id)) {
        a.justUnlocked = true;
        newUnlocks.push(a.id);
      }
    }

    if (newUnlocks.length > 0) {
      persistUnlocked([...stored, ...newUnlocks]);
    }

    return allAchievements.filter((a) => a.unlocked);
  }, [solvedCount, streak, bookmarkedCount]);
}
