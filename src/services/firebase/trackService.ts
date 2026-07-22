import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import { requireDb } from "@/lib/firebase";
import type { Track } from "@/lib/tracks";
import { TRACKS_COLLECTION } from "@/lib/tracks";
import { RESOURCES_COLLECTION } from "@/lib/knowledgeBase";

const trackCollection = (uid: string) =>
  collection(requireDb(), "users", uid, TRACKS_COLLECTION);

const trackDoc = (uid: string, trackId: string) =>
  doc(requireDb(), "users", uid, TRACKS_COLLECTION, trackId);

export const subscribeTracks = (
  uid: string,
  callback: (tracks: Track[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(trackCollection(uid), orderBy("createdAt", "asc"));
  const unsub = onSnapshot(q,
    (snapshot) => callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Track))),
    (error) => { if (onError) onError(error); }
  );
  return unsub;
};

export const getTracks = async (uid: string): Promise<Track[]> => {
  const q = query(trackCollection(uid), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Track));
};

export const addTrack = async (uid: string, track: Track): Promise<void> => {
  await setDoc(trackDoc(uid, track.id), track);
};

export const updateTrack = async (
  uid: string,
  trackId: string,
  data: Partial<Track>
): Promise<void> => {
  await setDoc(trackDoc(uid, trackId), { ...data, updatedAt: Date.now() }, { merge: true });
};

export const deleteTrack = async (uid: string, trackId: string): Promise<void> => {
  await deleteDoc(trackDoc(uid, trackId));
};

export const archiveTrack = async (
  uid: string,
  trackId: string,
  archived: boolean
): Promise<void> => {
  const ref = trackDoc(uid, trackId);
  await setDoc(ref, { archived, updatedAt: Date.now() }, { merge: true });
};

export const mergeTracks = async (
  uid: string,
  sourceId: string,
  targetId: string
): Promise<void> => {
  const db = requireDb();
  const resourcesRef = collection(db, "users", uid, RESOURCES_COLLECTION);
  const q = query(resourcesRef, where("track", "==", sourceId));
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.update(doc(db, "users", uid, RESOURCES_COLLECTION, d.id), {
      track: targetId,
    });
  });
  batch.delete(trackDoc(uid, sourceId));
  await batch.commit();
};
