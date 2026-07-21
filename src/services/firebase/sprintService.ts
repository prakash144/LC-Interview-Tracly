import {
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { requireDb } from "@/lib/firebase";
import type { Sprint, SprintTask, SprintWithTasks } from "@/lib/sprints";
import { SPRINTS_COLLECTION, SPRINT_TASKS_SUBCOLLECTION } from "@/lib/sprints";

const sprintCollection = (uid: string) =>
  collection(requireDb(), "users", uid, SPRINTS_COLLECTION);

const sprintDoc = (uid: string, sprintId: string) =>
  doc(requireDb(), "users", uid, SPRINTS_COLLECTION, sprintId);

const tasksSubcollection = (uid: string, sprintId: string) =>
  collection(requireDb(), "users", uid, SPRINTS_COLLECTION, sprintId, SPRINT_TASKS_SUBCOLLECTION);

const taskDoc = (uid: string, sprintId: string, taskId: string) =>
  doc(requireDb(), "users", uid, SPRINTS_COLLECTION, sprintId, SPRINT_TASKS_SUBCOLLECTION, taskId);

export const getSprints = async (uid: string): Promise<Sprint[]> => {
  const q = query(sprintCollection(uid), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Sprint));
};

export const getSprint = async (uid: string, sprintId: string): Promise<SprintWithTasks | null> => {
  const snap = await getDoc(sprintDoc(uid, sprintId));
  if (!snap.exists()) return null;
  const tasks = await getSprintTasks(uid, sprintId);
  return { id: snap.id, ...snap.data(), tasks } as SprintWithTasks;
};

export const getSprintTasks = async (uid: string, sprintId: string): Promise<SprintTask[]> => {
  const q = query(tasksSubcollection(uid, sprintId), orderBy("addedAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SprintTask));
};

export const addSprint = async (uid: string, sprint: Sprint): Promise<void> => {
  await setDoc(sprintDoc(uid, sprint.id), sprint);
};

export const updateSprint = async (
  uid: string,
  sprintId: string,
  data: Partial<Sprint>
): Promise<void> => {
  await setDoc(sprintDoc(uid, sprintId), data, { merge: true });
};

export const deleteSprint = async (uid: string, sprintId: string): Promise<void> => {
  const batch = writeBatch(requireDb());
  const tasks = await getSprintTasks(uid, sprintId);
  for (const t of tasks) {
    batch.delete(taskDoc(uid, sprintId, t.id));
  }
  batch.delete(sprintDoc(uid, sprintId));
  await batch.commit();
};

export const addTask = async (uid: string, sprintId: string, task: SprintTask): Promise<void> => {
  await setDoc(taskDoc(uid, sprintId, task.id), task);
};

export const updateTask = async (
  uid: string,
  sprintId: string,
  taskId: string,
  data: Partial<SprintTask>
): Promise<void> => {
  await setDoc(taskDoc(uid, sprintId, taskId), data, { merge: true });
};

export const deleteTask = async (uid: string, sprintId: string, taskId: string): Promise<void> => {
  await deleteDoc(taskDoc(uid, sprintId, taskId));
};

export const reorderTasks = async (
  uid: string,
  sprintId: string,
  taskIds: string[]
): Promise<void> => {
  const batch = writeBatch(requireDb());
  taskIds.forEach((id, index) => {
    batch.set(taskDoc(uid, sprintId, id), { order: index }, { merge: true });
  });
  await batch.commit();
};
