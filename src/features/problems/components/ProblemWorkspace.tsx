"use client";

import { useMemo } from "react";
import FilterBar from "@/app/components/FilterBar";
import QuestionTable from "@/app/components/QuestionTable";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { useCustomLists } from "@/hooks/useCustomLists";
import { useCollections } from "@/hooks/useCollections";
import type { ProblemWorkspaceData } from "../hooks/useProblemWorkspaceData";

interface ProblemWorkspaceProps {
  workspace: ProblemWorkspaceData;
}

const ProblemWorkspace = ({ workspace }: ProblemWorkspaceProps) => {
  const {
    auth,
    debouncedSearchQuery,
    filters,
    lastUpdated,
    progress,
    questionsState,
    selectedCompany,
    selectedList,
    setSelectedCompany,
    setSelectedList,
  } = workspace;

  const customLists = useCustomLists(auth.user?.uid);
  const progressMap = progress.progressMap;
  const { collections } = useCollections(
    progressMap,
    customLists.lists,
    () => {},
    {
      addProblem: customLists.addProblem,
      removeProblem: customLists.removeProblem,
      create: customLists.create,
      rename: customLists.rename,
      remove: customLists.remove,
    },
  );

  const collectionProblemIds = useMemo(() => {
    if (!filters.selectedCollectionId) return undefined;
    if (filters.selectedCollectionId === "__favorites__") {
      const ids = new Set<string>();
      for (const [id, p] of Object.entries(progressMap)) {
        if (p.bookmarked) ids.add(id);
      }
      return ids;
    }
    const col = collections.find((c) => c.id === filters.selectedCollectionId);
    if (!col) return undefined;
    return new Set(col.problemIds);
  }, [filters.selectedCollectionId, collections, progressMap]);

  return (
    <>
      {lastUpdated && (
        <FilterBar
          selectedCompany={selectedCompany}
          onCompanySelect={setSelectedCompany}
          onListSelect={setSelectedList}
          selectedList={selectedList}
          selectedDifficulty={filters.difficulty}
          onDifficultySelect={filters.setDifficulty}
          selectedTopic={filters.selectedTopics}
          onTopicSelect={filters.setSelectedTopics}
          selectedStatus={filters.statusFilter}
          onStatusSelect={filters.setStatusFilter}
          searchTerm={filters.searchTerm}
          onSearchChange={filters.setSearchTerm}
          onResetFilters={filters.resetFilters}
          hasActiveFilters={filters.hasActiveFilters}
          lastUpdated={lastUpdated}
          selectedCollectionId={filters.selectedCollectionId}
          onCollectionFilterChange={filters.setSelectedCollectionId}
          collections={collections}
        />
      )}

      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
        {questionsState.loading && <LoadingState />}
        {questionsState.error && <ErrorState message={questionsState.error} />}
        {auth.error && <ErrorState message={auth.error} />}
        {progress.error && <ErrorState message={progress.error} />}
        <QuestionTable
          questions={questionsState.questions}
          difficultyFilter={filters.difficulty}
          selectedTopics={filters.selectedTopics}
          searchTerm={debouncedSearchQuery}
          statusFilter={filters.statusFilter}
          progressMap={progress.progressMap}
          progressLoading={progress.loading}
          progressEnabled={Boolean(auth.user)}
          onRequireAuth={auth.login}
          onToggleSolved={progress.toggleSolved}
          onToggleAttempted={progress.toggleAttempted}
          onToggleBookmarked={progress.toggleBookmarked}
          onToggleRevision={progress.toggleRevision}
          onSaveNotes={progress.saveNotes}
          customLists={customLists}
          collectionProblemIds={collectionProblemIds}
        />
      </div>
    </>
  );
};

export default ProblemWorkspace;
