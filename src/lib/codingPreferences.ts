"use client";

export interface CodingPrefs {
  company: string;
  sheet: string;
  sorting: string;
  pageSize: number;
}

const PREFS_KEY = "coding-preferences";

const DEFAULTS: CodingPrefs = {
  company: "Google",
  sheet: "5. All.csv",
  sorting: "Frequency",
  pageSize: 25,
};

export function loadCodingPrefs(): CodingPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function mapSortingToState(sorting: string): { sortBy: "frequency" | "acceptanceRate" | null; sortDirection: "asc" | "desc" } {
  switch (sorting) {
    case "Frequency":
      return { sortBy: "frequency", sortDirection: "desc" };
    case "Acceptance Rate":
      return { sortBy: "acceptanceRate", sortDirection: "desc" };
    default:
      return { sortBy: null, sortDirection: "asc" };
  }
}
