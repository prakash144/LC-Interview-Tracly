"use client";

import { memo } from "react";
import { Star, BookOpen, FolderKanban } from "lucide-react";
import type { Collection } from "@/hooks/useCollections";

interface CollectionChipsProps {
  problemId: string;
  collections: Collection[];
  isProblemInCollection: (problemId: string, collectionId: string) => boolean;
  maxChips?: number;
}

const typeConfig: Record<string, { icon: typeof Star; className: string }> = {
  favorites: { icon: Star, className: "bg-yellow-400/10 text-yellow-500 border-yellow-400/20" },
  builtin: { icon: BookOpen, className: "bg-info/10 text-info border-info/20" },
  custom: { icon: FolderKanban, className: "bg-success/10 text-success border-success/20" },
};

const CollectionChips = memo(function CollectionChips({
  problemId,
  collections,
  isProblemInCollection,
  maxChips = 3,
}: CollectionChipsProps) {
  const matched = collections.filter((c) => isProblemInCollection(problemId, c.id));
  if (matched.length === 0) return null;

  const visible = matched.slice(0, maxChips);
  const remaining = matched.length - maxChips;

  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      {visible.map((col) => {
        const cfg = typeConfig[col.type] ?? typeConfig.custom;
        const Icon = cfg.icon;
        return (
          <span
            key={col.id}
            className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 ${cfg.className}`}
            title={col.name}
          >
            <Icon className="size-2.5" />
            <span className="text-[9px] font-medium leading-none truncate max-w-[56px]">{col.name}</span>
          </span>
        );
      })}
      {remaining > 0 && (
        <span className="text-[9px] text-muted-foreground/50 font-medium">
          +{remaining}
        </span>
      )}
    </span>
  );
});

export default CollectionChips;
