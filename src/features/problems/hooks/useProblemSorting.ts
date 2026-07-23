"use client";

import { useMemo, useState } from "react";
import type { Problem } from "@/lib/progressTypes";

export type ProblemSortField = "acceptanceRate" | "frequency";
export type SortDirection = "asc" | "desc";

export interface ProblemSortState {
  sortBy: ProblemSortField | null;
  sortDirection: SortDirection;
}

const parseAcceptanceRate = (value: Problem["acceptanceRate"]) =>
  typeof value === "number" ? value : parseFloat(value);

const parseFrequency = (value: Problem["frequency"]) => {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? value : parsed;
};

export const sortProblems = (
  problems: Problem[],
  { sortBy, sortDirection }: ProblemSortState
) => {
  const sorted = [...problems];

  if (!sortBy) {
    return sorted;
  }

  sorted.sort((a, b) => {
    const comparison = (() => {
      if (sortBy === "acceptanceRate") {
        return (
          parseAcceptanceRate(a.acceptanceRate) -
          parseAcceptanceRate(b.acceptanceRate)
        );
      }

      const frequencyA = parseFrequency(a.frequency);
      const frequencyB = parseFrequency(b.frequency);

      if (typeof frequencyA === "number" && typeof frequencyB === "number") {
        return frequencyA - frequencyB;
      }

      return String(frequencyA).localeCompare(String(frequencyB));
    })();

    return sortDirection === "asc" ? comparison : -comparison;
  });

  return sorted;
};

export const useProblemSorting = (
  problems: Problem[],
  initialSortBy: ProblemSortField | null = null,
  initialSortDirection: SortDirection = "asc",
) => {
  const [sortBy, setSortBy] = useState<ProblemSortField | null>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);

  const sortedProblems = useMemo(
    () => sortProblems(problems, { sortBy, sortDirection }),
    [problems, sortBy, sortDirection]
  );

  const handleSort = (column: ProblemSortField) => {
    if (sortBy === column) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortDirection("asc");
  };

  return {
    sortedProblems,
    sortBy,
    sortDirection,
    handleSort,
  };
};
