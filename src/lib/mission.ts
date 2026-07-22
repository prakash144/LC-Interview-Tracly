export interface MissionTask {
  id: string;
  type: "task" | "revision";
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "critical";
  dueDate?: string;
  difficulty?: string;
  track?: string;
  estimatedHours?: number;
}

export interface DailyMission {
  focusTask: MissionTask | null;
  secondTask: MissionTask | null;
  revisionItem: MissionTask | null;
}

const PRIORITY_ORDER: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

interface SprintTaskLike {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  difficulty?: string;
  track?: string;
  estimatedHours?: number;
  status: string;
}

interface RevisionItemLike {
  problemId: string;
  title: string;
  difficulty?: string;
  daysSinceSolved: number;
}

export function computeDailyMission(
  tasks: SprintTaskLike[],
  revisionItems: RevisionItemLike[],
): DailyMission {
  const inProgress = tasks
    .filter((t) => t.status === "in-progress")
    .sort((a, b) => (PRIORITY_ORDER[b.priority ?? "medium"] ?? 2) - (PRIORITY_ORDER[a.priority ?? "medium"] ?? 2));

  const todo = tasks
    .filter((t) => t.status === "todo")
    .sort((a, b) => {
      const priorityDiff =
        (PRIORITY_ORDER[b.priority ?? "medium"] ?? 2) -
        (PRIORITY_ORDER[a.priority ?? "medium"] ?? 2);
      if (priorityDiff !== 0) return priorityDiff;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });

  const reviewed = [...revisionItems].sort(
    (a, b) => b.daysSinceSolved - a.daysSinceSolved
  );

  const toMission = (t: SprintTaskLike): MissionTask => ({
    id: t.id,
    type: "task",
    title: t.title,
    description: t.description,
    priority: t.priority as MissionTask["priority"],
    dueDate: t.dueDate,
    difficulty: t.difficulty,
    track: t.track,
    estimatedHours: t.estimatedHours,
  });

  const toRevisionMission = (r: RevisionItemLike): MissionTask => ({
    id: r.problemId,
    type: "revision",
    title: r.title,
    difficulty: r.difficulty,
    description: `Last reviewed ${r.daysSinceSolved} days ago`,
  });

  const focusTask = inProgress[0] ? toMission(inProgress[0]) : null;
  const usedIds = new Set<string>();
  if (focusTask) usedIds.add(focusTask.id);

  const todoPick = todo.find((t) => !usedIds.has(t.id));
  const revisionPick = reviewed[0] ? toRevisionMission(reviewed[0]) : null;

  let secondTask: MissionTask | null = null;
  if (focusTask && todoPick) {
    secondTask = toMission(todoPick);
  } else if (!focusTask && todoPick) {
    secondTask = toMission(todoPick);
  } else if (revisionPick) {
    secondTask = revisionPick;
  }

  return { focusTask, secondTask, revisionItem: revisionPick };
}
