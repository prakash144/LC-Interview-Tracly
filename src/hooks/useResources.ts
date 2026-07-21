"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KnowledgeResource, KnowledgeResourceInput } from "@/lib/knowledgeBase";
import type { TrackId } from "@/lib/interviewTracks";
import * as resourceService from "@/services/firebase/resourceService";
import { SAMPLE_RESOURCES_BY_TRACK } from "@/lib/knowledgeBase";

let sampleIdCounter = 0;
const generateId = () => `res_${Date.now()}_${++sampleIdCounter}`;

const ALL_TRACK_IDS: TrackId[] = ["dsa", "system-design", "backend", "behavioral", "leadership", "interview-experience"];

export const useResources = (uid?: string | null, trackId?: TrackId) => {
  const [resources, setResources] = useState<KnowledgeResource[]>([]);
  const resourcesRef = useRef<KnowledgeResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    resourcesRef.current = resources;
  }, [resources]);

  const sampleForTrack = useCallback((tid: TrackId): KnowledgeResource[] => {
    return (SAMPLE_RESOURCES_BY_TRACK[tid] ?? []).map(
      (r: KnowledgeResourceInput, i: number) => ({
        ...r,
        id: `sample-${tid}-${i}`,
        tags: r.tags ?? [],
        company: r.company ?? "General",
        difficulty: r.difficulty ?? "Medium",
        resourceLinks: r.resourceLinks ?? [],
        askedAt: r.askedAt ?? "",
        notes: r.notes ?? "",
        createdAt: Date.now() - i * 86400000,
        updatedAt: Date.now(),
        track: tid,
      })
    ) as KnowledgeResource[];
  }, []);

  const allSampleResources = useMemo(
    () => ALL_TRACK_IDS.flatMap((tid) => sampleForTrack(tid)),
    [sampleForTrack]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!uid) {
        if (!cancelled) {
          resourcesRef.current = allSampleResources;
          setResources(allSampleResources);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await resourceService.getUserResources(uid, trackId);
        if (!cancelled) {
          const samples = trackId
            ? sampleForTrack(trackId)
            : allSampleResources;
          const merged = [...data];
          for (const s of samples) {
            if (!merged.find((r) => r.id === s.id)) {
              merged.push(s);
            }
          }
          resourcesRef.current = merged;
          setResources(merged);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load resources");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [uid, trackId, allSampleResources, sampleForTrack]);

  const addResource = useCallback(
    async (input: KnowledgeResourceInput) => {
      const now = Date.now();
      const resource: KnowledgeResource = {
        id: generateId(),
        title: input.title,
        company: input.company ?? "General",
        track: input.track,
        difficulty: input.difficulty ?? "Medium",
        tags: input.tags ?? [],
        resourceLinks: input.resourceLinks ?? [],
        askedAt: input.askedAt ?? "",
        notes: input.notes ?? "",
        createdAt: now,
        updatedAt: now,
      };

      const optimistic = [...resourcesRef.current, resource];
      resourcesRef.current = optimistic;
      setResources(optimistic);

      if (uid) {
        try {
          await resourceService.addResource(uid, resource);
        } catch (err) {
          const reverted = resourcesRef.current.filter((r) => r.id !== resource.id);
          resourcesRef.current = reverted;
          setResources(reverted);
          setError(err instanceof Error ? err.message : "Failed to add resource");
        }
      }
    },
    [uid]
  );

  const updateResource = useCallback(
    async (resourceId: string, data: Partial<KnowledgeResourceInput>) => {
      const optimistic = resourcesRef.current.map((r) =>
        r.id === resourceId
          ? { ...r, ...data, tags: data.tags ?? r.tags, resourceLinks: data.resourceLinks ?? r.resourceLinks, updatedAt: Date.now() }
          : r
      );
      resourcesRef.current = optimistic;
      setResources(optimistic);

      if (uid) {
        try {
          await resourceService.updateResource(uid, resourceId, data);
        } catch (err) {
          const reverted = await resourceService.getUserResources(uid, trackId);
          resourcesRef.current = reverted;
          setResources(reverted);
          setError(err instanceof Error ? err.message : "Failed to update resource");
        }
      }
    },
    [uid, trackId]
  );

  const deleteResource = useCallback(
    async (resourceId: string) => {
      if (!resourceId.startsWith("sample-") && !window.confirm("Delete this resource?")) return;
      const optimistic = resourcesRef.current.filter((r) => r.id !== resourceId);
      resourcesRef.current = optimistic;
      setResources(optimistic);

      if (uid && !resourceId.startsWith("sample-")) {
        try {
          await resourceService.deleteResource(uid, resourceId);
        } catch (err) {
          const reverted = await resourceService.getUserResources(uid, trackId);
          resourcesRef.current = reverted;
          setResources(reverted);
          setError(err instanceof Error ? err.message : "Failed to delete resource");
        }
      }
    },
    [uid, trackId]
  );

  return useMemo(
    () => ({
      resources,
      loading,
      error,
      addResource,
      updateResource,
      deleteResource,
    }),
    [resources, loading, error, addResource, updateResource, deleteResource]
  );
};
