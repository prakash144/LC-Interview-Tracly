"use client";

import { useCallback, useMemo, useState } from "react";
import type { ProblemStatusFilter } from "./useFilteredProblems";

export const useProblemFilters = () => {
  const [difficulty, setDifficulty] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProblemStatusFilter>("all");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");

  const resetFilters = useCallback(() => {
    setDifficulty("");
    setSelectedTopics([]);
    setSearchTerm("");
    setStatusFilter("all");
    setSelectedCollectionId("");
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        difficulty ||
          searchTerm.trim() ||
          selectedTopics.length > 0 ||
          statusFilter !== "all" ||
          selectedCollectionId
      ),
    [difficulty, searchTerm, selectedTopics, statusFilter, selectedCollectionId]
  );

  return {
    difficulty,
    hasActiveFilters,
    resetFilters,
    searchTerm,
    selectedTopics,
    selectedCollectionId,
    setDifficulty,
    setSearchTerm,
    setSelectedTopics,
    setStatusFilter,
    setSelectedCollectionId,
    statusFilter,
  };
};
