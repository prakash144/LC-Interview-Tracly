"use client";

import { useMemo, useState } from "react";
import FilterBar from "@/app/components/FilterBar";
import QuestionTable from "@/app/components/QuestionTable";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { useCustomLists } from "@/hooks/useCustomLists";
import { useCollections, getCollectionFilterStatus } from "@/hooks/useCollections";
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

  const customListsData = useCustomLists(auth.user?.uid);
  const { collections, actions } = useCollections(
    progress.progressMap,
    customListsData.lists,
    (problemId: string) => {
      const q = questionsState.questions.find((qq) => qq.problemId === problemId);
      if (q) progress.toggleBookmarked(q);
    },
    {
      addProblem: customListsData.addProblem,
      removeProblem: customListsData.removeProblem,
      create: customListsData.create,
      rename: customListsData.rename,
      remove: customListsData.remove,
    },
  );

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const collectionProblemIds = useMemo(() => {
    if (!selectedCollection) return undefined;
    const col = collections.find((c) => c.id === selectedCollection);
    if (!col) return undefined;
    if (col.type === "favorites") {
      return new Set(col.problemIds);
    }
    return new Set(col.problemIds);
  }, [selectedCollection, collections]);

  const collectionOptions = useMemo(
    () =>
      collections.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
      })),
    [collections],
  );

  const handleCollectionSelect = (collectionId: string | null) => {
    setSelectedCollection(collectionId);
    if (collectionId) {
      const statusFilter = getCollectionFilterStatus(collectionId);
      if (statusFilter) {
        filters.setStatusFilter(statusFilter);
      }
    }
  };

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
          collectionOptions={collectionOptions}
          selectedCollection={selectedCollection}
          onCollectionSelect={handleCollectionSelect}
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
          collectionProblemIds={collectionProblemIds}
          collections={collections}
          isProblemInCollection={actions.isProblemInCollection}
          addToCollection={actions.addProblem}
          removeFromCollection={actions.removeProblem}
          onCreateCollection={actions.createCollection}
          onToggleBookmarkedById={(problemId: string) => {
            const q = questionsState.questions.find((qq) => qq.problemId === problemId);
            if (q) progress.toggleBookmarked(q);
          }}
        />
      </div>
    </>
  );
};

export default ProblemWorkspace;
