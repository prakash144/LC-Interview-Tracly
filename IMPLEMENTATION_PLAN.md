# Implementation Plan — Readiness Page Redesign (Premium UI/UX)

> **Status:** Phase 22 in progress.

## Latest: Phase 22 — Readiness Page Redesign — In Progress

### Goal

Redesign the `/readiness` page into a focused, productivity-driven workspace that answers:

> **"Am I ready for my target company's coding interview, and what should I do next?"**

Remove duplication, simplify information architecture, improve UI/UX, and make the page actionable.

---

### Analysis & Design Decisions

#### Issues Identified in Current Implementation

| Issue | Detail |
|---|---|
| **Duplicated company data** | Mini company cards in `InterviewReadiness.tsx` duplicate the company list from `CompanyReadiness.tsx` |
| **Low-value Achievements** | Deterministic emoji badges add visual noise without actionable insight; belong on Profile page |
| **Broken Weekly Review** | `weeklySolved = 0` hardcoded in page, making goal completion and solved count always zero |
| **Dense/scattered layout** | 5+ competing sections with no clear hierarchy; weak topics, weak difficulties, patterns, company scores all separate |
| **No company selector** | No top-level filter to contextualize all metrics for a target company |
| **Recommendations not actionable** | "Smart Recommendations" is a bullet list without structure or prioritization |
| **PatternCoverage is imprecise** | Keyword matching (30 rules) is an approximation; merge into Weak Areas instead |
| **Excessive scrolling** | Full-width Achievements, large company drill-down, and scattered sections create long pages |

#### Information Architecture (Before → After)

```
BEFORE:                              AFTER:
┌─────────────────────────────┐      ┌─────────────────────────────┐
│ InterviewReadiness          │      │ Company Selector            │
│  ├─ Score Ring + Level     │      ├─ Hero Card                  │
│  ├─ 6 Factor Bars          │      │  ├─ Score Ring + Level     │
│  ├─ Company Scores (mini)  │      │  ├─ Remaining Problems     │
│  ├─ Weak Topics            │      │  └─ Estimated Time / Status │
│  ├─ Weak Difficulties      │      ├─ Readiness Breakdown       │
│  ├─ Smart Recommendations  │      │  ├─ Company Coverage       │
│  └─ Weekly Review          │      │  ├─ Topic Coverage         │
│ CompanyReadiness           │      │  ├─ Difficulty Balance     │
│  ├─ Company Grid           │      │  ├─ Revision Completion    │
│  └─ Drill-down (detail)    │      │  └─ Consistency            │
│ PatternCoverage            │      ├─ Action Plan               │
│ MockInterviewReadiness     │      │  ├─ Solve N Topic problems │
│ Achievements               │      │  ├─ Revise Problem X       │
└─────────────────────────────┘      │  └─ Practice Pattern Y    │
                                     ├─ Weak Areas               │
                                     │  ├─ Topics                │
                                     │  ├─ Patterns              │
                                     │  ├─ Difficulty            │
                                     │  └─ Quick Practice action │
                                     ├─ Company Progress         │
                                     │  └─ Clickable table       │
                                     └─ Mock Interview           │
                                       └─ Single summary card    │
```

#### What Was Removed

- **Weekly Review** → Belongs on Activity page (moved)
- **Achievements** → Belongs on Profile page (moved)
- **PatternCoverage as separate section** → Merged into Weak Areas
- **Duplicate company cards** in InterviewReadiness → Removed (replaced by Company Progress section)
- **CompanyReadiness drill-down** → Company Progress is clickable to filter, no deep drill-down
- **Smart Recommendations** → Replaced by structured Action Plan

---

### Changes

#### Modified Files

- **`src/hooks/useInterviewReadiness.ts`** — Extended result with:
  - `remainingProblems: number`
  - `estimatedTime: string` (e.g., "12 Days")
  - `actionPlan: ActionItem[]` — structured actions with explanation
  - Accept optional `selectedCompany` parameter for company-filtered computations

- **`src/app/readiness/page.tsx`** — Complete layout restructure:
  - Top-level company selector
  - Single-column focused layout with clear visual hierarchy
  - New components replacing all old sections
  - Removed: Achievements, PatternCoverage, CompanyReadiness drill-down, Weekly Review

#### New Files

- **`src/app/components/readiness/CompanySelector.tsx`** — Prominent company dropdown at page top
  - Options: Overall + 9 companies (Google, Amazon, Microsoft, Meta, Apple, Uber, Agoda, Atlassian, Netflix)
  - Updates all page data via callback
  - Premium styling with chevron, company logos

