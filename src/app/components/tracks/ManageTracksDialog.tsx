"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GitMerge, Save, Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Track } from "@/lib/tracks";

const TRACK_COLORS = [
  "text-blue-500", "text-purple-500", "text-amber-500",
  "text-emerald-500", "text-rose-500", "text-sky-500",
  "text-violet-500", "text-teal-500", "text-orange-500",
  "text-pink-500", "text-indigo-500", "text-cyan-500",
];

const TRACK_ICONS = [
  "📘", "🏗", "⚙", "🧠", "👥", "🎤", "🤖", "📚", "💪", "🧘", "🎯", "⭐",
  "🔥", "💡", "🎨", "🎵", "✍️", "🗣", "🧭", "🎪",
];

interface ManageTracksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tracks: Track[];
  onAdd: (data: { name: string; icon: string; color: string; description: string; shortDescription: string }) => void;
  onUpdate: (trackId: string, data: Partial<Track>) => void;
  onDelete: (trackId: string, cascade?: boolean) => void;
  onMerge?: (sourceId: string, targetId: string) => void;
  trackResourceCounts?: Record<string, number>;
}

const TrackForm = ({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Track | null;
  onSave: (data: { name: string; icon: string; color: string; description: string; shortDescription: string }) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "📘");
  const [color, setColor] = useState(initial?.color ?? TRACK_COLORS[0]);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon, color, description: description.trim(), shortDescription: shortDescription.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Name</label>
        <Input
          placeholder="e.g. Book Reading"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8 text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">Icon</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="flex items-center gap-2 h-8 w-full rounded-md border border-border bg-background px-2.5 text-sm hover:bg-accent transition-colors"
            >
              <span className="text-lg">{icon}</span>
              <span className="text-xs text-muted-foreground">Change</span>
            </button>
            {showIconPicker && (
              <div className="absolute z-10 top-full mt-1 left-0 p-2 rounded-lg border border-border bg-card shadow-lg grid grid-cols-5 gap-1 w-48">
                {TRACK_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => { setIcon(ic); setShowIconPicker(false); }}
                    className={`size-8 flex items-center justify-center rounded-md text-lg hover:bg-accent transition-colors ${icon === ic ? "bg-accent ring-1 ring-primary" : ""}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">Color</label>
          <div className="flex flex-wrap gap-1">
            {TRACK_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`size-6 rounded-md border transition-all ${
                  color === c ? "border-foreground ring-1 ring-foreground scale-110" : "border-border"
                }`}
              >
                <div className={`size-full rounded-sm ${c.replace("text-", "bg-")}/30`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Description</label>
        <Input
          placeholder="What is this track about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">Short Description</label>
        <Input
          placeholder="Brief summary for card view"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel} className="h-8 text-xs">
          Cancel
        </Button>
        <Button type="submit" className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/80">
          <Save className="size-3 mr-1" />
          {initial ? "Update Track" : "Add Track"}
        </Button>
      </div>
    </form>
  );
};

const ManageTracksDialog = ({
  open,
  onOpenChange,
  tracks,
  onAdd,
  onUpdate,
  onDelete,
  onMerge,
  trackResourceCounts = {},
}: ManageTracksDialogProps) => {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingTrackId, setDeletingTrackId] = useState<string | null>(null);
  const [mergingTrackId, setMergingTrackId] = useState<string | null>(null);

  const deletingTrack = deletingTrackId ? tracks.find((t) => t.id === deletingTrackId) ?? null : null;
  const deletingCount = deletingTrackId ? trackResourceCounts[deletingTrackId] ?? 0 : 0;

  const editingTrack = editingId ? tracks.find((t) => t.id === editingId) ?? null : null;
  const mergingTrack = mergingTrackId ? tracks.find((t) => t.id === mergingTrackId) ?? null : null;

  const handleSave = (data: { name: string; icon: string; color: string; description: string; shortDescription: string }) => {
    if (editingTrack) {
      onUpdate(editingTrack.id, data);
    } else {
      onAdd(data);
    }
    setAdding(false);
    setEditingId(null);
  };

  const handleDelete = (trackId: string) => {
    setDeletingTrackId(trackId);
  };

  const confirmDelete = (cascade?: boolean) => {
    if (deletingTrackId) {
      onDelete(deletingTrackId, cascade);
      setDeletingTrackId(null);
    }
  };

  const showForm = adding || editingId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
              <Settings2 className="size-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">Manage Tracks</DialogTitle>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Add, edit, or remove tracks</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {!showForm && (
            <Button
              type="button"
              onClick={() => setAdding(true)}
              className="w-full h-8 text-xs border border-dashed border-border bg-secondary/30 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              variant="outline"
            >
              <Plus className="size-3 mr-1" />
              Add New Track
            </Button>
          )}

          {showForm && (
            <div className="rounded-lg border border-border bg-card/50 p-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <TrackForm
                initial={editingTrack}
                onSave={handleSave}
                onCancel={() => { setAdding(false); setEditingId(null); }}
              />
            </div>
          )}

          <div className="space-y-1">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-border bg-card/30 hover:bg-accent/30 transition-colors group"
              >
                <span className="text-lg shrink-0">{track.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${track.color}`}>{track.name}</span>
                    <span className="text-[10px] text-muted-foreground/50 truncate">{track.shortDescription}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setEditingId(track.id); setAdding(false); }}
                  className="opacity-0 group-hover:opacity-100 size-6 flex items-center justify-center rounded text-muted-foreground/40 hover:text-foreground hover:bg-accent transition-all"
                  aria-label={`Edit ${track.name}`}
                >
                  <Pencil className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setMergingTrackId(track.id)}
                  className="opacity-0 group-hover:opacity-100 size-6 flex items-center justify-center rounded text-muted-foreground/40 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                  aria-label={`Merge ${track.name}`}
                >
                  <GitMerge className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(track.id)}
                  className="opacity-0 group-hover:opacity-100 size-6 flex items-center justify-center rounded text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                  aria-label={`Delete ${track.name}`}
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {deletingTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeletingTrackId(null)}>
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10">
                  <Trash2 className="size-4 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Delete {deletingTrack.icon} {deletingTrack.name}</p>
                  {deletingCount > 0 && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{deletingCount} resource{deletingCount !== 1 ? "s" : ""} in this track</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {deletingCount > 0 ? (
                  <>
                    <Button onClick={() => confirmDelete()} className="h-9 text-xs bg-secondary text-foreground hover:bg-accent border border-border" variant="outline">
                      Just the track (keep resources)
                    </Button>
                    <Button onClick={() => confirmDelete(true)} className="h-9 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/80">
                      <Trash2 className="size-3 mr-1" />
                      Delete track and all {deletingCount} resource{deletingCount !== 1 ? "s" : ""}
                    </Button>
                    <Button onClick={() => setDeletingTrackId(null)} className="h-9 text-xs text-muted-foreground hover:text-foreground" variant="ghost">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground/70">No resources in this track. Delete it?</p>
                    <div className="flex gap-2 justify-end">
                      <Button onClick={() => setDeletingTrackId(null)} className="h-8 text-xs" variant="outline">Cancel</Button>
                      <Button onClick={() => confirmDelete()} className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/80">Delete</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {mergingTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setMergingTrackId(null)}>
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-sm w-full mx-4 p-5 animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <GitMerge className="size-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Merge {mergingTrack.icon} {mergingTrack.name}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">Select the target track to merge into</p>
                </div>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {tracks.filter((t) => t.id !== mergingTrack.id).map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => {
                      onMerge?.(mergingTrack.id, target.id);
                      setMergingTrackId(null);
                    }}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2 border border-border bg-card/30 hover:bg-accent/50 transition-colors text-left"
                  >
                    <span className="text-lg">{target.icon}</span>
                    <div>
                      <span className={`text-sm font-medium ${target.color}`}>{target.name}</span>
                      <span className="text-[10px] text-muted-foreground/50 ml-2">{trackResourceCounts[target.id] ?? 0} resources</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setMergingTrackId(null)} className="h-8 text-xs" variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManageTracksDialog;
