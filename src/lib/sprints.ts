export type SprintStatus = "planned" | "active" | "completed";

export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskStatusV2 = "backlog" | "todo" | "in-progress" | "review" | "done";

export type TaskType = "problem" | "resource";

export type Priority = "low" | "medium" | "high" | "critical";

export interface SprintTask {
  id: string;
  sprintId: string;
  type: TaskType;
  itemId: string;
  title: string;
  status: TaskStatus;
  order?: number;
  addedAt: number;
  updatedAt: number;
}

export interface SprintTaskV2 {
  id: string;
  sprintId: string;
  type: TaskType;
  itemId: string;
  title: string;
  description: string;
  track: string;
  category: string;
  priority: Priority;
  difficulty: string;
  estimatedHours: number;
  actualHours: number;
  status: TaskStatusV2;
  dueDate: string;
  company: string;
  tags: string[];
  collectionIds: string[];
  notes: string;
  linkedProblemIds: string[];
  linkedResourceIds: string[];
  addedAt: number;
  updatedAt: number;
  order: number;
}

export interface SprintRetro {
  wentWell: string;
  wentWrong: string;
  weaknesses: string[];
  rating: number;
  actionItems: string;
  completedAt: number;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  capacityHours?: number;
  createdAt: number;
  updatedAt: number;
  retro?: SprintRetro;
}

export interface SprintWithTasks extends Sprint {
  tasks: SprintTask[];
}

export const SPRINTS_COLLECTION = "sprints";
export const SPRINT_TASKS_SUBCOLLECTION = "tasks";

export function createDefaultTaskV2(base: {
  id: string;
  sprintId: string;
  type: TaskType;
  itemId: string;
  title: string;
}): SprintTaskV2 {
  const now = Date.now();
  return {
    ...base,
    description: "",
    track: "",
    category: "",
    priority: "medium",
    difficulty: "",
    estimatedHours: 0,
    actualHours: 0,
    status: "todo",
    dueDate: "",
    company: "",
    tags: [],
    collectionIds: [],
    notes: "",
    linkedProblemIds: [],
    linkedResourceIds: [],
    addedAt: now,
    updatedAt: now,
    order: 0,
  };
}

export function migrateTask(task: Record<string, unknown>): SprintTaskV2 {
  return {
    id: (task.id as string) ?? "",
    sprintId: (task.sprintId as string) ?? "",
    type: (task.type as TaskType) ?? "problem",
    itemId: (task.itemId as string) ?? "",
    title: (task.title as string) ?? "",
    description: (task.description as string) ?? "",
    track: (task.track as string) ?? "",
    category: (task.category as string) ?? "",
    priority: (task.priority as Priority) ?? "medium",
    difficulty: (task.difficulty as string) ?? "",
    estimatedHours: (task.estimatedHours as number) ?? 0,
    actualHours: (task.actualHours as number) ?? 0,
    status: (task.status as TaskStatusV2) ?? "todo",
    dueDate: (task.dueDate as string) ?? "",
    company: (task.company as string) ?? "",
    tags: (task.tags as string[]) ?? [],
    collectionIds: (task.collectionIds as string[]) ?? [],
    notes: (task.notes as string) ?? "",
    linkedProblemIds: (task.linkedProblemIds as string[]) ?? [],
    linkedResourceIds: (task.linkedResourceIds as string[]) ?? [],
    addedAt: (task.addedAt as number) ?? Date.now(),
    updatedAt: (task.updatedAt as number) ?? Date.now(),
    order: (task.order as number) ?? 0,
  };
}
