"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, ChevronLeft, Settings2, BookOpen, Search, RotateCcw, ArrowUpDown, ChevronDown, Star, Archive } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/app/components/Footer";
import PageHeader from "@/components/layout/PageHeader";
import TrackCard from "@/app/components/tracks/TrackCard";
import ResourceCard from "@/app/components/tracks/ResourceCard";
import ResourceDialog from "@/app/components/tracks/ResourceDialog";
import ManageTracksDialog from "@/app/components/tracks/ManageTracksDialog";
import LoadingState from "@/components/states/LoadingState";
import { useAuth } from "@/hooks/useAuth";
import { useTracks } from "@/hooks/useTracks";
import { useResources } from "@/hooks/useResources";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import * as resourceService from "@/services/firebase/resourceService";
import type { DifficultyLevel, ResourceStatus, ResourceLink, KnowledgeResource } from "@/lib/knowledgeBase";
import { COMPANIES, STATUS_LABELS } from "@/lib/knowledgeBase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortField = "askedAt" | "createdAt" | "title" | "company";
type SortDir = "asc" | "desc";

const TrackDetailView = ({
  trackId,
  tracks,
  onBack,
}: {
  trackId: string;
  tracks: { id: string; name: string; icon: string; color: string; description: string }[];
  onBack: () => void;
}) => {
  const auth = useAuth();
  const track = tracks.find((t) => t.id === trackId);
  const { resources, addResource, updateResource, deleteResource } = useResources(auth.user?.uid, trackId);
  const { progressMap, setStatus, toggleRevision, savePersonalNotes } = useResourceProgress(auth.user?.uid);

  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"" | DifficultyLevel>("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ResourceStatus>("");
  const [showRevisionOnly, setShowRevisionOnly] = useState(false);
  const [sortField, setSortField] = useState<SortField>("askedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<KnowledgeResource | null>(null);

  const handleAdd = () => {
    setEditingResource(null);
    setDialogOpen(true);
  };

  const handleEdit = (resource: KnowledgeResource) => {
    setEditingResource(resource);
    setDialogOpen(true);
  };

  const handleSave = (data: {
    title: string; company: string; difficulty: DifficultyLevel;
    tags: string[]; resourceLinks: ResourceLink[]; askedAt: string; notes: string;
  }) => {
    if (editingResource) {
      updateResource(editingResource.id, data);
    } else {
      addResource({ ...data, track: trackId });
    }
  };

  const handleDelete = (resourceId: string) => deleteResource(resourceId);

  const filteredResources = useMemo(() => {
    let result = [...resources];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((r) => r.title.toLowerCase().includes(q) || r.company.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (difficultyFilter) result = result.filter((r) => r.difficulty === difficultyFilter);
    if (companyFilter) result = result.filter((r) => r.company === companyFilter);
    if (showRevisionOnly) result = result.filter((r) => progressMap[r.id]?.inRevisionList);
    if (statusFilter) result = result.filter((r) => (progressMap[r.id]?.status ?? "not-started") === statusFilter);
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "askedAt") cmp = (a.askedAt || "").localeCompare(b.askedAt || "");
      else if (sortField === "createdAt") cmp = a.createdAt - b.createdAt;
      else if (sortField === "title") cmp = a.title.localeCompare(b.title);
      else if (sortField === "company") cmp = a.company.localeCompare(b.company);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [resources, searchTerm, difficultyFilter, companyFilter, statusFilter, showRevisionOnly, sortField, sortDir, progressMap]);

  const hasActiveFilters = Boolean(searchTerm || difficultyFilter || companyFilter || statusFilter || showRevisionOnly);
  const resetFilters = () => { setSearchTerm(""); setDifficultyFilter(""); setCompanyFilter(""); setStatusFilter(""); setShowRevisionOnly(false); };
  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    resources.forEach((r) => r.tags.forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    return counts;
  }, [resources]);

  const companiesUsed = useMemo(() => {
    const set = new Set(resources.map((r) => r.company));
    return COMPANIES.filter((c) => set.has(c));
  }, [resources]);

  if (!track) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Track not found.</p>
        <Button onClick={onBack} className="mt-4 h-8 text-xs cursor-pointer rounded-md">Go Back</Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="size-3" />
            All Tracks
          </button>
        }
        title={`${track.icon} ${track.name}`}
        description={track.description}
        actions={
          <Button onClick={handleAdd} className="h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer rounded-md">
            <Plus className="size-3.5 mr-1" />
            Add Question
          </Button>
        }
      />

      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8 pl-8 text-xs bg-secondary border-border text-foreground placeholder:text-muted-foreground" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 text-xs text-foreground border-border bg-secondary hover:bg-accent cursor-pointer rounded-md">{companyFilter || "Company"} <ChevronDown size={14} className="ml-1" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border text-foreground max-h-60 overflow-y-auto">
              <DropdownMenuItem className="hover:bg-accent cursor-pointer text-xs" onClick={() => setCompanyFilter("")}>{!companyFilter && <span className="mr-2">✅</span>}All</DropdownMenuItem>
              {companiesUsed.map((c) => (
                <DropdownMenuItem key={c} className={`hover:bg-accent cursor-pointer text-xs ${companyFilter === c ? "bg-secondary font-semibold text-success" : ""}`} onClick={() => setCompanyFilter(companyFilter === c ? "" : c)}>
                  {companyFilter === c && <span className="mr-2">✅</span>}{c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 text-xs text-foreground border-border bg-secondary hover:bg-accent cursor-pointer rounded-md">{difficultyFilter || "Difficulty"} <ChevronDown size={14} className="ml-1" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border text-foreground">
              {["", "Easy", "Medium", "Hard"].map((d) => (
                <DropdownMenuItem key={d || "all"} className={`hover:bg-accent cursor-pointer text-xs ${difficultyFilter === d ? "bg-secondary font-semibold text-success" : ""}`} onClick={() => setDifficultyFilter(d as "" | DifficultyLevel)}>
                  {difficultyFilter === d && <span className="mr-2">✅</span>}{d || "All"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 text-xs text-foreground border-border bg-secondary hover:bg-accent cursor-pointer rounded-md">{statusFilter ? STATUS_LABELS[statusFilter] : "Status"} <ChevronDown size={14} className="ml-1" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border text-foreground">
              <DropdownMenuItem className="hover:bg-accent cursor-pointer text-xs" onClick={() => setStatusFilter("")}>{!statusFilter && <span className="mr-2">✅</span>}All</DropdownMenuItem>
              {(["not-started", "in-progress", "completed"] as ResourceStatus[]).map((s) => (
                <DropdownMenuItem key={s} className={`hover:bg-accent cursor-pointer text-xs ${statusFilter === s ? "bg-secondary font-semibold text-success" : ""}`} onClick={() => setStatusFilter(statusFilter === s ? "" : s)}>
                  {statusFilter === s && <span className="mr-2">✅</span>}{STATUS_LABELS[s]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => setShowRevisionOnly(!showRevisionOnly)} className={`h-8 text-xs cursor-pointer rounded-md ${showRevisionOnly ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" : "text-foreground border-border bg-secondary hover:bg-accent"}`}>
            <RotateCcw className="size-3 mr-1" /> Revision
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 text-xs text-foreground border-border bg-secondary hover:bg-accent cursor-pointer rounded-md">
                <ArrowUpDown className="size-3 mr-1" />{sortField === "askedAt" ? "Date Asked" : sortField === "createdAt" ? "Added" : sortField === "title" ? "Title" : "Company"}{sortDir === "asc" ? " ↑" : " ↓"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border text-foreground">
              {[{ field: "askedAt" as SortField, label: "Date Asked" }, { field: "createdAt" as SortField, label: "Date Added" }, { field: "title" as SortField, label: "Title" }, { field: "company" as SortField, label: "Company" }].map(({ field, label }) => (
                <DropdownMenuItem key={field} className={`hover:bg-accent cursor-pointer text-xs ${sortField === field ? "bg-secondary font-semibold text-success" : ""}`} onClick={() => toggleSort(field)}>
                  {sortField === field && <span className="mr-2">{sortDir === "asc" ? "↑" : "↓"}</span>}{label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters} className="h-8 text-xs text-foreground border-border bg-secondary hover:bg-accent cursor-pointer rounded-md">Clear</Button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4 text-[11px] text-muted-foreground/60">
          <span>{filteredResources.length} of {resources.length} questions</span>
          {resources.length > 0 && (
            <>
              <span className="w-px h-3 bg-border" />
              <span>{resources.filter((r) => progressMap[r.id]?.status === "completed").length} completed</span>
              <span className="w-px h-3 bg-border" />
              <span>{resources.filter((r) => progressMap[r.id]?.inRevisionList).length} in revision</span>
              <span className="w-px h-3 bg-border" />
              <span>{Object.keys(tagCounts).length} unique tags</span>
            </>
          )}
        </div>

        <div className="mt-1">
          {filteredResources.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} progress={progressMap[resource.id]} progressEnabled={Boolean(auth.user)} onRequireAuth={auth.login} onStatusChange={setStatus} onToggleRevision={toggleRevision} onSaveNotes={savePersonalNotes} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-16 text-center">
              <BookOpen className="mx-auto size-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">{hasActiveFilters ? "No questions match the current filters." : "No questions yet. Add your first question!"}</p>
              {!hasActiveFilters && <Button onClick={handleAdd} className="mt-4 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer rounded-md"><Plus className="size-3 mr-1" />Add Question</Button>}
            </div>
          )}
        </div>
      </div>

      <ResourceDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingResource ? { id: editingResource.id, title: editingResource.title, company: editingResource.company, difficulty: editingResource.difficulty, tags: editingResource.tags, resourceLinks: editingResource.resourceLinks, askedAt: editingResource.askedAt, notes: editingResource.notes } : undefined} onSave={handleSave} />
    </>
  );
};

const TracksPage = () => {
  const auth = useAuth();
  const { tracks, loading, addTrack, updateTrack, deleteTrack, archiveTrack, mergeTracks } = useTracks(auth.user?.uid);
  const { resources } = useResources(auth.user?.uid);
  const { progressMap, setStatus, toggleRevision, savePersonalNotes } = useResourceProgress(auth.user?.uid);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const bookmarkedResources = useMemo(
    () => resources.filter((r) => progressMap[r.id]?.inRevisionList),
    [resources, progressMap]
  );
  const [manageOpen, setManageOpen] = useState(false);

  const trackResourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tracks) {
      counts[t.id] = resources.filter((r) => r.track === t.id).length;
    }
    return counts;
  }, [tracks, resources]);

  const handleDeleteTrack = useCallback(
    async (trackId: string, cascade?: boolean) => {
      if (cascade && auth.user?.uid) {
        await resourceService.deleteResourcesByTrack(auth.user.uid, trackId).catch(() => {});
      }
      deleteTrack(trackId);
    },
    [auth.user?.uid, deleteTrack]
  );

  const visibleTracks = useMemo(
    () => tracks.filter((t) => showArchived || !t.archived),
    [tracks, showArchived]
  );

  const trackStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; inRevision: number }> = {};
    for (const track of tracks) {
      const trackResources = resources.filter((r) => r.track === track.id);
      const total = trackResources.length;
      const completed = trackResources.filter((r) => progressMap[r.id]?.status === "completed").length;
      const inRevision = trackResources.filter((r) => progressMap[r.id]?.inRevisionList).length;
      stats[track.id] = { total, completed, inRevision };
    }
    return stats;
  }, [tracks, resources, progressMap]);

  const archivedCount = tracks.filter((t) => t.archived).length;

  const selectedTrack = tracks.find((t) => t.id === selectedTrackId);

  if (selectedTrack) {
    return (
      <AppShell footer={<Footer />}>
        <TrackDetailView trackId={selectedTrack.id} tracks={tracks} onBack={() => setSelectedTrackId(null)} />
      </AppShell>
    );
  }

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow="Tracks"
        title="Tracks"
        description="Organize your learning across any topic"
        actions={
          <div className="flex items-center gap-2">
            {archivedCount > 0 && (
              <Button
                onClick={() => setShowArchived(!showArchived)}
                variant="outline"
                className={`h-8 text-xs cursor-pointer rounded-md ${showArchived ? "bg-muted text-foreground border-foreground/20" : "border-border bg-secondary hover:bg-accent text-muted-foreground"}`}
              >
                <Archive className="size-3 mr-1" />
                {showArchived ? "Hide Archived" : `${archivedCount} Archived`}
              </Button>
            )}
            <Button
              onClick={() => setManageOpen(true)}
              variant="outline"
              className="h-8 text-xs border-border bg-secondary hover:bg-accent cursor-pointer rounded-md"
            >
              <Settings2 className="size-3 mr-1" />
              Manage
            </Button>
            {auth.user && (
              <Button
                onClick={() => setManageOpen(true)}
                className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer rounded-md"
              >
                <Plus className="size-3 mr-1" />
                Add Track
              </Button>
            )}
          </div>
        }
      />

      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {loading && <LoadingState />}

        {/* Bookmarks Section */}
        {bookmarkedResources.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex size-6 items-center justify-center rounded-md bg-amber-500/15">
                <Star className="size-3 text-amber-400 fill-amber-400" />
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Bookmarks</h2>
              <span className="text-[10px] text-muted-foreground/50">{bookmarkedResources.length} items</span>
              <div className="h-px flex-1 bg-border/40 ml-2" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarkedResources.map((r) => (
                <ResourceCard
                  key={r.id}
                  resource={r}
                  progress={progressMap[r.id]}
                  progressEnabled={Boolean(auth.user)}
                  onRequireAuth={auth.login}
                  onStatusChange={setStatus}
                  onToggleRevision={(id) => toggleRevision(id)}
                  onSaveNotes={(id, notes) => savePersonalNotes(id, notes)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTracks.map((track) => {
            const stats = trackStats[track.id] ?? { total: 0, completed: 0, inRevision: 0 };
            return (
              <TrackCard
                key={track.id}
                track={track}
                total={stats.total}
                completed={stats.completed}
                inRevision={stats.inRevision}
                onClick={() => setSelectedTrackId(track.id)}
                onArchive={auth.user ? (archived) => archiveTrack(track.id, archived) : undefined}
              />
            );
          })}
        </div>

        {visibleTracks.length === 0 && !loading && (
          <div className="mt-8 rounded-xl border border-dashed border-border bg-card/40 px-4 py-16 text-center">
            <BookOpen className="mx-auto size-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {showArchived ? "No archived tracks" : "No tracks yet"}
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              {showArchived
                ? "Tracks you archive will appear here"
                : "Create your first track to start organizing resources"}
            </p>
            {auth.user && !showArchived && (
              <Button onClick={() => setManageOpen(true)} className="mt-4 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer rounded-md">
                <Plus className="size-3 mr-1" />Create Track
              </Button>
            )}
          </div>
        )}
      </div>

      <ManageTracksDialog
        open={manageOpen}
        onOpenChange={setManageOpen}
        tracks={tracks}
        onAdd={addTrack}
        onUpdate={updateTrack}
        onDelete={handleDeleteTrack}
        onMerge={mergeTracks}
        trackResourceCounts={trackResourceCounts}
      />
    </AppShell>
  );
};

export default TracksPage;
