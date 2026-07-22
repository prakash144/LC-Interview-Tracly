"use client";

import { useState } from "react";
import { Save, X, Text, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SprintTaskV2, Priority, TaskStatusV2 } from "@/lib/sprints";

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-muted-foreground" },
  { value: "medium", label: "Medium", color: "text-info" },
  { value: "high", label: "High", color: "text-warning" },
  { value: "critical", label: "Critical", color: "text-destructive" },
];

const STATUSES: { value: TaskStatusV2; label: string; color: string }[] = [
  { value: "backlog", label: "Backlog", color: "bg-muted-foreground/10 text-muted-foreground" },
  { value: "todo", label: "To Do", color: "bg-info/10 text-info" },
  { value: "in-progress", label: "In Progress", color: "bg-warning/10 text-warning" },
  { value: "review", label: "Review", color: "bg-purple-500/10 text-purple-500" },
  { value: "done", label: "Done", color: "bg-success/10 text-success" },
];

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: SprintTaskV2 | null;
  onSave: (taskId: string, data: Partial<SprintTaskV2>) => void;
  tracks: { id: string; name: string; icon: string }[];
}

const TaskDetailDialog = ({ open, onOpenChange, task, onSave, tracks }: TaskDetailDialogProps) => {
  const [form, setForm] = useState<Partial<SprintTaskV2>>({});
  const [tagInput, setTagInput] = useState("");

  const initForm = () => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        track: task.track,
        priority: task.priority,
        difficulty: task.difficulty,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
        status: task.status,
        dueDate: task.dueDate,
        company: task.company,
        tags: [...task.tags],
        notes: task.notes,
      });
    }
    setTagInput("");
  };

  const handleSave = () => {
    if (!task || !form.title?.trim()) return;
    onSave(task.id, form);
    onOpenChange(false);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !(form.tags ?? []).includes(t)) {
      setForm({ ...form, tags: [...(form.tags ?? []), t] });
    }
    setTagInput("");
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onOpenChange(false); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" onOpenAutoFocus={initForm}>
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
              <Text className="size-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">Edit Task</DialogTitle>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Update task details and metadata</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Title</label>
            <Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-8 text-sm" placeholder="Task title" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full h-20 rounded-md border border-border bg-background px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Track</label>
              <select
                value={form.track ?? ""}
                onChange={(e) => setForm({ ...form, track: e.target.value })}
                className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs"
              >
                <option value="">No track</option>
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Priority</label>
              <select
                value={form.priority ?? "medium"}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Status</label>
              <select
                value={form.status ?? "todo"}
                onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatusV2 })}
                className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Difficulty</label>
              <select
                value={form.difficulty ?? ""}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full h-8 rounded-md border border-border bg-background px-2 text-xs"
              >
                <option value="">Any</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Est. Hours</label>
              <Input type="number" min={0} step={0.5} value={form.estimatedHours ?? 0} onChange={(e) => setForm({ ...form, estimatedHours: parseFloat(e.target.value) || 0 })} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Actual Hours</label>
              <Input type="number" min={0} step={0.5} value={form.actualHours ?? 0} onChange={(e) => setForm({ ...form, actualHours: parseFloat(e.target.value) || 0 })} className="h-8 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Company</label>
              <Input value={form.company ?? ""} onChange={(e) => setForm({ ...form, company: e.target.value })} className="h-8 text-sm" placeholder="e.g. Google" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Due Date</label>
              <Input type="date" value={form.dueDate ?? ""} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="h-8 text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Tags</label>
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              {(form.tags ?? []).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">
                  {tag}
                  <button type="button" onClick={() => setForm({ ...form, tags: (form.tags ?? []).filter((t) => t !== tag) })} className="hover:text-destructive">
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className="h-7 text-xs flex-1" placeholder="Add tag..." />
              <Button type="button" onClick={addTag} className="h-7 text-xs" variant="outline"><Plus className="size-3" /></Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Notes</label>
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full h-16 rounded-md border border-border bg-background px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Personal notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-8 text-xs">Cancel</Button>
          <Button type="button" onClick={handleSave} className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/80">
            <Save className="size-3 mr-1" />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