- **`src/app/components/readiness/HeroCard.tsx`** — Premium single hero card
  - Overall Readiness Score (large animated ring)
  - Current Level (color-coded badge)
  - Remaining Problems count
  - Estimated Time / Interview Status
  - Gradient background, hover effects

- **`src/app/components/readiness/ReadinessBreakdown.tsx`** — Compact factor breakdown
  - 5 progress bars with labels (Company Coverage, Topic Coverage, Difficulty Balance, Revision Completion, Consistency)
  - Brief description per factor
  - Expandable details via click
  - Color-coded progress (green/yellow/red)

- **`src/app/components/readiness/ActionPlan.tsx`** — Structured action plan
  - "Today's Action Plan" header
  - Numbered action items with checkboxes
  - Each item has: action type icon, description, explanation
  - Derived from weak topics, revision queue, company gaps

- **`src/app/components/readiness/WeakAreas.tsx`** — Merged weak areas
  - Three grouped columns: Topics, Patterns, Difficulty
  - Shows weakest items first (sorted by completion %)
  - "Practice Now" button linking to problems page with relevant filters

- **`src/app/components/readiness/CompanyProgress.tsx`** — Compact comparison table
  - All 9 companies with logos, progress bars, percentage
  - Clicking a company updates the page filter
  - Highlighted if selected
  - Avoids duplicating the Company Readiness drill-down

- **`src/app/components/readiness/MockInterviewSection.tsx`** — Concise readiness summary
  - Single card (not per-company)
  - Metrics: Coding, Revision, Topics, Confidence, Overall Status
  - Progress ring for overall, compact bars for sub-metrics

#### Removed from Readiness Page

- ✅ `Achievements.tsx` — moved to Profile responsibility
- ✅ `PatternCoverage.tsx` — merged into WeakAreas
- ✅ `CompanyReadiness.tsx` — replaced by CompanyProgress + page-level filter
- ✅ `InterviewReadiness.tsx` — replaced by new component suite

---

### Data Flow

```
Page State:
  selectedCompany: string | null  (null = Overall)

useCompanyReadiness(progressMap)
  → stats, loading, selectedProblems, etc.
  (reused as-is)

useInterviewReadiness(..., selectedCompany)
  → Computes overall/company-specific scores
  → Adds remainingProblems, estimatedTime, actionPlan

Components receive filtered data based on selectedCompany
```

When `selectedCompany` is set:
- Hero shows company-specific score
- Breakdown adjusts company completion factor
- Action plan includes company-specific items
- Weak areas filter to company-relevant topics
- Mock interview shows selected company status

---

### Design Principles

- **Visual hierarchy**: Hero → Breakdown → Action → Weak Areas → Company → Mock (top to bottom priority)
- **Card grouping**: Related content in unified containers with subtle borders and shadows
- **Typography**: Clear heading sizes (text-lg → text-xs), consistent tracking
- **Spacing**: Generous padding (p-5/p-6), consistent gap system (gap-4/gap-5)
- **Icons**: lucide-react throughout, tinted icon containers per section
- **Progress indicators**: Gradient progress bars, animated SVG rings
- **Hover effects**: Scale transforms, color transitions, shadow elevation
- **Empty states**: Centered contextual messages with icons
- **Loading states**: Skeleton cards matching final layout dimensions
- **Responsive**: Single column on mobile, compact on tablet, full on desktop

### Validation

- `npm run build` — must pass
- `npm run lint` — must pass (only pre-existing CompanyLogo warning)
- Light + Dark mode — must be consistent
- Responsive at desktop, tablet, mobile — must maintain clean layout

---

### Scoring Algorithm (Unchanged)

- **Company Completion (25%)**: Average solved% across loaded companies
- **Topic Coverage (20%)**: % of topics with at least one solved problem
- **Difficulty Balance (15%)**: Average difficulty completion % minus spread
- **Revision Completion (15%)**: % of revision tasks marked as reviewed
- **Consistency (15%)**: Active days / 30 (capped at 100)
- **Current Streak (10%)**: Streak / 30 (capped at 100)

---

## Previous Phases

## Previous: Phase 21 — Interview Readiness Dashboard — ✅

### Goal
Transform the `/readiness` page into a premium analytics dashboard that answers: "Can I confidently clear my next coding interview?" Fix layout truncation issues, add Pattern Coverage, Mock Interview Readiness, and Achievements sections, and restructure to a two-column layout.

### Changes Made

