"use client";

import { useMemo } from "react";
import { Bookmark, FolderKanban, BookOpen } from "lucide-react";
import QuestionTable from "@/app/components/QuestionTable";
import type { Collection } from "@/hooks/useCollections";
import type { Problem } from "@/lib/progressTypes";
import type { ProgressMap } from "@/lib/progressTypes";

interface CollectionViewProps {
  collection: Collection | null;
  questions: Problem[];
  progressMap: ProgressMap;
  progressLoading: boolean;
  progressEnabled: boolean;
  onRequireAuth: () => void;
  onToggleSolved: (problem: Problem) => void;
  onToggleAttempted: (problem: Problem) => void;
  onToggleBookmarked: (problem: Problem) => void;
  onToggleRevision: (problem: Problem) => void;
  onSaveNotes: (problem: Problem, notes: string) => void;
}

const typeIcons: Record<string, typeof Bookmark> = {
  favorites: Bookmark,
  builtin: BookOpen,
  custom: FolderKanban,
};

const CollectionView = ({
  collection,
  questions,
  progressMap,
  progressLoading,
  progressEnabled,
  onRequireAuth,
  onToggleSolved,
  onToggleAttempted,
  onToggleBookmarked,
  onToggleRevision,
  onSaveNotes,
}: CollectionViewProps) => {
  const filteredQuestions = useMemo(() => {
    if (!collection) return [];
    if (collection.type === "favorites") {
      return questions.filter((q) => progressMap[q.problemId]?.bookmarked);
    }
    const idSet = new Set(collection.problemIds);
    return questions.filter((q) => idSet.has(q.problemId));
  }, [collection, questions, progressMap]);

  if (!collection) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-16 text-center">
        <div className="flex justify-center mb-3">
          <FolderKanban className="size-10 text-muted-foreground/30" />
        </div>
        <p className="text-sm text-muted-foreground">Select a collection to view its problems.</p>
      </div>
    );
  }

  const Icon = typeIcons[collection.type] ?? FolderKanban;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card/80 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="size-4 text-foreground" />
          <h2 className="text-sm font-bold text-foreground">{collection.name}</h2>
          <span className="text-xs text-muted-foreground/50 tabular-nums">· {collection.count} problems</span>
        </div>
        {collection.description && (
          <p className="text-xs text-muted-foreground/70">{collection.description}</p>
        )}
        {filteredQuestions.length < collection.count && collection.count > 0 && (
          <p className="text-[10px] text-muted-foreground/50 mt-1">
            Showing {filteredQuestions.length} of {collection.count} problems in the current dataset
          </p>
        )}
      </div>

      {filteredQuestions.length > 0 ? (
        <QuestionTable
          questions={filteredQuestions}
          difficultyFilter=""
          selectedTopics={[]}
          searchTerm=""
          statusFilter="all"
          progressMap={progressMap}
          progressLoading={progressLoading}
          progressEnabled={progressEnabled}
          onRequireAuth={onRequireAuth}
          onToggleSolved={onToggleSolved}
          onToggleAttempted={onToggleAttempted}
          onToggleBookmarked={onToggleBookmarked}
          onToggleRevision={onToggleRevision}
          onSaveNotes={onSaveNotes}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {collection.type === "favorites"
              ? "No favorites yet. Star a problem from the Problems page to add it here."
              : "No matching problems found in the current dataset."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CollectionView;
