"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Layers, ChevronRight } from "lucide-react";
import type { KnowledgeResource } from "@/lib/knowledgeBase";
import { INTERVIEW_TRACKS } from "@/lib/interviewTracks";
import { useResources } from "@/hooks/useResources";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";
import CompanyLogo from "@/components/data-display/CompanyLogo";

interface GlobalSearchProps {
  uid?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const trackIcons: Record<string, string> = {};
for (const t of INTERVIEW_TRACKS) trackIcons[t.id] = t.icon;

const GlobalSearch = ({ uid, open, onOpenChange }: GlobalSearchProps) => {
  const router = useRouter();
  const { resources } = useResources(uid ?? undefined);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => { inputRef.current?.focus(); }, 50);
      setQuery("");
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return resources.slice(0, 8);
    const q = query.toLowerCase();
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 20);
  }, [resources, query]);

  const handleSelect = useCallback(
    (resource: KnowledgeResource) => {
      onOpenChange(false);
      router.push(`/tracks/${resource.track}`);
    },
    [onOpenChange, router]
  );

  const grouped = useMemo(() => {
    const g: Record<string, KnowledgeResource[]> = {};
    for (const r of results) {
      const key = r.track;
      if (!g[key]) g[key] = [];
      g[key].push(r);
    }
    return g;
  }, [results]);

  const trackName = (tid: string) => INTERVIEW_TRACKS.find((t) => t.id === tid)?.name ?? tid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0">
        <div className="flex items-center border-b border-border px-4">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Search resources by title, company, or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent h-11 text-sm focus-visible:ring-0 px-3"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              {query ? "No resources match your search." : "Type to search across all tracks."}
            </div>
          ) : (
            Object.entries(grouped).map(([tid, items]) => (
              <div key={tid}>
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                  <span>{trackIcons[tid] ?? <Layers className="size-3" />}</span>
                  {trackName(tid)}
                  <span className="ml-auto">{items.length}</span>
                </div>
                {items.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-xs hover:bg-accent transition-colors group"
                  >
                    <BookOpen className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="flex-1 truncate font-medium text-foreground">{r.title}</span>
                    <DifficultyBadge difficulty={r.difficulty} />
                    {r.company !== "General" && (
                      <CompanyLogo company={r.company} size="sm" />
                    )}
                    <ChevronRight className="size-3 text-muted-foreground/30 group-hover:text-foreground/50 shrink-0" />
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
        <div className="border-t border-border px-4 py-2 text-[10px] text-muted-foreground/50 flex items-center gap-3">
          <span>Type to search</span>
          <span className="w-px h-2.5 bg-border" />
          <span>Click to navigate</span>
          {resources.length > 0 && (
            <>
              <span className="w-px h-2.5 bg-border" />
              <span>{resources.length} total resources</span>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
