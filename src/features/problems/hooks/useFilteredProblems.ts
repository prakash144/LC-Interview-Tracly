"use client";

import { useMemo } from "react";
import type { Problem, ProgressMap } from "@/lib/progressTypes";

export type ProblemStatusFilter =
  | "all"
  | "solved"
  | "attempted"
  | "unsolved"
  | "bookmarked"
  | "revision";

export interface ProblemFilters {
  difficulty?: string;
  selectedTopics?: string[];
  searchTerm?: string;
  status?: ProblemStatusFilter;
  progressMap?: ProgressMap;
  collectionProblemIds?: Set<string>;
}

export const matchesProblemFilters = (
  problem: Problem,
  {
    difficulty = "",
    selectedTopics = [],
    searchTerm = "",
    status = "all",
    progressMap = {},
    collectionProblemIds,
  }: ProblemFilters
) => {
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

  const matchesCollection = !collectionProblemIds || collectionProblemIds.size === 0
    ? true
    : collectionProblemIds.has(problem.problemId);

  return matchesDifficulty && matchesTopics && matchesSearch && matchesStatus && matchesCollection;
};

export const filterProblems = (problems: Problem[], filters: ProblemFilters) =>
  problems.filter((problem) => matchesProblemFilters(problem, filters));

export const useFilteredProblems = (
  problems: Problem[],
  filters: ProblemFilters
) => {
  const { difficulty, progressMap, searchTerm, selectedTopics, status, collectionProblemIds } = filters;

  return useMemo(
    () =>
      filterProblems(problems, {
        difficulty,
        progressMap,
        searchTerm,
        selectedTopics,
        status,
        collectionProblemIds,
      }),
    [difficulty, problems, progressMap, searchTerm, selectedTopics, status, collectionProblemIds]
  );
};
