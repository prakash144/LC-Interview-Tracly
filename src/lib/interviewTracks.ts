export type TrackId =
  | "dsa"
  | "system-design"
  | "backend"
  | "behavioral"
  | "leadership"
  | "interview-experience";

export interface InterviewTrack {
  id: TrackId;
  name: string;
  icon: string;
  color: string;
  description: string;
  shortDescription: string;
}

export const INTERVIEW_TRACKS: InterviewTrack[] = [
  {
    id: "dsa",
    name: "DSA",
    icon: "📘",
    color: "text-blue-500",
    description: "Data Structures & Algorithms — the core of technical interviews",
    shortDescription: "Solve coding problems efficiently",
  },
  {
    id: "system-design",
    name: "System Design",
    icon: "🏗",
    color: "text-purple-500",
    description: "Design large-scale distributed systems",
    shortDescription: "Architect scalable solutions",
  },
  {
    id: "backend",
    name: "Backend Engineering",
    icon: "⚙",
    color: "text-amber-500",
    description: "Backend engineering concepts, APIs, databases, and distributed systems",
    shortDescription: "Master backend fundamentals",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    icon: "🧠",
    color: "text-emerald-500",
    description: "Behavioral interview questions and frameworks like STAR",
    shortDescription: "Tell your story effectively",
  },
  {
    id: "leadership",
    name: "Leadership",
    icon: "👥",
    color: "text-rose-500",
    description: "Leadership principles and management scenarios",
    shortDescription: "Demonstrate leadership skills",
  },
  {
    id: "interview-experience",
    name: "Interview Experience",
    icon: "🎤",
    color: "text-sky-500",
    description: "Real interview experiences from LeetCode discuss and other sources",
    shortDescription: "Learn from real interview loops",
  },
];

export function getTrack(id: string): InterviewTrack | undefined {
  return INTERVIEW_TRACKS.find((t) => t.id === id);
}
