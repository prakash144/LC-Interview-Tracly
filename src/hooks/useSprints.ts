"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Sprint, SprintTask, TaskStatus, TaskType } from "@/lib/sprints";
import * as sprintService from "@/services/firebase/sprintService";

let idCounter = 0;
const genId = () => `sprint_${Date.now()}_${++idCounter}`;
const genTaskId = () => `task_${Date.now()}_${++idCounter}`;

export const useSprints = (uid?: string | null) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const sprintsRef = useRef<Sprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sprintsRef.current = sprints;
  }, [sprints]);

  useEffect(() => {
    if (!uid) {
      setSprints([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await sprintService.getSprints(uid);
        if (!cancelled) {
          sprintsRef.current = data;
          setSprints(data);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load sprints");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [uid]);

  const addSprint = useCallback(
    async (data: { name: string; goal: string; startDate: string; endDate: string }) => {
      const now = Date.now();
      const sprint: Sprint = {
        id: genId(),
        name: data.name,
        goal: data.goal,
        status: "planned",
        startDate: data.startDate,
        endDate: data.endDate,
        createdAt: now,
        updatedAt: now,
      };
      const optimistic = [...sprintsRef.current, sprint];
      sprintsRef.current = optimistic;
      setSprints(optimistic);
      if (uid) {
        try {
          await sprintService.addSprint(uid, sprint);
        } catch {
          const rolled = sprintsRef.current.filter((s) => s.id !== sprint.id);
          sprintsRef.current = rolled;
          setSprints(rolled);
        }
      }
    },
    [uid]
  );

  const updateSprint = useCallback(
    async (sprintId: string, data: Partial<Sprint>) => {
      const optimistic = sprintsRef.current.map((s) =>
        s.id === sprintId ? { ...s, ...data, updatedAt: Date.now() } : s
      );
      sprintsRef.current = optimistic;
      setSprints(optimistic);
      if (uid) {
        try {
          await sprintService.updateSprint(uid, sprintId, data);
        } catch {
          const rolled = await sprintService.getSprints(uid);
          sprintsRef.current = rolled;
          setSprints(rolled);
        }
      }
    },
    [uid]
  );

  const deleteSprint = useCallback(
    async (sprintId: string) => {
      const optimistic = sprintsRef.current.filter((s) => s.id !== sprintId);
      sprintsRef.current = optimistic;
      setSprints(optimistic);
      if (uid) {
        try {
          await sprintService.deleteSprint(uid, sprintId);
        } catch {
          const rolled = await sprintService.getSprints(uid);
          sprintsRef.current = rolled;
          setSprints(rolled);
        }
      }
    },
    [uid]
  );

  const activeSprint = useMemo(
    () => sprints.find((s) => s.status === "active") ?? null,
    [sprints]
  );

  return useMemo(
    () => ({ sprints, loading, error, addSprint, updateSprint, deleteSprint, activeSprint }),
    [sprints, loading, error, addSprint, updateSprint, deleteSprint, activeSprint]
  );
};

export const useSprintTasks = (uid?: string | null, sprintId?: string) => {
  const [tasks, setTasks] = useState<SprintTask[]>([]);
  const tasksRef = useRef<SprintTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    if (!uid || !sprintId) {
      setTasks([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await sprintService.getSprintTasks(uid, sprintId);
        if (!cancelled) {
          tasksRef.current = data;
          setTasks(data);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [uid, sprintId]);

  const addTask = useCallback(
    async (data: { type: TaskType; itemId: string; title: string }) => {
      if (!sprintId) return;
      const now = Date.now();
      const task: SprintTask = {
        id: genTaskId(),
        sprintId,
        type: data.type,
        itemId: data.itemId,
        title: data.title,
        status: "todo",
        addedAt: now,
        updatedAt: now,
      };
      const optimistic = [...tasksRef.current, task];
      tasksRef.current = optimistic;
      setTasks(optimistic);
      if (uid) {
        try {
          await sprintService.addTask(uid, sprintId, task);
        } catch {
          const rolled = tasksRef.current.filter((t) => t.id !== task.id);
          tasksRef.current = rolled;
          setTasks(rolled);
        }
      }
    },
    [uid, sprintId]
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      const optimistic = tasksRef.current.map((t) =>
        t.id === taskId ? { ...t, status, updatedAt: Date.now() } : t
      );
      tasksRef.current = optimistic;
      setTasks(optimistic);
      if (uid && sprintId) {
        try {
          await sprintService.updateTask(uid, sprintId, taskId, { status, updatedAt: Date.now() });
        } catch {
          const rolled = await sprintService.getSprintTasks(uid, sprintId);
          tasksRef.current = rolled;
          setTasks(rolled);
        }
      }
    },
    [uid, sprintId]
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      const optimistic = tasksRef.current.filter((t) => t.id !== taskId);
      tasksRef.current = optimistic;
      setTasks(optimistic);
      if (uid && sprintId) {
        try {
          await sprintService.deleteTask(uid, sprintId, taskId);
        } catch {
          const rolled = await sprintService.getSprintTasks(uid, sprintId);
          tasksRef.current = rolled;
          setTasks(rolled);
        }
      }
    },
    [uid, sprintId]
  );

  const todoTasks = useMemo(() => tasks.filter((t) => t.status === "todo"), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter((t) => t.status === "in-progress"), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === "done"), [tasks]);

  const taskStats = useMemo(
    () => ({
      total: tasks.length,
      todo: todoTasks.length,
      inProgress: inProgressTasks.length,
      done: doneTasks.length,
      completion: tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0,
    }),
    [tasks, todoTasks, inProgressTasks, doneTasks]
  );

  return useMemo(
    () => ({
      tasks,
      loading,
      error,
      addTask,
      updateTaskStatus,
      removeTask,
      todoTasks,
      inProgressTasks,
      doneTasks,
      taskStats,
    }),
    [tasks, loading, error, addTask, updateTaskStatus, removeTask, todoTasks, inProgressTasks, doneTasks, taskStats]
  );
};
