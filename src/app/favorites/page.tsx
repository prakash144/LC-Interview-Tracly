"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Star, ExternalLink, ArrowLeft } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/app/components/Footer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { useResources } from "@/hooks/useResources";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import { useTracks } from "@/hooks/useTracks";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";
import CompanyBadge from "@/components/data-display/CompanyBadge";
import { LINK_TYPE_ICONS, LINK_LABELS } from "@/lib/knowledgeBase";

export default function FavoritesPage() {
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
    () => resources.filter((r) => progressMap[r.id]?.inRevisionList),
    [resources, progressMap]
  );

  const grouped = useMemo(() => {
    const g: Record<string, typeof favorites> = {};
    for (const r of favorites) {
      const key = r.track;
      if (!g[key]) g[key] = [];
      g[key].push(r);
    }
    return g;
  }, [favorites]);

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow={
          <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-3" />
            Dashboard
          </Link>
        }
        title="Bookmarks"
        description={`${favorites.length} bookmarked resources`}
      />

      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {favorites.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-16 text-center">
            <Star className="mx-auto size-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No bookmarked resources yet</p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              Click the <Star className="size-3 inline" /> icon on any resource to bookmark it for quick access
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([trackId, items]) => (
              <div key={trackId}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{trackIcons[trackId] ?? "📌"}</span>
                  <h3 className="text-sm font-semibold text-foreground">
                    {tracks.find((t) => t.id === trackId)?.name ?? trackId}
                  </h3>
                  <span className="text-[10px] text-muted-foreground/60">{items.length}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border bg-card/60 p-4 hover:shadow-sm hover:border-foreground/20 transition-all group">
                      <div className="flex items-start gap-3 mb-3">
                        <CompanyBadge company={r.company} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{r.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <DifficultyBadge difficulty={r.difficulty} size="sm" />
                            <span className="text-[10px] text-muted-foreground/60">{r.company}</span>
                          </div>
                        </div>
                      </div>
                      {r.resourceLinks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.resourceLinks.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 bg-secondary/80 hover:bg-accent text-[10px] text-muted-foreground hover:text-foreground transition-colors border border-border/50"
                            >
                              <span>{LINK_TYPE_ICONS[link.type]}</span>
                              <span>{link.label || LINK_LABELS[link.type]}</span>
                              <ExternalLink className="size-2.5 ml-0.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
