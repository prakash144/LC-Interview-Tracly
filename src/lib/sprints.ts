export type SprintStatus = "planned" | "active" | "completed";

export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskType = "problem" | "resource";

export interface SprintTask {
  id: string;
  sprintId: string;
  type: TaskType;
  itemId: string;
  title: string;
  status: TaskStatus;
  addedAt: number;
  updatedAt: number;
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
  createdAt: number;
  updatedAt: number;
  retro?: SprintRetro;
}

export interface SprintWithTasks extends Sprint {
  tasks: SprintTask[];
}

export const SPRINTS_COLLECTION = "sprints";
export const SPRINT_TASKS_SUBCOLLECTION = "tasks";
