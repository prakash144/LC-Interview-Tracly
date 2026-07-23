"use client";

import { useMemo } from "react";
import { CheckCircle2, PenTool, RotateCcw, Star, Target } from "lucide-react";
import FilterBar from "@/app/components/FilterBar";
import QuestionTable from "@/app/components/QuestionTable";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/LoadingState";
import { CommandLink, PremiumSurface, SectionHeader } from "@/components/ui/premium";
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

  const workspaceStats = useMemo(() => {
    const solved = questionsState.questions.filter((q) => progressMap[q.problemId]?.solved).length;
    const attempted = questionsState.questions.filter((q) => progressMap[q.problemId]?.attempted).length;
    const bookmarked = questionsState.questions.filter((q) => progressMap[q.problemId]?.bookmarked).length;
    const revision = questionsState.questions.filter((q) => progressMap[q.problemId]?.inRevisionList).length;
    const completion = questionsState.questions.length > 0 ? Math.round((solved / questionsState.questions.length) * 100) : 0;
    return { solved, attempted, bookmarked, revision, completion };
  }, [questionsState.questions, progressMap]);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <PremiumSurface className="overflow-hidden p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <SectionHeader
              eyebrow="Practice briefing"
              title={`${selectedCompany} ${selectedList.includes("All") ? "all-time" : "focused"} queue`}
              description="Filter the queue, then mark progress, notes, revision, and saved problems without leaving the workspace."
              icon={Target}
              action={<CommandLink href="/progress">View progress</CommandLink>}
            />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Solved", value: workspaceStats.solved, icon: CheckCircle2, tone: "text-success bg-success/10 border-success/20" },
                { label: "Attempted", value: workspaceStats.attempted, icon: PenTool, tone: "text-info bg-info/10 border-info/20" },
                { label: "Saved", value: workspaceStats.bookmarked, icon: Star, tone: "text-warning bg-warning/10 border-warning/20" },
                { label: "Revision", value: workspaceStats.revision, icon: RotateCcw, tone: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border/70 bg-background/70 p-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">{item.value}</p>
                    </div>
                    <span className={`flex size-8 items-center justify-center rounded-md border shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${item.tone}`}>
                      <item.icon className="size-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Current queue completion</span>
              <span>{workspaceStats.completion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary/80">
              <div className="h-full rounded-full bg-gradient-to-r from-success via-info to-warning transition-all duration-500" style={{ width: `${workspaceStats.completion}%` }} />
            </div>
          </div>
        </PremiumSurface>
      </div>

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
