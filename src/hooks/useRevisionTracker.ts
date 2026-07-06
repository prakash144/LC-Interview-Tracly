"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { ProgressMap, Problem } from "@/lib/progressTypes";

const REVISION_INTERVALS = [1, 3, 7, 14, 30, 60, 90];

const STORAGE_KEY = "revision-progress";

interface ReviewEntry {
  status: "reviewed" | "skipped";
  date: string;
}

type RevisionProgress = Record<string, ReviewEntry>;

function loadProgress(): RevisionProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(p: RevisionProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}

export interface RevisionItem {
  problemId: string;
  title: string;
  company: string;
  difficulty: string;
  lastSolved: string;
  daysSinceSolved: number;
}

export interface RevisionBuckets {
  overdue: RevisionItem[];
  reviewToday: RevisionItem[];
  reviewThisWeek: RevisionItem[];
}

export interface RevisionStats {
  pending: number;
  completed: number;
  overdue: number;
  total: number;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getBucket(days: number): "overdue" | "today" | "this-week" | null {
  for (const interval of REVISION_INTERVALS) {
    if (Math.abs(days - interval) <= 1) return "today";
  }
  const nextInterval = REVISION_INTERVALS.find((i) => i > days);
  if (nextInterval && nextInterval - days <= 7) return "this-week";
  if (days > REVISION_INTERVALS[REVISION_INTERVALS.length - 1] + 1) return "overdue";
  return null;
}

export function useRevisionTracker(progressMap: ProgressMap, questions: Problem[]) {
  const [progress, setProgress] = useState<RevisionProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const questionMap = useMemo(() => {
    const map = new Map<string, Problem>();
    for (const q of questions) map.set(q.problemId, q);
    return map;
  }, [questions]);

  const buckets = useMemo((): RevisionBuckets => {
    const now = new Date();
    const overdue: RevisionItem[] = [];
    const reviewToday: RevisionItem[] = [];
    const reviewThisWeek: RevisionItem[] = [];

    for (const [id, p] of Object.entries(progressMap)) {
      if (!p.solved || !p.solvedAt) continue;
      const solvedDate = new Date(p.solvedAt.seconds * 1000);
      const days = daysBetween(solvedDate, now);
      if (days < 1) continue;

      const q = questionMap.get(id);
      const item: RevisionItem = {
        problemId: id,
        title: q?.title || id,
        company: q?.company || "",
        difficulty: q?.difficulty || "",
        lastSolved: formatDate(solvedDate),
        daysSinceSolved: days,
      };

      const bucket = getBucket(days);
      if (bucket === "today") reviewToday.push(item);
      else if (bucket === "this-week") reviewThisWeek.push(item);
      else if (bucket === "overdue") overdue.push(item);
    }

    return {
      overdue: overdue.sort((a, b) => b.daysSinceSolved - a.daysSinceSolved),
      reviewToday: reviewToday.sort((a, b) => a.daysSinceSolved - b.daysSinceSolved),
      reviewThisWeek: reviewThisWeek.sort((a, b) => a.daysSinceSolved - b.daysSinceSolved),
    };
    }, [progressMap, questionMap]);

  const stats = useMemo((): RevisionStats => {
    const completed = Object.values(progress).filter((e) => e.status === "reviewed").length;
    const overdueCount = buckets.overdue.length;
    const pending = buckets.reviewToday.length + buckets.reviewThisWeek.length + overdueCount;
    return {
      pending,
      completed,
      overdue: overdueCount,
      total: pending + completed,
    };
  }, [buckets, progress]);

  const markReviewed = useCallback((problemId: string) => {
    setProgress((prev) => ({
      ...prev,
      [problemId]: { status: "reviewed", date: new Date().toISOString().slice(0, 10) },
    }));
  }, []);

  const markSkipped = useCallback((problemId: string) => {
    setProgress((prev) => ({
      ...prev,
      [problemId]: { status: "skipped", date: new Date().toISOString().slice(0, 10) },
    }));
  }, []);

  const resetProgress = useCallback((problemId: string) => {
    setProgress((prev) => {
      const next = { ...prev };
      delete next[problemId];
      return next;
    });
  }, []);

  return { buckets, stats, progress, markReviewed, markSkipped, resetProgress };
}
