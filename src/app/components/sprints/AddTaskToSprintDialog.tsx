"use client";

import { useState, useMemo } from "react";
import { Plus, Search, BookOpen, ListChecks } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useResources } from "@/hooks/useResources";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";
import type { TaskType } from "@/lib/sprints";

interface AddTaskToSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { type: TaskType; itemId: string; title: string }) => void;
  uid?: string | null;
}

const AddTaskToSprintDialog = ({ open, onOpenChange, onAdd, uid }: AddTaskToSprintDialogProps) => {
  const { resources } = useResources(uid ?? undefined);
  const { questionsState } = useProblemWorkspaceData();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"problems" | "resources">("problems");

  const problems = questionsState.questions;

  const filteredProblems = useMemo(() => {
    if (!query.trim()) return problems.slice(0, 15);
    const q = query.toLowerCase();
    return problems.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.company && p.company.toLowerCase().includes(q)) ||
        p.topics.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [problems, query]);

  const filteredResources = useMemo(() => {
    if (!query.trim()) return resources.slice(0, 15);
    const q = query.toLowerCase();
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.company.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 15);
  }, [resources, query]);

  const handleAddProblem = (title: string, problemId: string) => {
    onAdd({ type: "problem", itemId: problemId, title });
    onOpenChange(false);
    setQuery("");
  };

  const handleAddResource = (title: string, resourceId: string) => {
    onAdd({ type: "resource", itemId: resourceId, title });
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-base">Add Task to Sprint</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b border-border px-4 mt-2">
          <Search className="size-3.5 text-muted-foreground shrink-0" />
          <Input
            placeholder="Search problems or resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent h-9 text-sm focus-visible:ring-0 px-2"
          />
        </div>
        <div className="flex gap-0 border-b border-border px-4">
          <button
            type="button"
            onClick={() => setTab("problems")}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors ${
              tab === "problems"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListChecks className="size-3 inline mr-1" />
            Problems
          </button>
          <button
            type="button"
            onClick={() => setTab("resources")}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors ${
              tab === "resources"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="size-3 inline mr-1" />
            Resources
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {tab === "problems" && filteredProblems.map((p) => (
            <button
              key={p.problemId}
              type="button"
              onClick={() => handleAddProblem(p.title, p.problemId)}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-xs hover:bg-accent transition-colors group"
            >
              <ListChecks className="size-3.5 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate font-medium text-foreground">{p.title}</span>
              <span className="text-[10px] text-muted-foreground">{p.difficulty}</span>
              <Plus className="size-3 text-muted-foreground/30 group-hover:text-foreground/50 shrink-0" />
            </button>
          ))}
          {tab === "resources" && filteredResources.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => handleAddResource(r.title, r.id)}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-xs hover:bg-accent transition-colors group"
            >
              <BookOpen className="size-3.5 text-muted-foreground shrink-0" />
              <span className="flex-1 truncate font-medium text-foreground">{r.title}</span>
              <span className="text-[10px] text-muted-foreground">{r.difficulty}</span>
              <Plus className="size-3 text-muted-foreground/30 group-hover:text-foreground/50 shrink-0" />
            </button>
          ))}
          {(tab === "problems" ? filteredProblems : filteredResources).length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No items match your search.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskToSprintDialog;
