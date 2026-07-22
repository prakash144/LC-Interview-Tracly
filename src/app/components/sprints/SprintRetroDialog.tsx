"use client";

import { useState } from "react";
import { Save, X, Sparkles, TrendingUp, TrendingDown, Target, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SprintRetro } from "@/lib/sprints";

interface SprintRetroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (retro: SprintRetro) => void;
}

const commonWeaknesses = [
  "Time management", "System design scope", "Coding speed",
  "Edge cases", "Communication", "Algorithm selection",
  "Data structures", "Testing strategy", "Trade-off analysis",
  "Prioritization", "Code organization", "Problem breakdown",
];

const SprintRetroDialog = ({ open, onOpenChange, onSave }: SprintRetroDialogProps) => {
  const [wentWell, setWentWell] = useState("");
  const [wentWrong, setWentWrong] = useState("");
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [rating, setRating] = useState(3);
  const [actionItems, setActionItems] = useState("");
  const [customWeakness, setCustomWeakness] = useState("");

  const toggleWeakness = (w: string) => {
    setWeaknesses((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]
    );
  };

  const addCustomWeakness = () => {
    if (customWeakness.trim() && !weaknesses.includes(customWeakness.trim())) {
      setWeaknesses((prev) => [...prev, customWeakness.trim()]);
      setCustomWeakness("");
    }
  };

  const handleSave = () => {
    onSave({
      wentWell: wentWell.trim(),
      wentWrong: wentWrong.trim(),
      weaknesses,
      rating,
      actionItems: actionItems.trim(),
      completedAt: Date.now(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-warning/20 to-warning/5 border border-warning/20">
              <Sparkles className="size-4 text-warning" />
            </div>
            <div>
              <DialogTitle className="text-base">Sprint Retrospective</DialogTitle>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Reflect on your sprint to improve next time</p>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <TrendingUp className="size-3 text-success" />
              What went well?
            </label>
            <Input
              placeholder="What worked? What did you do well?"
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <TrendingDown className="size-3 text-destructive" />
              What went wrong?
            </label>
            <Input
              placeholder="What could have gone better?"
              value={wentWrong}
              onChange={(e) => setWentWrong(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Target className="size-3 text-info" />
              Weaknesses identified
            </label>
            <div className="flex flex-wrap gap-1.5">
              {commonWeaknesses.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => toggleWeakness(w)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                    weaknesses.includes(w)
                      ? "bg-destructive/15 border-destructive/30 text-destructive font-medium"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 mt-1">
              <Input
                placeholder="Add custom weakness..."
                value={customWeakness}
                onChange={(e) => setCustomWeakness(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomWeakness())}
                className="h-7 text-xs flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addCustomWeakness}
                className="h-7 text-xs shrink-0"
              >
                Add
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Star className="size-3 text-warning" />
              Sprint Rating
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`size-8 rounded-lg text-sm font-bold transition-all ${
                    n <= rating
                      ? "bg-warning/20 text-warning border border-warning/30 scale-105"
                      : "bg-secondary text-muted-foreground border border-border hover:border-foreground/20"
                  }`}
                >
                  {n}
                </button>
              ))}
              {rating > 0 && (
                <span className="text-xs text-muted-foreground/60 self-center ml-1">
                  {rating === 1 ? "Needs work" : rating === 2 ? "Below average" : rating === 3 ? "Decent" : rating === 4 ? "Great" : "Excellent!"}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Target className="size-3 text-success" />
              Action items for next sprint
            </label>
            <Input
              placeholder="What will you do differently?"
              value={actionItems}
              onChange={(e) => setActionItems(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            <X className="size-3 mr-1" />
            Skip
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/80"
          >
            <Save className="size-3 mr-1" />
            Save Retro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SprintRetroDialog;
