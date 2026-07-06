"use client";

import { useMemo, useCallback } from "react";
import type { ProgressMap, CustomList } from "@/lib/progressTypes";
import { BUILTIN_COLLECTIONS } from "@/lib/builtinCollections";
import type { ProblemStatusFilter } from "@/features/problems/hooks/useFilteredProblems";

export type CollectionType = "favorites" | "builtin" | "custom";

export interface Collection {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  type: CollectionType;
  problemIds: string[];
  count: number;
}

export interface CollectionActions {
  toggleBookmarked: (problemId: string) => void;
  addProblem: (collectionId: string, problemId: string) => Promise<void>;
  removeProblem: (collectionId: string, problemId: string) => Promise<void>;
  createCollection: (name: string, description?: string) => Promise<void>;
  renameCollection: (collectionId: string, name: string) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  isProblemInCollection: (problemId: string, collectionId: string) => boolean;
  getProblemCollectionIds: (problemId: string) => string[];
}

export function useCollections(
  progressMap: ProgressMap,
  customLists: CustomList[],
  toggleBookmarked: (problemId: string) => void,
  customActions: {
    addProblem: (listId: string, problemId: string) => Promise<void>;
    removeProblem: (listId: string, problemId: string) => Promise<void>;
    create: (name: string, description?: string) => Promise<void>;
    rename: (listId: string, name: string) => Promise<void>;
    remove: (listId: string) => Promise<void>;
  },
): { collections: Collection[]; actions: CollectionActions } {
  const favoriteIds = useMemo(() => {
    const ids = new Set<string>();
    for (const [id, p] of Object.entries(progressMap)) {
      if (p.bookmarked) ids.add(id);
    }
    return ids;
  }, [progressMap]);

  const collections: Collection[] = useMemo(() => {
    const result: Collection[] = [];

    result.push({
      id: "__favorites__",
      name: "Favorites",
      icon: "⭐",
      type: "favorites",
      problemIds: Array.from(favoriteIds),
      count: favoriteIds.size,
    });

    for (const bc of BUILTIN_COLLECTIONS) {
      result.push({
        id: bc.id,
        name: bc.name,
        icon: bc.icon,
        description: bc.description,
        type: "builtin",
        problemIds: bc.problemIds,
        count: bc.problemIds.length,
      });
    }

    for (const cl of customLists) {
      result.push({
        id: cl.id,
        name: cl.name,
        description: cl.description || undefined,
        type: "custom",
        problemIds: cl.problemIds,
        count: cl.problemIds.length,
      });
    }

    return result;
  }, [favoriteIds, customLists]);

  const isProblemInCollection = useCallback(
    (problemId: string, collectionId: string): boolean => {
      const col = collections.find((c) => c.id === collectionId);
      if (!col) return false;
      if (col.type === "favorites") return favoriteIds.has(problemId);
      return col.problemIds.includes(problemId);
    },
    [collections, favoriteIds],
  );

  const getProblemCollectionIds = useCallback(
    (problemId: string): string[] => {
      return collections
        .filter((c) => {
          if (c.type === "favorites") return favoriteIds.has(problemId);
          return c.problemIds.includes(problemId);
        })
        .map((c) => c.id);
    },
    [collections, favoriteIds],
  );

  const actions: CollectionActions = {
    toggleBookmarked,
    addProblem: customActions.addProblem,
    removeProblem: customActions.removeProblem,
    createCollection: customActions.create,
    renameCollection: customActions.rename,
    deleteCollection: customActions.remove,
    isProblemInCollection,
    getProblemCollectionIds,
  };

  return { collections, actions };
}

export function getCollectionFilterStatus(
  collectionId: string | null,
): ProblemStatusFilter | undefined {
  if (collectionId === "__favorites__") return "bookmarked";
  return undefined;
}
