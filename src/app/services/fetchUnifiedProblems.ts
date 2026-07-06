"use client";

import type { Problem } from "@/lib/progressTypes";
import { getProblemId } from "@/lib/problemId";

interface CsvItem {
  Title: string;
  Link: string;
  Difficulty: string;
  Topics: string;
  Frequency: string;
  "Acceptance Rate": string;
}

const MAJOR_COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple",
];

const CACHE_KEY = "interviewtracly:unified-problems";

async function fetchCSVText(url: string): Promise<string> {
  const cacheKey = `interviewtracly:csv:${url}`;
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return cached;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
  const text = await res.text();
  if (typeof window !== "undefined") {
    sessionStorage.setItem(cacheKey, text);
  }
  return text;
}

async function parseCSV(text: string, company: string): Promise<Problem[]> {
  const Papa = await import("papaparse");
  const result = Papa.parse<CsvItem>(text, { header: true, skipEmptyLines: true });
  return result.data.map((item) => {
    const title = item.Title || "";
    const link = item.Link || "";
    return {
      problemId: getProblemId(link, title),
      title,
      link,
      difficulty: item.Difficulty || "",
      topicTag: item.Topics || "",
      topics: (item.Topics || "").split(",").map((t) => t.trim()).filter(Boolean),
      company,
      list: "All",
      frequency: item.Frequency || "",
      acceptanceRate: item["Acceptance Rate"] || "",
    };
  });
}

export async function fetchUnifiedProblems(): Promise<Problem[]> {
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  const merged = new Map<string, Problem>();

  const results = await Promise.allSettled(
    MAJOR_COMPANIES.map(async (company) => {
      const url = `https://raw.githubusercontent.com/prakash144/leetcode-company-wise-problems/main/${encodeURIComponent(company)}/5.%20All.csv`;
      const text = await fetchCSVText(url);
      return parseCSV(text, company);
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const problem of result.value) {
        if (!merged.has(problem.problemId)) {
          merged.set(problem.problemId, problem);
        }
      }
    }
  }

  const problems = Array.from(merged.values());

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(problems));
    } catch {}
  }

  return problems;
}
