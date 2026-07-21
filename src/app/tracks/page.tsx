"use client";

import { useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/app/components/Footer";
import PageHeader from "@/components/layout/PageHeader";
import TrackCard from "@/app/components/tracks/TrackCard";
import LoadingState from "@/components/states/LoadingState";
import { INTERVIEW_TRACKS } from "@/lib/interviewTracks";
import { useAuth } from "@/hooks/useAuth";
import { useResources } from "@/hooks/useResources";
import { useResourceProgress } from "@/hooks/useResourceProgress";

const TracksPage = () => {
  const auth = useAuth();
  const { resources, loading } = useResources(auth.user?.uid);
  const { progressMap } = useResourceProgress(auth.user?.uid);

  const trackStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; inRevision: number }> = {};
    for (const track of INTERVIEW_TRACKS) {
      const trackResources = resources.filter((r) => r.track === track.id);
      const total = trackResources.length;
      const completed = trackResources.filter((r) => progressMap[r.id]?.status === "completed").length;
      const inRevision = trackResources.filter((r) => progressMap[r.id]?.inRevisionList).length;
      stats[track.id] = { total, completed, inRevision };
    }
    return stats;
  }, [resources, progressMap]);

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow="Interview Tracks"
        title="Interview Tracks"
        description="Prepare across all dimensions of technical interviewing"
      />

      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 pb-10">
        {loading && <LoadingState />}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTERVIEW_TRACKS.map((track) => {
            const stats = trackStats[track.id] ?? { total: 0, completed: 0, inRevision: 0 };
            return (
              <TrackCard
                key={track.id}
                track={track}
                total={stats.total}
                completed={stats.completed}
                inRevision={stats.inRevision}
              />
            );
          })}
        </div>
      </div>
    </AppShell>
  );
};

export default TracksPage;
