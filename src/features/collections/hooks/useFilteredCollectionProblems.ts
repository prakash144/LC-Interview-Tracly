"use client";

import { useMemo } from "react";
import type { Problem, ProgressMap } from "@/lib/progressTypes";
import type { ProblemStatusFilter } from "@/features/problems/hooks/useFilteredProblems";

export interface CollectionFilters {
  difficulty: string;
  selectedTopics: string[];
  searchTerm: string;
  status: ProblemStatusFilter;
  companyFilter: string;
  frequencyFilter: string;
  notesFilter: boolean | null;
  revisionFilter: boolean | null;
  progressMap: ProgressMap;
}

export const useFilteredCollectionProblems = (
  problems: Problem[],
  filters: CollectionFilters
) => {
  const {
    difficulty,
    selectedTopics,
    searchTerm,
    status,
    companyFilter,
    frequencyFilter,
    notesFilter,
    revisionFilter,
    progressMap,
  } = filters;

  return useMemo(() => {
    return problems.filter((problem) => {
      const normalizedDifficulty = difficulty.toLowerCase();
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const progress = progressMap[problem.problemId];
      const normalizedProblemTopics = problem.topicTag
        .split(",")
        .map((tag) => tag.trim().toLowerCase());

      const matchesDifficulty = normalizedDifficulty
        ? problem.difficulty.toLowerCase() === normalizedDifficulty
        : true;

      const matchesTopics =
        selectedTopics.length === 0 ||
        selectedTopics.some((topic) =>
          normalizedProblemTopics.includes(topic.toLowerCase())
        );

      const matchesSearch =
        normalizedSearch === "" ||
        problem.title.toLowerCase().includes(normalizedSearch);

      const matchesStatus = (() => {
        switch (status) {
          case "solved":
            return Boolean(progress?.solved);
          case "attempted":
            return Boolean(progress?.attempted);
          case "unsolved":
            return !progress?.solved && !progress?.attempted;
          case "bookmarked":
            return Boolean(progress?.bookmarked);
          case "revision":
            return Boolean(progress?.inRevisionList);
          case "all":
          default:
            return true;
        }
      })();

      const matchesCompany = companyFilter
        ? problem.company?.toLowerCase() === companyFilter.toLowerCase()
        : true;

      const matchesFrequency = frequencyFilter
        ? problem.frequency?.toLowerCase() === frequencyFilter.toLowerCase()
        : true;

      const matchesNotes = notesFilter === null
        ? true
        : notesFilter
          ? Boolean(progress?.notes?.trim())
          : !progress?.notes?.trim();

      const matchesRevision = revisionFilter === null
        ? true
        : revisionFilter
          ? Boolean(progress?.inRevisionList)
          : !progress?.inRevisionList;

      return (
        matchesDifficulty &&
        matchesTopics &&
        matchesSearch &&
        matchesStatus &&
        matchesCompany &&
        matchesFrequency &&
        matchesNotes &&
        matchesRevision
      );
    });
  }, [problems, difficulty, selectedTopics, searchTerm, status, companyFilter, frequencyFilter, notesFilter, revisionFilter, progressMap]);
};
