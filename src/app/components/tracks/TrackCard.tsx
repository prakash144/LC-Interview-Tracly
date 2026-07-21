"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { InterviewTrack } from "@/lib/interviewTracks";

interface TrackCardProps {
  track: InterviewTrack;
  total?: number;
  completed?: number;
  inRevision?: number;
}

const TrackCard = ({ track, total = 0, completed = 0, inRevision = 0 }: TrackCardProps) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Link
      href={`/tracks/${track.id}`}
      className="group block rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors p-5"
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-2xl">
          {track.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-base font-bold ${track.color}`}>{track.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground/80 line-clamp-2 mb-2">{track.shortDescription}</p>
          {total > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{completed}/{total}</span>
                <span className="w-px h-2.5 bg-border" />
                <span>{pct}%</span>
                {inRevision > 0 && (
                  <>
                    <span className="w-px h-2.5 bg-border" />
                    <span className="text-cyan-400">{inRevision} revising</span>
                  </>
                )}
              </div>
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <ChevronRight className="size-5 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  );
};

export default TrackCard;
