"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListPlus, Loader2, Plus, Search, Check, Star, BookOpen, FolderKanban } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Collection } from "@/hooks/useCollections";

interface AddToCollectionDialogProps {
  problemId: string;
  problemTitle: string;
  collections: Collection[];
  isProblemInCollection: (problemId: string, collectionId: string) => boolean;
  onToggleBookmarked: (problemId: string) => void;
  onAddProblem: (collectionId: string, problemId: string) => Promise<void>;
  onRemoveProblem: (collectionId: string, problemId: string) => Promise<void>;
  onCreateCollection: (name: string, description?: string) => Promise<void>;
}

const typeIcons: Record<string, typeof Star> = {
  favorites: Star,
  builtin: BookOpen,
  custom: FolderKanban,
};

const typeColors: Record<string, string> = {
  favorites: "text-yellow-500",
  builtin: "text-info",
  custom: "text-success",
};

const AddToCollectionDialog = ({
  problemId,
  problemTitle,
  collections,
  isProblemInCollection,
  onToggleBookmarked,
  onAddProblem,
  onRemoveProblem,
  onCreateCollection,
}: AddToCollectionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const favoritesCol = collections.find((c) => c.type === "favorites");
  const builtinCols = collections.filter((c) => c.type === "builtin");
  const customCols = collections.filter((c) => c.type === "custom");

  const filteredBuiltin = useMemo(
    () => builtinCols.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [builtinCols, search],
  );
  const filteredCustom = useMemo(
    () => customCols.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [customCols, search],
  );

  const listCount = collections.filter((c) => c.type !== "favorites" && isProblemInCollection(problemId, c.id)).length;

  const handleToggle = async (collection: Collection) => {
    setToggling((prev) => new Set(prev).add(collection.id));
    try {
      if (collection.type === "favorites") {
        onToggleBookmarked(problemId);
      } else {
        const isIn = isProblemInCollection(problemId, collection.id);
        if (isIn) {
          await onRemoveProblem(collection.id, problemId);
        } else {
          await onAddProblem(collection.id, problemId);
        }
      }
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(collection.id);
        return next;
      });
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await onCreateCollection(newName.trim(), newDesc.trim() || undefined);
    setNewName("");
    setNewDesc("");
    setCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Add to collection"
        >
          <ListPlus className="size-3.5" />
          <span>List</span>
          {listCount > 0 && (
            <span className="flex items-center justify-center size-4 rounded-full bg-success/15 text-success text-[10px] font-semibold leading-none">
              {listCount}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Add to Collection</DialogTitle>
          <p className="text-xs text-muted-foreground truncate">{problemTitle}</p>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collections..."
            className="h-8 pl-8 text-xs"
          />
        </div>

        <div className="max-h-64 space-y-1 overflow-y-auto">
          {/* Favorites */}
          {favoritesCol && (!search || favoritesCol.name.toLowerCase().includes(search.toLowerCase())) && (
            <CollectionRow
              collection={favoritesCol}
              isChecked={isProblemInCollection(problemId, favoritesCol.id)}
              isToggling={toggling.has(favoritesCol.id)}
              onToggle={() => handleToggle(favoritesCol)}
            />
          )}

          {/* Built-in Collections */}
          {filteredBuiltin.length > 0 && (
            <div className="pt-2">
              <p className="px-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Built-in
              </p>
              {filteredBuiltin.map((c) => (
                <CollectionRow
                  key={c.id}
                  collection={c}
                  isChecked={isProblemInCollection(problemId, c.id)}
                  isToggling={toggling.has(c.id)}
                  onToggle={() => handleToggle(c)}
                />
              ))}
            </div>
          )}

          {/* Custom Collections */}
          {filteredCustom.length > 0 && (
            <div className="pt-2">
              <p className="px-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                My Collections
              </p>
              {filteredCustom.map((c) => (
                <CollectionRow
                  key={c.id}
                  collection={c}
                  isChecked={isProblemInCollection(problemId, c.id)}
                  isToggling={toggling.has(c.id)}
                  onToggle={() => handleToggle(c)}
                />
              ))}
            </div>
          )}

          {filteredBuiltin.length === 0 && filteredCustom.length === 0 && !search && (
            <div className="py-4 text-center text-xs text-muted-foreground/50">
              No collections yet. Create one below.
            </div>
          )}

          {search && filteredBuiltin.length === 0 && filteredCustom.length === 0 && (
            <div className="py-4 text-center text-xs text-muted-foreground/50">
              No collections match &quot;{search}&quot;
            </div>
          )}
        </div>

        {!creating ? (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            <Plus className="size-3.5" />
            New collection
          </button>
        ) : (
          <div className="space-y-2 rounded-lg border border-border p-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Collection name"
              className="h-8 text-xs"
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              autoFocus
            />
            <Input
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              className="h-8 text-xs"
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setCreating(false); setNewName(""); setNewDesc(""); }}
                className="rounded-md px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface CollectionRowProps {
  collection: Collection;
  isChecked: boolean;
  isToggling: boolean;
  onToggle: () => void;
}

const CollectionRow = ({ collection, isChecked, isToggling, onToggle }: CollectionRowProps) => {
  const Icon = typeIcons[collection.type] ?? FolderKanban;
  const iconColor = typeColors[collection.type] ?? "text-muted-foreground";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isToggling}
      className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left hover:bg-accent transition-colors disabled:opacity-60"
    >
      <div className={`flex size-5 shrink-0 items-center justify-center rounded ${iconColor.replace("text-", "bg-")}/10`}>
        {isToggling ? (
          <Loader2 className={`size-3 animate-spin ${iconColor}`} />
        ) : (
          <div className={`flex size-4 items-center justify-center rounded border ${
            isChecked
              ? "bg-primary border-primary text-primary-foreground"
              : "border-border bg-transparent"
          }`}>
            {isChecked && <Check className="size-3" />}
          </div>
        )}
      </div>
      <Icon className={`size-3.5 shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-foreground truncate">{collection.name}</span>
          {collection.count > 0 && (
            <span className="text-[10px] text-muted-foreground/50 tabular-nums">{collection.count}</span>
          )}
        </div>
        {collection.description && (
          <p className="text-[10px] text-muted-foreground/50 truncate">{collection.description}</p>
        )}
      </div>
    </button>
  );
};

export default AddToCollectionDialog;
