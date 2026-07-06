import dynamic from "next/dynamic";
import { RotateCcw, Star } from "lucide-react";
import type { Problem, ProgressMap } from "@/lib/progressTypes";
import type { Collection } from "@/hooks/useCollections";
import EmptyState from "@/components/states/EmptyState";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";
import TopicBadge from "@/components/data-display/TopicBadge";
import {
    type ProblemStatusFilter,
    useFilteredProblems,
} from "@/features/problems/hooks/useFilteredProblems";
import { useProblemSorting } from "@/features/problems/hooks/useProblemSorting";
import { usePagination } from "@/features/problems/hooks/usePagination";
import ProblemPagination from "@/features/problems/components/ProblemPagination";
import ProblemCardList from "@/features/problems/components/ProblemCardList";
import AddToCollectionDialog from "@/features/problems/components/AddToCollectionDialog";
import CollectionChips from "@/app/components/collections/CollectionChips";

const NotesDialog = dynamic(() => import("./NotesDialog"), { ssr: false });

interface QuestionTableProps {
    questions: Problem[];
    difficultyFilter: string;
    selectedTopics: string[];
    searchTerm: string;
    statusFilter: ProblemStatusFilter;
    progressMap: ProgressMap;
    progressLoading: boolean;
    progressEnabled: boolean;
    onRequireAuth: () => void;
    onToggleSolved: (problem: Problem) => void;
    onToggleAttempted: (problem: Problem) => void;
    onToggleBookmarked: (problem: Problem) => void;
    onToggleRevision: (problem: Problem) => void;
    onSaveNotes: (problem: Problem, notes: string) => void;
    collectionProblemIds?: Set<string>;
    collections?: Collection[];
    isProblemInCollection?: (problemId: string, collectionId: string) => boolean;
    addToCollection?: (collectionId: string, problemId: string) => Promise<void>;
    removeFromCollection?: (collectionId: string, problemId: string) => Promise<void>;
    onCreateCollection?: (name: string, description?: string) => Promise<void>;
    onToggleBookmarkedById?: (problemId: string) => void;
}