#### New Files
- **`src/app/components/PatternCoverage.tsx`** — Section showing top 10 interview patterns (Sliding Window, DFS, DP, etc.) with completion progress bars, solved/total counts, and color-coded status. Derived from topic-to-pattern keyword matching.
- **`src/app/components/MockInterviewReadiness.tsx`** — Per-company readiness cards showing Coding, Revision, and Topic subscores with an overall readiness label (Ready/Almost/Needs Work/Not Ready) and combined progress bar.
- **`src/app/components/Achievements.tsx`** — Badge row showing unlocked achievements (streak, problem count, company ready, topic master, revision ace) with emoji icons and locked achievement placeholders.

#### Modified Files
- **`src/hooks/useInterviewReadiness.ts`** — Extended `InterviewReadinessResult` with:
  - `PatternCoverage[]` — 30 interview patterns mapped from topics via keyword matching (Array, String, Two Pointers, Sliding Window, Binary Search, DFS, BFS, DP, etc.)
  - `MockInterviewItem[]` — Per-company readiness (coding 50% + revision 25% + topics 25%)
  - `Achievement[]` — 10 achievements across solved count, streaks, company readiness, topic mastery, revision accuracy
  - `level` string — Beginner / Improving / Interview Ready / Strong Candidate / Excellent
- **`src/app/components/InterviewReadiness.tsx`** — Fixed FactorBar label truncation (w-24 → w-28 + title attribute). Fixed Weekly Review grid (7-col → 4-col, added titles). Enhanced hero section with level label and subtitle. Removed weight column from factor bars. Added "Practice weak topics" link. Improved recommendation layout with reason inline.
- **`src/app/components/CompanyReadiness.tsx`** — Added `title` attribute to company card name to prevent truncation of long names. Added `min-w-0` to flex container.
- **`src/app/readiness/page.tsx`** — Restructured to premium two-column layout:
  - Left column: InterviewReadiness (score ring, level, factor bars, company scores, weak areas, recommendations, weekly review)
  - Right column: CompanyReadiness (company grid with full drill-down)
  - Below: PatternCoverage | MockInterviewReadiness (side by side)
  - Bottom: Achievements (full width badge row)
  - Improved header title/subtitle

### Validation
- `npm run build` ✅
- `npm run lint` ✅ (only pre-existing CompanyLogo warning)
- Light + Dark mode consistent
- Responsive at desktop, tablet, mobile

---

## Previous: Phase 19 — Interview Readiness — ✅

### Changes Made
- **`src/hooks/useInterviewReadiness.ts`** — Hook that computes an overall readiness score (0–100%) from 6 weighted factors: Company Completion (25%), Topic Coverage (20%), Difficulty Balance (15%), Revision Completion (15%), Consistency (15%), Current Streak (10%). Also computes company-specific scores, weak topics (sorted by completion % + days since last practice), weak difficulties, smart recommendations (1–3 problems per weak topic with reason), and a weekly review summary.
- **`src/app/components/InterviewReadiness.tsx`** — Full section component with: animated SVG score ring, 6 factor bars with weights, company score grid (3–5 columns), weak topics + weak difficulties cards, smart recommendations callout with bullet list + reasoning, and 7-metric weekly review grid (Solved, Acceptance, Best Day, Missed Days, Top Topic, Weak Topic, Goal %).
- **`src/app/activity/page.tsx`** — Replaced Interview Readiness placeholder with live component. No remaining "Soon" placeholders.

## Previous: Phase 17 — Company Readiness — ✅

### Changes Made
- **`src/hooks/useCompanyReadiness.ts`** — New hook that fetches CSV data for 9 companies (Google, Amazon, Microsoft, Meta, Uber, Atlassian, Agoda, Netflix, Apple) in parallel using `Promise.allSettled`. Parses each CSV with `papaparse`, extracts `problemId` via `getProblemId`, cross-references with `progressMap` for solved counts. Returns per-company stats, difficulty/topic breakdown, and a `solvedSet` for fast lookup. CSVs cached in `sessionStorage` (existing cache key pattern).
- **`src/app/components/CompanyReadiness.tsx`** — Section component with two views

## Previous: Phase 16 — Daily Mission & Goal Tracking — ✅
Added daily mission widget with sub-goals, weekly/monthly progress bars, and configurable goal settings via localStorage.

## Previous: Activity Page — Productivity Workspace Redesign — ✅
Redesigned `/activity` from a statistics dashboard into a productivity-focused daily workspace.

## Previous Phases
[Phases 1-15: Heatmap Redesign, Progress Page Enhancement, Dashboard Enhancement, Global Optimization, Navigation Update, Visual Consistency, Production Theme System, Notes Editor, GitHub Pages Favicon, Activity Page & Calendar, Practice Calendar & Progress Tracking, Production Readiness Review]
