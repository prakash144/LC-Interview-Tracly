"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; goal: string; startDate: string; endDate: string }) => void;
}

const SprintDialog = ({ open, onOpenChange, onSave }: SprintDialogProps) => {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), goal: goal.trim(), startDate, endDate });
    setName("");
    setGoal("");
    onOpenChange(false);
  };

  const suggestions = [
    { name: "DSA Foundation", icon: "📘", desc: "Arrays, Strings, Hash Maps" },
    { name: "System Design Deep Dive", icon: "🏗", desc: "HLD, scalability, distributed systems" },
    { name: "Interview Warmup", icon: "🎯", desc: "Mixed problems + behavioral prep" },
    { name: "Company Focus", icon: "🏢", desc: "Target specific company patterns" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">New Sprint</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Sprint Name</label>
            <Input
              placeholder="e.g. Sprint 1 — Arrays & Graphs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-sm"
              required
            />
          </div>

          {/* Quick templates */}
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Quick Templates</label>
            <div className="grid grid-cols-2 gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => {
                    setName(s.name);
                    setGoal(s.desc);
                  }}
                  className="text-left rounded-lg border border-border bg-secondary/50 p-2 hover:bg-accent transition-colors text-[11px]"
                >
                  <span className="text-sm">{s.icon}</span>
                  <div className="font-medium text-foreground mt-0.5">{s.name}</div>
                  <div className="text-muted-foreground truncate">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Goal</label>
            <Input
              placeholder="What do you want to achieve?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-sm"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/80"
            >
              <Plus className="size-3 mr-1" />
              Create Sprint
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SprintDialog;
