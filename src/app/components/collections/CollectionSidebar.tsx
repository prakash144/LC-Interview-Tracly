"use client";

import { useState } from "react";
import { Plus, PencilLine, Trash2, Check, X, Star, BookOpen, FolderKanban, ListPlus } from "lucide-react";
import type { Collection } from "@/hooks/useCollections";

interface CollectionSidebarProps {
  collections: Collection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateCollection: (name: string, description?: string) => Promise<void>;
  onRenameCollection: (id: string, name: string) => Promise<void>;
  onDeleteCollection: (id: string) => Promise<void>;
}

const CollectionSidebar = ({
  collections,
  selectedId,
  onSelect,
  onCreateCollection,
  onRenameCollection,
  onDeleteCollection,
}: CollectionSidebarProps) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const favCol = collections.find((c) => c.type === "favorites");
  const builtinCols = collections.filter((c) => c.type === "builtin");
  const customCols = collections.filter((c) => c.type === "custom");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await onCreateCollection(newName.trim(), newDesc.trim() || undefined);
    setNewName("");
    setNewDesc("");
    setShowCreate(false);
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    await onRenameCollection(id, editName.trim());
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this collection? Problems will not be affected.")) return;
    await onDeleteCollection(id);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Favorites */}
      {favCol && (
        <CollectionItem
          collection={favCol}
          isSelected={selectedId === favCol.id}
          onSelect={() => onSelect(favCol.id)}
          icon={Star}
          iconColor="text-yellow-500"
        />
      )}

      {/* Built-in Collections */}
      {builtinCols.length > 0 && (
        <>
          <div className="mt-4 mb-1 px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Built-in
          </div>
          {builtinCols.map((c) => (
            <CollectionItem
              key={c.id}
              collection={c}
              isSelected={selectedId === c.id}
              onSelect={() => onSelect(c.id)}
              icon={BookOpen}
              iconColor="text-info"
            />
          ))}
        </>
      )}

      {/* Custom Collections */}
      {customCols.length > 0 && (
        <>
          <div className="mt-4 mb-1 px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            My Collections
          </div>
          {customCols.map((c) => (
            <div key={c.id} className="group relative">
              {editingId === c.id ? (
                <div className="flex items-center gap-1 px-2 py-1.5">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRename(c.id)}
                    className="flex-1 rounded border border-border bg-secondary px-2 py-0.5 text-xs text-foreground outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleRename(c.id)}
                    className="rounded p-0.5 text-success hover:text-success/80"
                  >
                    <Check className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <CollectionItem
                  collection={c}
                  isSelected={selectedId === c.id}
                  onSelect={() => onSelect(c.id)}
                  icon={FolderKanban}
                  iconColor="text-success"
                >
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5 bg-card/90 rounded-md px-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setEditingId(c.id); setEditName(c.name); }}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                      aria-label="Rename"
                    >
                      <PencilLine className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                      className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </CollectionItem>
              )}
            </div>
          ))}
        </>
      )}

      {/* Create Collection */}
      {showCreate ? (
        <div className="mt-2 rounded-lg border border-success/30 bg-success/5 p-3 space-y-2">
          <input
            type="text"
            placeholder="Collection name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="w-full rounded-md border border-border bg-secondary px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="rounded-md bg-success px-2.5 py-1 text-[11px] font-medium text-primary-foreground hover:bg-success/80 transition-colors disabled:opacity-50"
            >
              <ListPlus className="size-3 inline mr-1" />
              Create
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="mt-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Plus className="size-3.5" />
          Create Collection
        </button>
      )}
    </div>
  );
};

interface CollectionItemProps {
  collection: Collection;
  isSelected: boolean;
  onSelect: () => void;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  children?: React.ReactNode;
}

const CollectionItem = ({ collection, isSelected, onSelect, icon: Icon, iconColor, children }: CollectionItemProps) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onSelect}
    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
    className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors cursor-pointer ${
      isSelected ? "bg-accent/60 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
    }`}
  >
    <Icon className={`size-3.5 shrink-0 ${iconColor}`} />
    <span className="text-xs font-medium truncate flex-1">{collection.name}</span>
    <span className="text-[10px] text-muted-foreground/50 tabular-nums">{collection.count}</span>
    {children}
  </div>
);

export default CollectionSidebar;
