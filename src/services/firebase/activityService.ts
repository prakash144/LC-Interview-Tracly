import { collection, serverTimestamp, getDocs, query, orderBy, limit, doc, setDoc, Timestamp } from "firebase/firestore";
import { requireDb } from "@/lib/firebase";

export interface ActivityEvent {
  id: string;
  type: "sprint_started" | "sprint_completed" | "task_status_changed" | "task_added" | "task_removed";
  sprintId: string;
  sprintName: string;
  message: string;
  timestamp: Timestamp;
}

const activityCollection = (uid: string) =>
  collection(requireDb(), "users", uid, "activity");

export const addActivityEvent = async (
  uid: string,
  event: Omit<ActivityEvent, "id" | "timestamp">
): Promise<void> => {
  const ref = doc(collection(requireDb(), "users", uid, "activity"));
  await setDoc(ref, {
    ...event,
    id: ref.id,
    timestamp: serverTimestamp(),
  });
};

export const getRecentActivity = async (
  uid: string,
  maxCount = 50
): Promise<ActivityEvent[]> => {
  const q = query(activityCollection(uid), orderBy("timestamp", "desc"), limit(maxCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as ActivityEvent);
};
