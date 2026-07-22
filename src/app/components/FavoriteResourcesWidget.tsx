"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";
import { useResources } from "@/hooks/useResources";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import { useTracks } from "@/hooks/useTracks";
import { useAuth } from "@/hooks/useAuth";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";
import type { KnowledgeResource } from "@/lib/knowledgeBase";

const FavoriteResourcesWidget = () => {
  const auth = useAuth();
  const { resources } = useResources(auth.user?.uid);
  const { progressMap } = useResourceProgress(auth.user?.uid);
  const { tracks } = useTracks(auth.user?.uid);

  const trackIcons = useMemo(() => {
    const icons: Record<string, string> = {};
    for (const t of tracks) icons[t.id] = t.icon;
    return icons;
  }, [tracks]);

  const favorites = useMemo(
    () => resources.filter((r) => progressMap[r.id]?.favorited),
    [resources, progressMap]
  );

  if (favorites.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card/80 p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Heart className="size-3.5 text-rose-400 fill-rose-400" />
          Favorites
        </h3>
        <Link href="/favorites" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View all
        </Link>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {favorites.slice(0, 6).map((r) => (
          <ResourceQuickLink key={r.id} resource={r} trackIcon={trackIcons[r.track] ?? "📌"} />
        ))}
      </div>
      {favorites.length > 6 && (
        <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">
          +{favorites.length - 6} more favorites
        </p>
      )}
    </section>
  );
};

const ResourceQuickLink = ({
  resource,
  trackIcon,
}: {
  resource: KnowledgeResource;
  trackIcon: string;
}) => {
  const firstLink = resource.resourceLinks?.[0];

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card/40 p-2.5 hover:bg-accent/50 transition-colors group">
      <span className="text-lg shrink-0">{trackIcon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{resource.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <DifficultyBadge difficulty={resource.difficulty} size="sm" />
          <span className="text-[10px] text-muted-foreground/50 truncate">{resource.company}</span>
        </div>
      </div>
      {firstLink && (
        <a
          href={firstLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 size-6 rounded-md flex items-center justify-center text-muted-foreground/40 hover:text-foreground hover:bg-accent transition-all opacity-0 group-hover:opacity-100"
          title="Open resource"
        >
          <ExternalLink className="size-3" />
        </a>
      )}
    </div>
  );
};

export default FavoriteResourcesWidget;
