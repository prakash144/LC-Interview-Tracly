"use client";

import { useCallback, useMemo, useState } from "react";
import type { ProblemStatusFilter } from "@/features/problems/hooks/useFilteredProblems";

export const useCollectionFilters = () => {
  const [difficulty, setDifficulty] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProblemStatusFilter>("all");
  const [companyFilter, setCompanyFilter] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("");
  const [notesFilter, setNotesFilter] = useState<boolean | null>(null);
  const [revisionFilter, setRevisionFilter] = useState<boolean | null>(null);

  const resetFilters = useCallback(() => {
    setDifficulty("");
    setSelectedTopics([]);
    setSearchTerm("");
    setStatusFilter("all");
    setCompanyFilter("");
    setFrequencyFilter("");
    setNotesFilter(null);
    setRevisionFilter(null);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        difficulty ||
          searchTerm.trim() ||
          selectedTopics.length > 0 ||
          statusFilter !== "all" ||
          companyFilter ||
          frequencyFilter ||
          notesFilter !== null ||
          revisionFilter !== null
      ),
    [difficulty, searchTerm, selectedTopics, statusFilter, companyFilter, frequencyFilter, notesFilter, revisionFilter]
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
    companyFilter,
    setCompanyFilter,
    frequencyFilter,
    setFrequencyFilter,
    notesFilter,
    setNotesFilter,
    revisionFilter,
    setRevisionFilter,
  };
};
