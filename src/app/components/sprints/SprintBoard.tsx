"use client";

import { useMemo } from "react";
import { Plus, ListChecks, BookOpen, Trash2 } from "lucide-react";
import type { SprintTask, TaskStatus } from "@/lib/sprints";
import { Button } from "@/components/ui/button";

interface SprintBoardProps {
  todoTasks: SprintTask[];
  inProgressTasks: SprintTask[];
  doneTasks: SprintTask[];
  taskStats: { total: number; todo: number; inProgress: number; done: number; completion: number };
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onRemoveTask: (taskId: string) => void;
  onAddTask: () => void;
}

const TaskCard = ({
  task,
  onUpdateStatus,
  onRemoveTask,
  nextStatus,
  prevStatus,
}: {
  task: SprintTask;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onRemoveTask: (taskId: string) => void;
  nextStatus?: TaskStatus;
  prevStatus?: TaskStatus;
}) => (
  <div className="group rounded-lg border border-border bg-card p-3 text-xs hover:border-foreground/20 transition-colors">
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {task.type === "problem" ? (
          <ListChecks className="size-3 text-muted-foreground shrink-0" />
        ) : (
          <BookOpen className="size-3 text-muted-foreground shrink-0" />
        )}
        <span className="truncate font-medium text-foreground">{task.title}</span>
      </div>
      <button
        type="button"
        onClick={() => onRemoveTask(task.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
        aria-label="Remove task"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
    <div className="flex items-center gap-2 mt-2">
      {prevStatus && (
        <button
          type="button"
          onClick={() => onUpdateStatus(task.id, prevStatus)}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          ←
        </button>
      )}
      {nextStatus && (
        <button
          type="button"
          onClick={() => onUpdateStatus(task.id, nextStatus)}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          →
        </button>
      )}
      <span className="text-[10px] text-muted-foreground/50 ml-auto">
        {task.type === "problem" ? "Problem" : "Resource"}
      </span>
    </div>
  </div>
);

const SprintBoard = ({
  todoTasks,
  inProgressTasks,
  doneTasks,
  taskStats,
  onUpdateStatus,
  onRemoveTask,
  onAddTask,
}: SprintBoardProps) => {
  const columns = useMemo(
    () => [
      { id: "todo" as TaskStatus, label: "To Do", tasks: todoTasks, color: "text-muted-foreground" },
      { id: "in-progress" as TaskStatus, label: "In Progress", tasks: inProgressTasks, color: "text-warning" },
      { id: "done" as TaskStatus, label: "Done", tasks: doneTasks, color: "text-success" },
    ],
    [todoTasks, inProgressTasks, doneTasks]
  );

  return (
    <div>
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{taskStats.total} tasks</span>
          <span className="w-px h-3 bg-border" />
          <span>{taskStats.done} done</span>
          <span className="w-px h-3 bg-border" />
          <span>{taskStats.completion}% complete</span>
        </div>
        <Button
          onClick={onAddTask}
          className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer rounded-md"
        >
          <Plus className="size-3 mr-1" />
          Add Task
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-success transition-all duration-500"
          style={{ width: `${taskStats.completion}%` }}
        />
      </div>

      {/* Kanban columns */}
      <div className="grid gap-3 sm:grid-cols-3">
        {columns.map((col) => (
          <div key={col.id} className="rounded-xl border border-border bg-card/50 p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs font-semibold uppercase tracking-wide ${col.color}`}>
                {col.label}
              </h3>
              <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5">
                {col.tasks.length}
              </span>
            </div>
            <div className="space-y-2 min-h-20">
              {col.tasks.length === 0 ? (
                <div className="text-[11px] text-muted-foreground/50 text-center py-6">
                  {col.id === "todo"
                    ? "Add tasks to get started"
                    : col.id === "in-progress"
                      ? "Move tasks here when working"
                      : "Completed tasks appear here"}
                </div>
              ) : (
                col.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdateStatus={onUpdateStatus}
                    onRemoveTask={onRemoveTask}
                    prevStatus={
                      col.id === "in-progress" ? "todo" : col.id === "done" ? "in-progress" : undefined
                    }
                    nextStatus={
                      col.id === "todo" ? "in-progress" : col.id === "in-progress" ? "done" : undefined
                    }
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SprintBoard;
