import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { requireDb } from "@/lib/firebase";
import type { CustomList } from "@/lib/progressTypes";

const listsCollection = (uid: string) =>
  collection(requireDb(), "users", uid, "customLists");

const listDoc = (uid: string, listId: string) =>
  doc(requireDb(), "users", uid, "customLists", listId);

export const subscribeCustomLists = (
  uid: string,
  callback: (lists: CustomList[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const unsub = onSnapshot(listsCollection(uid),
    (snapshot) => {
      const lists: CustomList[] = [];
      snapshot.forEach((d) => {
        lists.push({ id: d.id, ...d.data() } as CustomList);
      });
      callback(lists);
    },
    (error) => { if (onError) onError(error); }
  );
  return unsub;
};

export const getUserCustomLists = async (uid: string): Promise<CustomList[]> => {
  const snapshot = await getDocs(listsCollection(uid));
  const lists: CustomList[] = [];
  snapshot.forEach((d) => {
    lists.push({ id: d.id, ...d.data() } as CustomList);
  });
  return lists;
};

export const createCustomList = async (
  uid: string,
  name: string,
  description: string
): Promise<string> => {
  const ref = await addDoc(listsCollection(uid), {
    name,
    description,
    problemIds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const renameCustomList = async (
  uid: string,
  listId: string,
  name: string
): Promise<void> => {
  await updateDoc(listDoc(uid, listId), {
    name,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCustomList = async (
  uid: string,
  listId: string
): Promise<void> => {
  await deleteDoc(listDoc(uid, listId));
};

export const addProblemToList = async (
  uid: string,
  listId: string,
  problemId: string
): Promise<void> => {
  const ref = listDoc(uid, listId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as CustomList;
  const current = data.problemIds || [];
  if (current.includes(problemId)) return;
  await updateDoc(ref, {
    problemIds: [...current, problemId],
    updatedAt: serverTimestamp(),
  });
};

export const removeProblemFromList = async (
  uid: string,
  listId: string,
  problemId: string
): Promise<void> => {
  const ref = listDoc(uid, listId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as CustomList;
  await updateDoc(ref, {
    problemIds: (data.problemIds || []).filter((id: string) => id !== problemId),
    updatedAt: serverTimestamp(),
  });
};
