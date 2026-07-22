"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, ListChecks, BookOpen, Trash2, GripVertical, ArrowLeft, ArrowRight, Pencil, Search, X } from "lucide-react";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent, type DragOverEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { SprintTaskV2, TaskStatusV2 } from "@/lib/sprints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SprintBoardProps {
  todoTasks: SprintTaskV2[];
  inProgressTasks: SprintTaskV2[];
  doneTasks: SprintTaskV2[];
  backlogTasks?: SprintTaskV2[];
  reviewTasks?: SprintTaskV2[];
  taskStats: { total: number; todo: number; inProgress: number; done: number; backlog: number; review: number; completion: number; estimatedHours?: number; actualHours?: number };
  onUpdateStatus: (taskId: string, status: TaskStatusV2) => void;
  onRemoveTask: (taskId: string) => void;
  onAddTask: () => void;
  onEditTask?: (task: SprintTaskV2) => void;
  readOnly?: boolean;
}

const typeIcons: Record<string, React.ReactNode> = {
  problem: <ListChecks className="size-3" />,
  resource: <BookOpen className="size-3" />,
};

const typeLabels: Record<string, string> = {
  problem: "Problem",
  resource: "Resource",
};

const COLUMN_LABELS: Record<TaskStatusV2, string> = {
  backlog: "Backlog",
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

const COLUMN_ORDER: TaskStatusV2[] = ["backlog", "todo", "in-progress", "review", "done"];
const VALID_COLUMNS = new Set<TaskStatusV2>(COLUMN_ORDER);

const prevStatus = (s: TaskStatusV2): TaskStatusV2 | undefined => {
  const idx = COLUMN_ORDER.indexOf(s);
  return idx > 0 ? COLUMN_ORDER[idx - 1] : undefined;
};
const nextStatus = (s: TaskStatusV2): TaskStatusV2 | undefined => {
  const idx = COLUMN_ORDER.indexOf(s);
  return idx < COLUMN_ORDER.length - 1 ? COLUMN_ORDER[idx + 1] : undefined;
};

const SortableTaskCard = ({
  task,
  onUpdateStatus,
  onRemoveTask,
  onEditTask,
  readOnly,
}: {
  task: SprintTaskV2;
  onUpdateStatus: (taskId: string, status: TaskStatusV2) => void;
  onRemoveTask: (taskId: string) => void;
  onEditTask?: (task: SprintTaskV2) => void;
  readOnly?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const prev = prevStatus(task.status);
  const next = nextStatus(task.status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border bg-card p-2.5 text-xs transition-all",
        isDragging
          ? "z-50 border-primary/40 shadow-lg shadow-primary/5 opacity-90 rotate-2 scale-105"
          : "border-border hover:border-foreground/20 hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-1.5">
        {!readOnly && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors shrink-0"
            aria-label="Drag to reorder"
          >
            <GripVertical className="size-3" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={cn(
              "shrink-0",
              task.type === "problem" ? "text-info" : "text-warning"
            )}>
              {typeIcons[task.type]}
            </span>
            <span className="truncate font-medium text-foreground text-[13px] leading-tight">
              {task.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{typeLabels[task.type]}</span>
            {task.status === "done" && (
              <span className="text-[10px] text-success">✓ Done</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {onEditTask && (
            <button
              type="button"
              onClick={() => onEditTask(task)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-foreground transition-all shrink-0 mt-0.5"
              aria-label="Edit task"
            >
              <Pencil className="size-3" />
            </button>
          )}
          {!readOnly && (
            <button
              type="button"
              onClick={() => onRemoveTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive transition-all shrink-0 mt-0.5"
              aria-label="Remove task"
            >
              <Trash2 className="size-3" />
            </button>
          )}
        </div>
      </div>
      {!readOnly && (prev || next) && (
        <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-border/50">
          {prev && (
            <button
              type="button"
              onClick={() => onUpdateStatus(task.id, prev)}
              className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-2.5" />
              {COLUMN_LABELS[prev]}
            </button>
          )}
          {next && (
            <button
              type="button"
              onClick={() => onUpdateStatus(task.id, next)}
              className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors ml-auto"
            >
              {COLUMN_LABELS[next]}
              <ArrowRight className="size-2.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Column = ({
  id,
  label,
  tasks,
  headerColor,
  accentColor,
  onUpdateStatus,
  onRemoveTask,
  onAddTask,
  onEditTask,
  readOnly,
  isOver,
}: {
  id: TaskStatusV2;
  label: string;
  tasks: SprintTaskV2[];
  headerColor: string;
  accentColor: string;
  onUpdateStatus: (taskId: string, status: TaskStatusV2) => void;
  onRemoveTask: (taskId: string) => void;
  onAddTask: () => void;
  onEditTask?: (task: SprintTaskV2) => void;
  readOnly?: boolean;
  isOver?: boolean;
}) => (
  <div
    className={cn(
      "rounded-xl border bg-card/40 p-3 transition-all duration-200 flex flex-col",
      isOver ? "border-primary/40 bg-primary/[0.02] ring-1 ring-primary/10" : "border-border"
    )}
  >
    <div className="flex items-center justify-between mb-3 px-0.5">
      <div className="flex items-center gap-2">
        <div className={cn("size-2 rounded-full", accentColor)} />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">{label}</h3>
        <span className={cn(
          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
          headerColor, "text-muted-foreground"
        )}>
          {tasks.length}
        </span>
      </div>
      {!readOnly && (
        <button
          type="button"
          onClick={onAddTask}
          className="size-5 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-accent transition-all flex items-center justify-center"
          aria-label={`Add task to ${label}`}
        >
          <Plus className="size-3" />
        </button>
      )}
    </div>

    <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-2 flex-1 min-h-[60px]">
          {tasks.length === 0 ? (
            <div className="text-[11px] text-muted-foreground/40 text-center py-5 border border-dashed border-border/50 rounded-lg">
              {id === "backlog"
                ? "Unsorted tasks"
                : id === "todo"
                  ? "Add tasks to get started"
                  : id === "in-progress"
                    ? "Move tasks here when working"
                    : id === "review"
                      ? "Tasks awaiting review"
                      : "Completed tasks appear here"}
            </div>
        ) : (
          tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onUpdateStatus={onUpdateStatus}
              onRemoveTask={onRemoveTask}
              onEditTask={onEditTask}
              readOnly={readOnly}
            />
          ))
        )}
      </div>
    </SortableContext>

    {!readOnly && tasks.length > 0 && (
      <button
        type="button"
        onClick={onAddTask}
        className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] text-muted-foreground/50 hover:text-foreground hover:bg-accent/50 transition-all"
      >
        <Plus className="size-3" />
        Add task
      </button>
    )}
  </div>
);

const SprintBoard = ({
  todoTasks,
  inProgressTasks,
  doneTasks,
  backlogTasks = [],
  reviewTasks = [],
  taskStats,
  onUpdateStatus,
  onRemoveTask,
  onAddTask,
  onEditTask,
  readOnly = false,
}: SprintBoardProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const allTasks = useMemo(
    () => [...backlogTasks, ...todoTasks, ...inProgressTasks, ...reviewTasks, ...doneTasks],
    [backlogTasks, todoTasks, inProgressTasks, reviewTasks, doneTasks]
  );

  const activeTask = useMemo(
    () => allTasks.find((t) => t.id === activeId) ?? null,
    [allTasks, activeId]
  );

  const columns = useMemo(
    () => [
      {
        id: "backlog" as TaskStatusV2,
        label: "Backlog",
        tasks: backlogTasks,
        headerColor: "bg-muted-foreground/10",
        accentColor: "bg-muted-foreground/40",
      },
      {
        id: "todo" as TaskStatusV2,
        label: "To Do",
        tasks: todoTasks,
        headerColor: "bg-info/10",
        accentColor: "bg-info",
      },
      {
        id: "in-progress" as TaskStatusV2,
        label: "In Progress",
        tasks: inProgressTasks,
        headerColor: "bg-warning/10",
        accentColor: "bg-warning",
      },
      {
        id: "review" as TaskStatusV2,
        label: "Review",
        tasks: reviewTasks,
        headerColor: "bg-purple-500/10",
        accentColor: "bg-purple-500",
      },
      {
        id: "done" as TaskStatusV2,
        label: "Done",
        tasks: doneTasks,
        headerColor: "bg-success/10",
        accentColor: "bg-success",
      },
    ],
    [backlogTasks, todoTasks, inProgressTasks, reviewTasks, doneTasks]
  );

  const findTaskColumn = useCallback(
    (taskId: string): TaskStatusV2 | null => {
      if (backlogTasks.some((t) => t.id === taskId)) return "backlog";
      if (todoTasks.some((t) => t.id === taskId)) return "todo";
      if (inProgressTasks.some((t) => t.id === taskId)) return "in-progress";
      if (reviewTasks.some((t) => t.id === taskId)) return "review";
      if (doneTasks.some((t) => t.id === taskId)) return "done";
      return null;
    },
    [backlogTasks, todoTasks, inProgressTasks, reviewTasks, doneTasks]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || readOnly) return;

      const activeTaskId = active.id as string;
      const overId = over.id as string;

      const task = allTasks.find((t) => t.id === activeTaskId);
      if (!task) return;

      let targetStatus: TaskStatusV2;

      if (VALID_COLUMNS.has(overId as TaskStatusV2)) {
        targetStatus = overId as TaskStatusV2;
      } else {
        const overTask = allTasks.find((t) => t.id === overId);
        if (!overTask) return;
        targetStatus = findTaskColumn(overTask.id) ?? overTask.status;
      }

      if (task.status !== targetStatus) {
        onUpdateStatus(task.id, targetStatus);
      }
    },
    [allTasks, findTaskColumn, onUpdateStatus, readOnly]
  );

  const [overColumn, setOverColumn] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState("");

  const filteredTasks = useCallback(
    (taskList: SprintTaskV2[]) => {
      let result = taskList;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            (t.company || "").toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
            t.track.toLowerCase().includes(q)
        );
      }
      if (trackFilter) {
        result = result.filter((t) => t.track === trackFilter);
      }
      return result;
    },
    [searchQuery, trackFilter]
  );

  const filteredColumns = useMemo(
    () => columns.map((col) => ({ ...col, tasks: filteredTasks(col.tasks) })),
    [columns, filteredTasks]
  );

  const filteredCount = filteredColumns.reduce((s, c) => s + c.tasks.length, 0);
  const hasFilters = searchQuery.trim() || trackFilter;

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id as string;
    if (VALID_COLUMNS.has(overId as TaskStatusV2)) {
      setOverColumn(overId);
    } else {
      setOverColumn(null);
    }
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
          <span className="font-medium text-foreground/80">{taskStats.total} tasks</span>
          <span className="text-muted-foreground/30">·</span>
          <span className="text-success">{taskStats.done} done</span>
          <span className="text-muted-foreground/30">·</span>
          <span className={cn(
            taskStats.completion >= 80 ? "text-success" : taskStats.completion >= 50 ? "text-warning" : "text-muted-foreground"
          )}>
            {taskStats.completion}%
          </span>
        </div>
        {!readOnly && (
          <Button
            onClick={onAddTask}
            className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer rounded-md"
          >
            <Plus className="size-3 mr-1" />
            Add Task
          </Button>
        )}
      </div>

      <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-5">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            taskStats.completion >= 80 ? "bg-success" : taskStats.completion >= 50 ? "bg-warning" : "bg-info"
          )}
          style={{ width: `${taskStats.completion}%` }}
        />
      </div>

      {readOnly && (
        <div className="mb-4 rounded-lg border border-info/20 bg-info/[0.03] px-3 py-2 text-[11px] text-info">
          <span className="font-medium">Sprint completed.</span> Viewing tasks in read-only mode.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="h-7 pl-7 text-xs bg-secondary border-border"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground">
              <X className="size-3" />
            </button>
          )}
        </div>
        <select
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value)}
          className="h-7 rounded-md border border-border bg-secondary px-2 text-[11px] text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">All tracks</option>
        </select>
        {hasFilters && (
          <button
            type="button"
            onClick={() => { setSearchQuery(""); setTrackFilter(""); }}
            className="h-7 px-2 text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
        <span className="text-[10px] text-muted-foreground/40 ml-auto">
          {filteredCount} of {taskStats.total} tasks
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {filteredColumns.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              label={col.label}
              tasks={col.tasks}
              headerColor={col.headerColor}
              accentColor={col.accentColor}
              onUpdateStatus={onUpdateStatus}
              onRemoveTask={onRemoveTask}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              readOnly={readOnly}
              isOver={overColumn === col.id}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rounded-lg border border-primary/40 bg-card p-2.5 shadow-lg shadow-primary/5 text-xs max-w-64">
              <div className="flex items-center gap-1.5">
                <span className={activeTask.type === "problem" ? "text-info" : "text-warning"}>
                  {typeIcons[activeTask.type]}
                </span>
                <span className="truncate font-medium text-foreground">{activeTask.title}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SprintBoard;
