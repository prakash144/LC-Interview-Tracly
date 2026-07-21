"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, ChevronLeft, CalendarDays, Target, Play, CheckCircle2, Trash2, X, Star, Sparkles, Lightbulb, TrendingUp, TrendingDown } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import Footer from "@/app/components/Footer";
import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/states/LoadingState";
import SprintCard from "@/app/components/sprints/SprintCard";
import SprintDialog from "@/app/components/sprints/SprintDialog";
import SprintRetroDialog from "@/app/components/sprints/SprintRetroDialog";
import SprintBoard from "@/app/components/sprints/SprintBoard";
import AddTaskToSprintDialog from "@/app/components/sprints/AddTaskToSprintDialog";
import { useAuth } from "@/hooks/useAuth";
import { useSprints } from "@/hooks/useSprints";
import { useSprintTasks } from "@/hooks/useSprints";
import { Button } from "@/components/ui/button";
import type { Sprint, SprintRetro } from "@/lib/sprints";

const SprintsPage = () => {
  const auth = useAuth();
  const { sprints, loading, addSprint, updateSprint, deleteSprint } = useSprints(auth.user?.uid);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [retroOpen, setRetroOpen] = useState(false);
  const [completingSprintId, setCompletingSprintId] = useState<string | null>(null);

  const selectedSprint = useMemo(
    () => sprints.find((s) => s.id === selectedSprintId) ?? null,
    [sprints, selectedSprintId]
  );

  const handleStart = useCallback(
    (id: string) => updateSprint(id, { status: "active", updatedAt: Date.now() }),
    [updateSprint]
  );

  const handleComplete = useCallback(
    (id: string) => {
      setCompletingSprintId(id);
      setRetroOpen(true);
    },
    []
  );

  const handleSaveRetro = useCallback(
    async (retro: SprintRetro) => {
      if (completingSprintId) {
        await updateSprint(completingSprintId, { status: "completed", retro, updatedAt: Date.now() });
        setCompletingSprintId(null);
      }
    },
    [completingSprintId, updateSprint]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Delete this sprint and all its tasks?")) {
        await deleteSprint(id);
        if (selectedSprintId === id) setSelectedSprintId(null);
      }
    },
    [deleteSprint, selectedSprintId]
  );

  const activeSprints = useMemo(() => sprints.filter((s) => s.status === "active"), [sprints]);
  const plannedSprints = useMemo(() => sprints.filter((s) => s.status === "planned"), [sprints]);
  const completedSprints = useMemo(() => sprints.filter((s) => s.status === "completed"), [sprints]);

  if (selectedSprint) {
    return (
      <SprintDetailView
        sprint={selectedSprint}
        uid={auth.user?.uid}
        onBack={() => setSelectedSprintId(null)}
        onStart={() => handleStart(selectedSprint.id)}
        onComplete={() => handleComplete(selectedSprint.id)}
        onDelete={() => handleDelete(selectedSprint.id)}
        onAddTask={() => setAddTaskOpen(true)}
        addTaskOpen={addTaskOpen}
        onAddTaskOpenChange={setAddTaskOpen}
      />
    );
  }

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow="Planning"
        title="Sprints"
        description="Plan, track, and reflect on your interview preparation in sprints"
        actions={
          <Button
            onClick={() => setDialogOpen(true)}
            className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer rounded-md"
          >
            <Plus className="size-3.5 mr-1" />
            New Sprint
          </Button>
        }
      />

      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 pb-10">
        {loading && <LoadingState />}

        {!auth.user && !loading && (
          <div className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">Sign in to plan your interview sprints.</p>
          </div>
        )}

        {auth.user && !loading && (
          <div className="space-y-8">
            {activeSprints.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-success mb-3">Active Sprint</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeSprints.map((s) => (
                    <SprintCardWithTasks
                      key={s.id} sprint={s} uid={auth.user?.uid}
                      onClick={setSelectedSprintId}
                      onStart={handleStart} onComplete={handleComplete} onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {plannedSprints.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Planned</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {plannedSprints.map((s) => (
                    <SprintCardWithTasks
                      key={s.id} sprint={s} uid={auth.user?.uid}
                      onClick={setSelectedSprintId}
                      onStart={handleStart} onComplete={handleComplete} onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {sprints.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card/70 px-4 py-16 text-center">
                <p className="text-sm text-muted-foreground">No sprints yet. Create your first sprint to start planning!</p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="mt-4 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer rounded-md"
                >
                  <Plus className="size-3 mr-1" />
                  Create Sprint
                </Button>
              </div>
            )}

            {completedSprints.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Completed</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {completedSprints.slice(0, 6).map((s) => (
                    <SprintCardWithTasks
                      key={s.id} sprint={s} uid={auth.user?.uid}
                      onClick={setSelectedSprintId}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <SprintDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={(data) => addSprint(data)}
      />

      <SprintRetroDialog
        open={retroOpen}
        onOpenChange={setRetroOpen}
        onSave={handleSaveRetro}
      />
    </AppShell>
  );
};

const SprintCardWithTasks = ({
  sprint, uid, ...actions
}: {
  sprint: Sprint;
  uid?: string | null;
  onClick?: (id: string) => void;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}) => {
  const { tasks } = useSprintTasks(uid, sprint.id);
  return <SprintCard sprint={sprint} tasks={tasks} {...actions} />;
};

const RetroView = ({ retro }: { retro: SprintRetro }) => {
  return (
    <div className="rounded-xl border border-border bg-card/80 p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-4">
        <Sparkles className="size-3.5 text-warning" />
        Sprint Retrospective
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div className="rounded-lg border border-success/20 bg-success/5 p-3">
            <div className="flex items-center gap-1.5 text-xs text-success font-medium mb-1">
              <TrendingUp className="size-3" /> What went well
            </div>
            <p className="text-sm text-foreground">{retro.wentWell || "Not specified"}</p>
          </div>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <div className="flex items-center gap-1.5 text-xs text-destructive font-medium mb-1">
              <TrendingDown className="size-3" /> What went wrong
            </div>
            <p className="text-sm text-foreground">{retro.wentWrong || "Not specified"}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-2">
              <Lightbulb className="size-3" /> Weaknesses
            </div>
            {retro.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {retro.weaknesses.map((w) => (
                  <span key={w} className="text-[11px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                    {w}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">None identified</p>
            )}
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1">
              <Star className="size-3 text-warning" /> Rating
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`text-lg ${n <= retro.rating ? "text-warning" : "text-secondary"}`}>★</span>
              ))}
              <span className="text-xs text-muted-foreground ml-2">{retro.rating}/5</span>
            </div>
          </div>
          {retro.actionItems && (
            <div className="rounded-lg border border-info/20 bg-info/5 p-3">
              <div className="flex items-center gap-1.5 text-xs text-info font-medium mb-1">
                <Target className="size-3" /> Action Items
              </div>
              <p className="text-sm text-foreground">{retro.actionItems}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SprintDetailView = ({
  sprint, uid, onBack, onStart, onComplete, onDelete, onAddTask, addTaskOpen, onAddTaskOpenChange,
}: {
  sprint: Sprint;
  uid?: string | null;
  onBack: () => void;
  onStart: () => void;
  onComplete: () => void;
  onDelete: () => void;
  onAddTask: () => void;
  addTaskOpen: boolean;
  onAddTaskOpenChange: (open: boolean) => void;
}) => {
  const { addTask, updateTaskStatus, removeTask, todoTasks, inProgressTasks, doneTasks, taskStats } = useSprintTasks(uid, sprint.id);

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    planned: { label: "Planned", color: "text-muted-foreground", bg: "bg-secondary" },
    active: { label: "Active", color: "text-success", bg: "bg-success/15" },
    completed: { label: "Completed", color: "text-info", bg: "bg-info/15" },
  };
  const cfg = statusConfig[sprint.status];

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow={
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="size-3" />
            Sprints
          </button>
        }
        title={sprint.name}
        description={sprint.goal || "No goal set"}
        actions={
          <div className="flex items-center gap-1.5">
            {sprint.status === "planned" && (
              <Button onClick={onStart} className="h-7 text-xs bg-success/15 text-success hover:bg-success/25 cursor-pointer rounded-md">
                <Play className="size-3 mr-1" />
                Start
              </Button>
            )}
            {sprint.status === "active" && (
              <Button onClick={onComplete} className="h-7 text-xs bg-info/15 text-info hover:bg-info/25 cursor-pointer rounded-md">
                <CheckCircle2 className="size-3 mr-1" />
                Complete
              </Button>
            )}
            <Button onClick={onDelete} variant="outline" className="h-7 text-xs text-muted-foreground border-border bg-secondary hover:bg-accent cursor-pointer rounded-md">
              <Trash2 className="size-3 mr-1" />
            </Button>
            <button type="button" onClick={onBack} className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
              <X className="size-3.5" />
            </button>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-muted-foreground">
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
            {cfg.label}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" />
            {sprint.startDate} → {sprint.endDate}
          </span>
          {sprint.goal && (
            <span className="flex items-center gap-1">
              <Target className="size-3" />
              {sprint.goal}
            </span>
          )}
          {taskStats.total > 0 && (
            <span className="text-muted-foreground/60">
              {taskStats.done}/{taskStats.total} tasks · {taskStats.completion}% complete
            </span>
          )}
        </div>

        {sprint.status !== "completed" && (
          <SprintBoard
            todoTasks={todoTasks}
            inProgressTasks={inProgressTasks}
            doneTasks={doneTasks}
            taskStats={taskStats}
            onUpdateStatus={updateTaskStatus}
            onRemoveTask={removeTask}
            onAddTask={onAddTask}
          />
        )}

        {sprint.status === "completed" && sprint.retro && (
          <RetroView retro={sprint.retro} />
        )}

        {sprint.status === "completed" && !sprint.retro && (
          <div className="text-center py-12 text-xs text-muted-foreground">
            Sprint completed. No retrospective recorded.
          </div>
        )}

        <AddTaskToSprintDialog
          open={addTaskOpen}
          onOpenChange={onAddTaskOpenChange}
          onAdd={addTask}
          uid={uid}
        />
      </div>
    </AppShell>
  );
};

export default SprintsPage;
