"use client";

import { useState, useMemo } from "react";
import { Check, FolderKanban, ListPlus, Loader2, Plus, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CustomList } from "@/lib/progressTypes";

interface AddToListDialogProps {
  problemId: string;
  problemTitle: string;
  lists: CustomList[];
  isProblemInList: (problemId: string) => string[];
  onAddProblem: (listId: string, problemId: string) => Promise<void>;
  onRemoveProblem: (listId: string, problemId: string) => Promise<void>;
  onCreateList: (name: string, description?: string) => Promise<void>;
}

const AddToListDialog = ({
  problemId,
  problemTitle,
  lists,
  isProblemInList,
  onAddProblem,
  onRemoveProblem,
  onCreateList,
}: AddToListDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  const containedIn = isProblemInList(problemId);

  const filteredLists = useMemo(
    () =>
      search.trim()
        ? lists.filter((l) =>
            l.name.toLowerCase().includes(search.toLowerCase())
          )
        : lists,
    [lists, search]
  );

  const toggleList = async (listId: string) => {
    setToggling((prev) => new Set(prev).add(listId));
    try {
      if (containedIn.includes(listId)) {
        await onRemoveProblem(listId, problemId);
      } else {
        await onAddProblem(listId, problemId);
      }
    } finally {
      setToggling((prev) => {
        const next = new Set(prev);
        next.delete(listId);
        return next;
      });
    }
  };

  const handleCreateNew = async () => {
    if (!newName.trim()) return;
    await onCreateList(newName.trim(), newDesc.trim() || undefined);
    setNewName("");
    setNewDesc("");
    setShowNew(false);
  };

  const listCount = containedIn.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all border border-transparent hover:border-border/60 hover:bg-accent/60 hover:text-card-foreground text-muted-foreground"
          aria-label={`Add ${problemTitle} to list`}
        >
          <ListPlus className="size-3.5 transition-transform group-hover:scale-110" />
          <span>List</span>
          {listCount > 0 && (
            <span className="flex items-center justify-center size-4 rounded-full bg-success/15 text-success text-[10px] font-semibold leading-none">
              {listCount}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card text-foreground sm:max-w-sm gap-0 p-0 shadow-2xl">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center gap-2 mb-0.5">
            <FolderKanban className="size-4 text-muted-foreground shrink-0" />
            <DialogTitle className="text-sm font-semibold text-foreground">
              Add to List
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground truncate pl-6">{problemTitle}</p>
          <div className="relative mt-2.5">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search lists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary pl-8 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-success/50 focus:ring-1 focus:ring-success/20 focus:outline-none transition-all"
              autoComplete="off"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-accent"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-64 overflow-y-auto py-1.5 px-1.5 scrollbar-thin-dark">
          {lists.length === 0 && !showNew ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center px-4">
              <div className="size-10 rounded-full bg-secondary flex items-center justify-center">
                <FolderKanban className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">No lists yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Create one to organize this problem.</p>
              </div>
            </div>
          ) : filteredLists.length === 0 && search ? (
            <div className="py-8 text-center px-4">
              <div className="size-8 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2">
                <Search className="size-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-foreground font-medium">No results</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                No lists matching &ldquo;{search}&rdquo;
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredLists.map((list) => {
                const checked = containedIn.includes(list.id);
                const loading = toggling.has(list.id);
                return (
                  <button
                    key={list.id}
                    type="button"
                    disabled={loading}
                    onClick={() => toggleList(list.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                      checked
                        ? "bg-success/8 text-success"
                        : "text-foreground hover:bg-accent/60"
                    } ${loading ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
                  >
                    <span
                      className={`flex size-4.5 shrink-0 items-center justify-center rounded border transition-all duration-150 ${
                        checked
                          ? "border-success bg-success text-primary-foreground"
                          : "border-border bg-secondary group-hover:border-foreground/30"
                      }`}
                    >
                      {loading ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : checked ? (
                        <Check className="size-3" />
                      ) : null}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate font-medium leading-tight">{list.name}</span>
                      {list.description && (
                        <span className="block text-xs text-muted-foreground truncate mt-0.5 leading-tight">
                          {list.description}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center justify-center size-5 rounded-md bg-secondary text-[11px] font-medium text-muted-foreground shrink-0">
                      {list.problemIds.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {showNew && (
            <div className="border-t border-border mx-0 mt-2 pt-3 pb-1 px-2 space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="List name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
                  className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-success/50 focus:ring-1 focus:ring-success/20 focus:outline-none transition-all"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={!newName.trim()}
                  onClick={handleCreateNew}
                  className="bg-success text-primary-foreground hover:bg-green-400 h-9 px-4 text-xs font-semibold shrink-0 rounded-lg"
                >
                  Create
                </Button>
              </div>
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
                className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-success/50 focus:ring-1 focus:ring-success/20 focus:outline-none transition-all"
              />
            </div>
          )}
        </div>

        {!showNew && (
          <div className="border-t border-border px-3 py-2.5">
            <button
              type="button"
              onClick={() => setShowNew(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-card-foreground hover:bg-accent/60 transition-all border border-dashed border-border/60 hover:border-border"
            >
              <Plus className="size-4" />
              New list
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddToListDialog;