const QuestionTable = ({
                            questions,
                            difficultyFilter,
                            selectedTopics,
                            searchTerm,
                            statusFilter,
                            progressMap,
                            progressLoading,
                            progressEnabled,
                            onRequireAuth,
                            onToggleSolved,
                            onToggleAttempted,
                            onToggleBookmarked,
                            onToggleRevision,
                            onSaveNotes,
                            collectionProblemIds,
                            collections,
                            isProblemInCollection,
                            addToCollection,
                            removeFromCollection,
                            onCreateCollection,
                            onToggleBookmarkedById,
                        }: QuestionTableProps) => {
    const filteredQuestions = useFilteredProblems(questions, {
        difficulty: difficultyFilter,
        selectedTopics,
        searchTerm,
        status: statusFilter,
        progressMap,
        collectionProblemIds,
    });
    const { sortedProblems, sortBy, sortDirection, handleSort } =
        useProblemSorting(filteredQuestions);
    const {
        currentPage,
        pageSize,
        range,
        setCurrentPage,
        setPageSize,
        totalPages,
    } = usePagination(sortedProblems.length);
    const paginatedProblems = sortedProblems.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const filteredSolved = filteredQuestions.filter((q) => progressMap[q.problemId]?.solved);
    const filteredAttempted = filteredQuestions.filter((q) => progressMap[q.problemId]?.attempted);
    const filteredBookmarked = filteredQuestions.filter((q) => progressMap[q.problemId]?.bookmarked);
    const filteredRevision = filteredQuestions.filter((q) => progressMap[q.problemId]?.inRevisionList);

    const requireProgressOrRun = (action: () => void) => {
        if (!progressEnabled) {
            onRequireAuth();
            return;
        }

        action();
    };

    return (
        <div className="space-y-4">
            {/* ✅ Count Summary Section */}
            <div className="flex flex-wrap gap-4 text-sm font-medium text-foreground">
                <div className="bg-secondary px-3 py-1.5 rounded-lg border border-border">
                    Dataset: {questions.length}
                </div>
                <div className="bg-secondary px-3 py-1.5 rounded-lg border border-border">
                    Filtered: {filteredQuestions.length}
                </div>
                <div className="bg-secondary px-3 py-1.5 rounded-lg border border-border">
                    Page: {range.from}-{range.to}
                </div>
                <div className="bg-secondary px-3 py-1.5 rounded-lg border border-border">
                    Solved: {filteredSolved.length}
                </div>
                <div className="bg-secondary px-3 py-1.5 rounded-lg border border-border">
                    Attempted: {filteredAttempted.length}
                </div>
                <div className="bg-secondary px-3 py-1.5 rounded-lg border border-border">
                    Bookmarked: {filteredBookmarked.length}
                </div>
                <div className="bg-secondary px-3 py-1.5 rounded-lg border border-border">
                    Revision: {filteredRevision.length}
                </div>
                {progressLoading && (
                    <div className="bg-secondary px-3 py-1.5 rounded-lg border border-border">
                        Syncing...
                    </div>
                )}
            </div>

            {sortedProblems.length === 0 && (
                <EmptyState message="No questions match the current filters." />
            )}

            {/* 🔽 Mobile Problem Cards */}
            <div className="block lg:hidden">
                {sortedProblems.length > 0 && (
                    <ProblemCardList
                        problems={paginatedProblems}
                        startIndex={range.from}
                        progressMap={progressMap}
                        progressEnabled={progressEnabled}
                        onRequireAuth={onRequireAuth}
                        onToggleSolved={onToggleSolved}
                        onToggleAttempted={onToggleAttempted}
                        onToggleBookmarked={onToggleBookmarked}
                        onToggleRevision={onToggleRevision}
                        onSaveNotes={onSaveNotes}
                        collections={collections}
                        isProblemInCollection={isProblemInCollection}
                    />
                )}
            </div>

            {/* 🔽 Desktop Question Table */}
            <div className="hidden lg:block">
            {sortedProblems.length > 0 && (
            <>
            <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-left text-foreground" aria-label="Problems table">
                <thead className="sticky top-0 z-10 text-xs uppercase bg-card text-muted-foreground border-b border-border">
                <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Problem</th>
                    <th
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => handleSort("acceptanceRate")}
                        aria-sort={sortBy === "acceptanceRate" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                    >
                        Acceptance
                        {sortBy === "acceptanceRate" && (
                            <span className={sortDirection === "asc" ? "text-success" : "text-destructive"}>
                                    {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                        )}
                    </th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => handleSort("frequency")}
                        aria-sort={sortBy === "frequency" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                    >
                        Frequency
                        {sortBy === "frequency" && (
                            <span className={sortDirection === "asc" ? "text-success" : "text-destructive"}>
                                    {sortDirection === "asc" ? "↑" : "↓"}
                                </span>
                        )}
                    </th>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Attempted</th>
                    <th className="px-4 py-3 text-center"><Star className="size-4 inline-block text-yellow-400" /></th>
                    <th className="px-4 py-3 text-center">Revision</th>
                    <th className="px-4 py-3 text-center">Notes</th>
                    {collections && isProblemInCollection && <th className="px-4 py-3 text-center">List</th>}
                </tr>
                </thead>
                <tbody>
                {paginatedProblems.map((q, index) => {
                    const progress = progressMap[q.problemId];

                    return (
                    <tr key={`${q.company}-${q.list}-${q.problemId}`} className="bg-secondary border-b border-border transition-colors duration-150 hover:bg-accent/40">
                        <td className="px-4 py-3 text-muted-foreground">{range.from + index}</td>
                        <td className="px-4 py-3 font-medium">
                            <a href={q.link} target="_blank" rel="noopener noreferrer" title={q.title} className="text-foreground hover:text-info transition-colors">
                                {q.title}
                            </a>
                        </td>
                        <td className="px-4 py-3">
                            {typeof q.acceptanceRate === "number" ? q.acceptanceRate.toFixed(2) : q.acceptanceRate}
                        </td>
                        <td className="px-4 py-3">
                            <DifficultyBadge difficulty={q.difficulty} />
                        </td>
                        <td className="px-4 py-3">{q.frequency}</td>
                        <td className="px-4 py-3">
                            {q.topicTag.split(",").map((topic) => {
                                const trimmed = topic.trim();
                                const isSelected = selectedTopics.includes(trimmed);
                                return (
                                    <TopicBadge key={trimmed} topic={trimmed} active={isSelected} className="mr-1 mb-1" />
                                );
                            })}
                            {collections && isProblemInCollection && (
                                <div className="mt-1">
                                    <CollectionChips
                                        problemId={q.problemId}
                                        collections={collections}
                                        isProblemInCollection={isProblemInCollection}
                                    />
                                </div>
                            )}
                        </td>
                        <td className="px-4 py-3 text-center">
                            <input
                                type="checkbox"
                                title="Mark as solved"
                                aria-label={progress?.solved ? "Mark as unsolved" : "Mark as solved"}
                                checked={Boolean(progress?.solved)}
                                onChange={() => requireProgressOrRun(() => onToggleSolved(q))}
                                className="form-checkbox rounded-full bg-muted border-border text-success cursor-pointer"
                            />
                        </td>
                        <td className="px-4 py-3 text-center">
                            <input
                                type="checkbox"
                                title="Mark as attempted"
                                aria-label={progress?.attempted ? "Remove attempt" : "Mark as attempted"}
                                checked={Boolean(progress?.attempted)}
                                onChange={() => requireProgressOrRun(() => onToggleAttempted(q))}
                                className="form-checkbox rounded-full bg-muted border-border text-info cursor-pointer"
                            />
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button
                                type="button"
                                onClick={() => requireProgressOrRun(() => onToggleBookmarked(q))}
                                title={progress?.bookmarked ? "Remove from favorites" : "Add to favorites"}
                                aria-label={progress?.bookmarked ? "Remove from favorites" : "Add to favorites"}
                                aria-pressed={Boolean(progress?.bookmarked)}
                                className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                                    progress?.bookmarked
                                        ? "bg-yellow-400/10 text-warning"
                                        : "text-muted-foreground hover:bg-accent hover:text-warning"
                                }`}
                            >
                                <Star className={`size-4 ${progress?.bookmarked ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                <span className="sr-only sm:not-sr-only">
                                    {progress?.bookmarked ? "Saved" : "Save"}
                                </span>
                            </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button
                                onClick={() => requireProgressOrRun(() => onToggleRevision(q))}
                                title="Toggle revision"
                                aria-label={progress?.inRevisionList ? "Remove from revision list" : "Add to revision list"}
                                className={`cursor-pointer inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                                    progress?.inRevisionList
                                        ? "bg-cyan-500/20 text-cyan-400"
                                        : "text-muted-foreground hover:bg-accent hover:text-cyan-400"
                                }`}
                            >
                                <RotateCcw className="size-3.5" />
                                <span className="sr-only sm:not-sr-only">Revise</span>
                            </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                            <NotesDialog
                                problem={q}
                                notes={progress?.notes ?? ""}
                                disabled={!progressEnabled}
                                onRequireAuth={onRequireAuth}
                                onSave={onSaveNotes}
                            />
                        </td>
                        {collections && isProblemInCollection && addToCollection && removeFromCollection && onCreateCollection && onToggleBookmarkedById && (
                            <td className="px-4 py-3 text-center">
                                <AddToCollectionDialog
                                    problemId={q.problemId}
                                    problemTitle={q.title}
                                    collections={collections}
                                    isProblemInCollection={isProblemInCollection}
                                    onToggleBookmarked={onToggleBookmarkedById}
                                    onAddProblem={addToCollection}
                                    onRemoveProblem={removeFromCollection}
                                    onCreateCollection={onCreateCollection}
                                />
                            </td>
                        )}
                    </tr>
                )})}
                </tbody>
            </table>
            </div>
            </>
            )}
            </div>
            <ProblemPagination
                currentPage={currentPage}
                pageSize={pageSize}
                rangeFrom={range.from}
                rangeTo={range.to}
                totalItems={sortedProblems.length}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
            />
        </div>
    );
};

export default QuestionTable;
