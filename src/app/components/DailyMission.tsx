"use client";

import { useMemo } from "react";
import { Target, RotateCcw, Clock, Play } from "lucide-react";
import { useSprintTasks } from "@/hooks/useSprints";
import { computeDailyMission, type DailyMission } from "@/lib/mission";
import DifficultyBadge from "@/components/data-display/DifficultyBadge";

interface RevisionItem {
  problemId: string;
  title: string;
  difficulty?: string;
  daysSinceSolved: number;
}

interface DailyMissionWidgetProps {
  uid?: string | null;
  sprintId?: string;
  revisionItems: RevisionItem[];
  onRevisionAction: (problemId: string, action: "review" | "skip") => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-muted-foreground/50",
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function MissionCard({
  item,
  index,
  onComplete,
  onSkip,
}: {
  item: DailyMission["focusTask"];
  index: number;
  onComplete?: () => void;
  onSkip?: () => void;
}) {
  if (!item) return null;

  const isTask = item.type === "task";

  return (
    <div className="group relative rounded-lg border border-border bg-background p-3 transition-all hover:border-foreground/20 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success text-xs font-bold">
          {index}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground truncate">{item.title}</span>
            {!isTask && (
              <span className="shrink-0 rounded-full bg-cyan-500/10 px-1.5 py-0.5 text-[9px] text-cyan-400 font-medium">
                Revision
              </span>
            )}
          </div>
          {item.description && (
            <p className="mt-0.5 text-[10px] text-muted-foreground/70 truncate max-w-64">{item.description}</p>
          )}
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            {item.priority && isTask && (
              <span className={`text-[10px] font-medium ${PRIORITY_COLORS[item.priority] || "text-muted-foreground/50"}`}>
                {PRIORITY_LABELS[item.priority] || item.priority}
              </span>
            )}
            {item.difficulty && (
              <DifficultyBadge difficulty={item.difficulty} />
            )}
            {item.track && (
              <span className="rounded bg-secondary/50 px-1.5 py-0.5 text-[9px] text-muted-foreground">{item.track}</span>
            )}
            {item.estimatedHours && (
              <span className="text-[10px] text-muted-foreground/60">{item.estimatedHours}h</span>
            )}
            {item.dueDate && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60">
                <Clock className="size-2.5" />
                {item.dueDate}
              </span>
            )}
          </div>
        </div>
      </div>
      {onComplete && (
        <button
          type="button"
          onClick={onComplete}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-success/20 bg-success/5 py-1.5 text-[10px] font-medium text-success transition-colors hover:bg-success/10"
        >
          {!isTask ? (
            <>
              <RotateCcw className="size-3" /> Mark as Reviewed
            </>
          ) : null}
          {isTask && (
            <>
              <Play className="size-3" /> Start Working
            </>
          )}
        </button>
      )}
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="mt-1 flex w-full items-center justify-center gap-1 rounded-md border border-border py-1 text-[10px] text-muted-foreground transition-colors hover:bg-accent"
        >
          Skip
        </button>
      )}
    </div>
  );
}

const DailyMissionWidget = ({
  uid,
  sprintId,
  revisionItems,
  onRevisionAction,
}: DailyMissionWidgetProps) => {
  const { tasks, updateTaskStatus } = useSprintTasks(uid, sprintId);

  const mission = useMemo(() => computeDailyMission(tasks, revisionItems), [tasks, revisionItems]);

  const hasItems = mission.focusTask || mission.secondTask || mission.revisionItem;

  if (!hasItems) return null;

  return (
    <section className="rounded-xl border border-border bg-gradient-to-br from-zap/[0.03] to-success/[0.03] p-5 transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Target className="size-4 text-zap" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Today&apos;s Focus</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MissionCard
          item={mission.focusTask}
          index={1}
          onComplete={
            mission.focusTask?.type === "task"
              ? () => updateTaskStatus(mission.focusTask!.id, "done")
              : mission.focusTask?.type === "revision"
                ? () => onRevisionAction(mission.focusTask!.id, "review")
                : undefined
          }
        />
        <MissionCard
          item={mission.secondTask}
          index={2}
          onComplete={
            mission.secondTask?.type === "task"
              ? () => updateTaskStatus(mission.secondTask!.id, "done")
              : mission.secondTask?.type === "revision"
                ? () => onRevisionAction(mission.secondTask!.id, "review")
                : undefined
          }
        />
        {mission.revisionItem && mission.secondTask?.type === "task" && (
          <MissionCard
            item={mission.revisionItem}
            index={3}
            onComplete={() => onRevisionAction(mission.revisionItem!.id, "review")}
            onSkip={() => onRevisionAction(mission.revisionItem!.id, "skip")}
          />
        )}
      </div>
    </section>
  );
};

export default DailyMissionWidget;
