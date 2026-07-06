"use client";

import { useMemo } from "react";
import type { ProgressMap, Problem } from "@/lib/progressTypes";
import type { CalendarStats, CalendarInsightsData } from "@/hooks/useCalendarData";
import type { GoalSettings } from "@/hooks/useGoals";
import type { RevisionStats } from "@/hooks/useRevisionTracker";
import type { CompanyStat } from "@/hooks/useCompanyReadiness";

export interface ReadinessFactors {
  companyCompletion: number;
  topicCoverage: number;
  difficultyBalance: number;
  revisionCompletion: number;
  consistency: number;
  currentStreakScore: number;
}

export interface WeakTopic {
  topic: string;
  total: number;
  solved: number;
  completion: number;
  daysSinceLastSolved: number;
}

export interface Recommendation {
  topic: string;
  count: number;
  reason: string;
}

export interface WeeklyReview {
  problemsSolved: number;
  acceptanceRate: number;
  mostPracticedTopic: string;
  weakestTopic: string;
  bestDay: string;
  missedDays: number;
  goalCompletion: number;
}

export interface InterviewReadinessResult {
  overallScore: number;
  factors: ReadinessFactors;
  companyScores: { company: string; score: number }[];
  weakTopics: WeakTopic[];
  weakDifficulties: { difficulty: string; completion: number }[];
  recommendations: Recommendation[];
  weeklyReview: WeeklyReview;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function useInterviewReadiness(
  progressMap: ProgressMap,
  questions: Problem[],
  companyStats: CompanyStat[],
  revisionStats: RevisionStats,
  calendarStats: CalendarStats,
  calendarInsights: CalendarInsightsData,
  settings: GoalSettings,
  weeklySolved: number,
): InterviewReadinessResult {
  return useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    let totalSolved = 0;
    let totalAttempted = 0;
    let totalSubmissions = 0;

    const difficultyCounts: Record<string, { total: number; solved: number }> = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 },
    };

    const topicData = new Map<string, { total: number; solved: number; lastSolved: Date | null }>();
    const weekTopicCount = new Map<string, number>();

    for (const q of questions) {
      const isSolved = progressMap[q.problemId]?.solved ?? false;
      const solvedAt = progressMap[q.problemId]?.solvedAt;

      // Difficulty counts
      const d = q.difficulty as string;
      if (difficultyCounts[d]) {
        difficultyCounts[d].total++;
        if (isSolved) difficultyCounts[d].solved++;
      }

      // Topic data
      for (const topic of q.topics) {
        if (!topic) continue;
        const entry = topicData.get(topic) ?? { total: 0, solved: 0, lastSolved: null };
        entry.total++;
        if (isSolved) {
          entry.solved++;
          if (solvedAt) {
            const sd = new Date(solvedAt.seconds * 1000);
            if (!entry.lastSolved || sd > entry.lastSolved) entry.lastSolved = sd;
          }
        }
        topicData.set(topic, entry);
      }

      // Weekly topic count
      if (isSolved && solvedAt) {
        const sd = new Date(solvedAt.seconds * 1000);
        if (sd >= weekStart) {
          for (const topic of q.topics) {
            if (!topic) continue;
            weekTopicCount.set(topic, (weekTopicCount.get(topic) ?? 0) + 1);
          }
        }
      }

      if (isSolved) totalSolved++;
      if (progressMap[q.problemId]?.attempted) totalAttempted++;
    }

    totalSubmissions = totalSolved + totalAttempted;

    // --- Factor 1: Company Completion (25%) ---
    const validStats = companyStats.filter((s) => !s.loading && s.total > 0);
    const companyCompletion =
      validStats.length > 0
        ? validStats.reduce((sum, s) => sum + (s.solved / s.total) * 100, 0) / validStats.length
        : 0;

    // --- Factor 2: Topic Coverage (20%) ---
    const totalTopics = topicData.size;
    const coveredTopics = Array.from(topicData.values()).filter((t) => t.solved > 0).length;
    const topicCoverage = totalTopics > 0 ? (coveredTopics / totalTopics) * 100 : 0;

    // --- Factor 3: Difficulty Balance (15%) ---
    const diffPcts: number[] = [];
    for (const d of Object.values(difficultyCounts)) {
      if (d.total > 0) diffPcts.push((d.solved / d.total) * 100);
    }
    const difficultyBalance =
      diffPcts.length > 0
        ? Math.max(0, diffPcts.reduce((a, b) => a + b, 0) / diffPcts.length - (Math.max(...diffPcts) - Math.min(...diffPcts)))
        : 0;

    // --- Factor 4: Revision Completion (15%) ---
    const revisionCompletion =
      revisionStats.total > 0 ? (revisionStats.completed / revisionStats.total) * 100 : 0;

    // --- Factor 5: Consistency (15%) ---
    const consistency = calendarStats.activeDays > 0
      ? Math.min(100, (calendarStats.activeDays / 30) * 100)
      : 0;

    // --- Factor 6: Current Streak (10%) ---
    const currentStreakScore = Math.min(100, (calendarStats.currentStreak / 30) * 100);

    // --- Overall Score ---
    const overallScore = Math.round(
      companyCompletion * 0.25 +
      topicCoverage * 0.20 +
      difficultyBalance * 0.15 +
      revisionCompletion * 0.15 +
      consistency * 0.15 +
      currentStreakScore * 0.10
    );

    // --- Company Scores ---
    const companyScores = validStats.map((s) => ({
      company: s.company,
      score: Math.round((s.solved / s.total) * 100),
    }));

    // --- Weak Topics ---
    const weakTopics: WeakTopic[] = Array.from(topicData.entries())
      .map(([topic, data]) => ({
        topic,
        total: data.total,
        solved: data.solved,
        completion: data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0,
        daysSinceLastSolved: data.lastSolved ? daysBetween(data.lastSolved, now) : 999,
      }))
      .sort((a, b) => a.completion - b.completion)
      .slice(0, 5);

    // --- Weak Difficulties ---
    const weakDifficulties = Object.entries(difficultyCounts)
      .filter(([, d]) => d.total > 0)
      .map(([difficulty, d]) => ({
        difficulty,
        completion: Math.round((d.solved / d.total) * 100),
      }))
      .sort((a, b) => a.completion - b.completion);

    // --- Recommendations ---
    const recommendations: Recommendation[] = [];
    const needsPractice = weakTopics
      .filter((t) => t.completion < 70 && t.daysSinceLastSolved > 3)
      .slice(0, 3);

    for (const wt of needsPractice) {
      const days = wt.daysSinceLastSolved === 999 ? 30 : wt.daysSinceLastSolved;
      const count = Math.max(1, Math.min(3, Math.ceil(days / 7)));
      recommendations.push({
        topic: wt.topic,
        count,
        reason: `${wt.topic} has not been practiced for ${days} day${days > 1 ? "s" : ""}.`,
      });
    }

    // --- Weekly Review ---
    const mostPracticedTopic =
      weekTopicCount.size > 0
        ? Array.from(weekTopicCount.entries()).sort((a, b) => b[1] - a[1])[0][0]
        : "N/A";

    const weakestTopicName =
      weakTopics.length > 0 && weakTopics[0].total > 0 ? weakTopics[0].topic : "N/A";

    const weeklyReview: WeeklyReview = {
      problemsSolved: weeklySolved,
      acceptanceRate: totalSubmissions > 0 ? Math.round((totalSolved / totalSubmissions) * 100) : 0,
      mostPracticedTopic,
      weakestTopic: weakestTopicName,
      bestDay: calendarInsights.mostProductiveDay?.date
        ? new Date(calendarInsights.mostProductiveDay.date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "N/A",
      missedDays: calendarInsights.inactiveDays,
      goalCompletion: settings.weeklyTarget > 0
        ? Math.min(100, Math.round((weeklySolved / settings.weeklyTarget) * 100))
        : 0,
    };

    return {
      overallScore: Math.max(0, Math.min(100, overallScore)),
      factors: {
        companyCompletion: Math.round(companyCompletion),
        topicCoverage: Math.round(topicCoverage),
        difficultyBalance: Math.round(Math.max(0, difficultyBalance)),
        revisionCompletion: Math.round(revisionCompletion),
        consistency: Math.round(consistency),
        currentStreakScore: Math.round(currentStreakScore),
      },
      companyScores,
      weakTopics,
      weakDifficulties,
      recommendations,
      weeklyReview,
    };
  }, [progressMap, questions, companyStats, revisionStats, calendarStats, calendarInsights, settings, weeklySolved]);
}
