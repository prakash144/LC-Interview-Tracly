"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";
import type { ResourceProgressMap, UserResourceProgress, ResourceStatus } from "@/lib/knowledgeBase";
import {
  getUserResourceProgress,
  saveResourceProgress,
} from "@/services/firebase/resourceService";

const emptyProgress = (resourceId: string): UserResourceProgress => ({
  resourceId,
  status: "not-started",
  inRevisionList: false,
  personalNotes: "",
  statusChangedAt: null,
  revisionAddedAt: null,
  updatedAt: Timestamp.now(),
});

export const useResourceProgress = (uid?: string | null) => {
  const [progressMap, setProgressMap] = useState<ResourceProgressMap>({});
  const progressMapRef = useRef<ResourceProgressMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    progressMapRef.current = progressMap;
  }, [progressMap]);

  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      if (!uid) {
        progressMapRef.current = {};
        setProgressMap({});
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const progress = await getUserResourceProgress(uid);

        if (!cancelled) {
          progressMapRef.current = progress;
          setProgressMap(progress);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load resource progress."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProgress();
    return () => { cancelled = true; };
  }, [uid]);

  const updateProgress = useCallback(
    async (
      resourceId: string,
      updater: (current: UserResourceProgress) => UserResourceProgress
    ) => {
      if (!uid) return;

      const current = progressMapRef.current[resourceId] ?? emptyProgress(resourceId);
      const next = updater(current);

      const optimistic = { ...progressMapRef.current, [resourceId]: next };
      progressMapRef.current = optimistic;
      setProgressMap(optimistic);

      try {
        await saveResourceProgress(uid, next);
      } catch (err) {
        const reverted = { ...progressMapRef.current, [resourceId]: current };
        progressMapRef.current = reverted;
        setProgressMap(reverted);
        setError(err instanceof Error ? err.message : "Unable to save resource progress.");
      }
    },
    [uid]
  );

  const setStatus = useCallback(
    (resourceId: string, status: ResourceStatus) =>
      updateProgress(resourceId, (current) => ({
        ...current,
        status,
        statusChangedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })),
    [updateProgress]
  );

  const toggleRevision = useCallback(
    (resourceId: string) =>
      updateProgress(resourceId, (current) => {
        const inRevisionList = !current.inRevisionList;
        return {
          ...current,
          inRevisionList,
          revisionAddedAt: inRevisionList ? Timestamp.now() : null,
          updatedAt: Timestamp.now(),
        };
      }),
    [updateProgress]
  );

  const savePersonalNotes = useCallback(
    (resourceId: string, personalNotes: string) =>
      updateProgress(resourceId, (current) => ({
        ...current,
        personalNotes,
        updatedAt: Timestamp.now(),
      })),
    [updateProgress]
  );

  return useMemo(
    () => ({
      progressMap,
      loading,
      error,
      setStatus,
      toggleRevision,
      savePersonalNotes,
    }),
    [error, loading, progressMap, savePersonalNotes, setStatus, toggleRevision]
  );
};
