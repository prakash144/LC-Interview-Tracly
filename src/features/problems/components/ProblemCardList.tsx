"use client";

import { RotateCcw, Star } from "lucide-react";
import type { Problem, ProgressMap } from "@/lib/progressTypes";
import type { Collection } from "@/hooks/useCollections";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";
import TopicBadge from "@/components/data-display/TopicBadge";
import NotesDialog from "@/app/components/NotesDialog";
import CollectionChips from "@/app/components/collections/CollectionChips";

interface ProblemCardListProps {
  problems: Problem[];
  startIndex: number;
  progressMap: ProgressMap;
  progressEnabled: boolean;
  onRequireAuth: () => void;
  onToggleSolved: (problem: Problem) => void;
  onToggleAttempted: (problem: Problem) => void;
  onToggleBookmarked: (problem: Problem) => void;
  onToggleRevision: (problem: Problem) => void;
  onSaveNotes: (problem: Problem, notes: string) => void;
  collections?: Collection[];
  isProblemInCollection?: (problemId: string, collectionId: string) => boolean;
}

const ProblemCardList = ({
  problems,
  startIndex,
  progressMap,
  progressEnabled,
  onRequireAuth,
  onToggleSolved,
  onToggleAttempted,
  onToggleBookmarked,
  onToggleRevision,
  onSaveNotes,
  collections,
  isProblemInCollection,
}: ProblemCardListProps) => {
  const requireProgressOrRun = (action: () => void) => {
    if (!progressEnabled) {
      onRequireAuth();
      return;
    }
    action();
  };

  return (
    <div className="space-y-3">
      {problems.map((q, idx) => {
        const progress = progressMap[q.problemId];
        const isSolved = Boolean(progress?.solved);
        const isAttempted = Boolean(progress?.attempted);
        const isBookmarked = Boolean(progress?.bookmarked);
        const isRevision = Boolean(progress?.inRevisionList);

        return (
          <div
            key={`${q.company}-${q.list}-${q.problemId}`}
            className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-border"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <a
                  href={q.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-info transition-colors"
                >
                  <span className="text-muted-foreground">{startIndex + idx}.</span>{" "}
                  {q.title}
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <DifficultyBadge difficulty={q.difficulty} />
                <button
                  type="button"
                  onClick={() => requireProgressOrRun(() => onToggleBookmarked(q))}
                  title={isBookmarked ? "Remove from favorites" : "Add to favorites"}
                  aria-label={isBookmarked ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={isBookmarked}
                  className="cursor-pointer"
                >
                  <Star
                    className={`size-4 ${isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-warning"}`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-1.5 flex flex-wrap gap-1">
              {q.topicTag.split(",").map((topic) => {
                const trimmed = topic.trim();
                return <TopicBadge key={trimmed} topic={trimmed} />;
              })}
            </div>
            {collections && isProblemInCollection && (
              <div className="mt-1.5">
                <CollectionChips
                  problemId={q.problemId}
                  collections={collections}
                  isProblemInCollection={isProblemInCollection}
                />
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-2">
              <button
                type="button"
                onClick={() => requireProgressOrRun(() => onToggleSolved(q))}
                title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                aria-pressed={isSolved}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                  isSolved
                    ? "bg-success/20 text-success"
                    : "bg-secondary text-muted-foreground hover:bg-accent"
                }`}
              >
                {isSolved ? "Solved" : "Solve"}
              </button>
              <button
                type="button"
                onClick={() => requireProgressOrRun(() => onToggleAttempted(q))}
                title={isAttempted ? "Remove attempt" : "Mark attempted"}
                aria-pressed={isAttempted}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                  isAttempted
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-secondary text-muted-foreground hover:bg-accent"
                }`}
              >
                {isAttempted ? "Attempted" : "Attempt"}
              </button>
              <button
                type="button"
                onClick={() => requireProgressOrRun(() => onToggleRevision(q))}
                title={isRevision ? "Remove from revision" : "Add to revision"}
                aria-pressed={isRevision}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                  isRevision
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-secondary text-muted-foreground hover:bg-accent"
                }`}
              >
                <RotateCcw className="size-3" />
                {isRevision ? "Revising" : "Revision"}
              </button>
              <NotesDialog
                problem={q}
                notes={progress?.notes ?? ""}
                disabled={!progressEnabled}
                onRequireAuth={onRequireAuth}
                onSave={onSaveNotes}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProblemCardList;
