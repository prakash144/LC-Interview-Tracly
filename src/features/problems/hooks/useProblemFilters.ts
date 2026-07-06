"use client";

import { useCallback, useMemo, useState } from "react";
import type { ProblemStatusFilter } from "./useFilteredProblems";

export const useProblemFilters = () => {
  const [difficulty, setDifficulty] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProblemStatusFilter>("all");

  const resetFilters = useCallback(() => {
    setDifficulty("");
    setSelectedTopics([]);
    setSearchTerm("");
    setStatusFilter("all");
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        difficulty ||
          searchTerm.trim() ||
          selectedTopics.length > 0 ||
          statusFilter !== "all"
      ),
    [difficulty, searchTerm, selectedTopics, statusFilter]
  );

  return {
    difficulty,
    hasActiveFilters,
    resetFilters,
    searchTerm,
    selectedTopics,
    setDifficulty,
    setSearchTerm,
    setSelectedTopics,
    setStatusFilter,
    statusFilter,
  };
};
