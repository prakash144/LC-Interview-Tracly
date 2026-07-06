# Implementation Plan — Improvement Pass (v2)

> **Status:** Phase 20 in progress.
> **IMPORTANT:** No automatic updates to this file unless explicitly requested.

## Latest: Phase 20 — Activity Page Premium Redesign — In Progress

### Goal
Transform the Activity page from a cluttered statistics dashboard into a focused, premium daily workspace. Remove overloaded sections (Company Readiness, Interview Readiness) to a dedicated `/readiness` page. Simplify stats, promote Today's Mission to hero, polish calendar, consolidate insights, and streamline revision queue.

### Changes Made

#### New Files
- **`src/app/readiness/page.tsx`** — New route `/readiness`. Two-section layout rendering Company Readiness + Interview Readiness. Header with back-to-activity link.
- **`src/app/activity/ActivityDayDetail.tsx`** — Inline component shown below the calendar when a day is clicked. Displays solved/attempted problem titles with difficulty, links to filtered Progress page.

#### Modified Files
- **`src/hooks/useCalendarData.ts`** — Added `yesterday`, `last-90-days`, `this-quarter`, `custom` to `TimeRangeId`. Added `customStart`/`customEnd` optional fields for date picker. Added `solvedTitles` + `attemptedTitles` to `CalendarDay` for richer inline detail.
- **`src/app/components/ProgressFilters.tsx`** — Supports all new presets. Added "Custom" button that expands inline date inputs. Horizontal scroll on mobile.
- **`src/app/components/TodayMission.tsx`** — Rewritten as hero section. Large SVG ring for daily progress. Weekly + Monthly bars. Compact sub-goal checkboxes. Gradient background banner.
- **`src/app/components/PracticeCalendar.tsx`** — Removed footer stats row. Selected day shows inline detail (`ActivityDayDetail`). Added "View Full History →" link.
- **`src/app/components/CalendarInsights.tsx`** — Consolidated from 3 cards to 2: "Highlights" (best day/week/month) + "Trends" (monthly + weekly bars combined). Removed inactive days count.
- **`src/app/components/RevisionTracker.tsx`** — Removed "Review This Week" bucket. Removed stats row. Only "Review Today" + "Overdue" (collapsed by default). Renamed to "Revision Queue".
- **`src/app/activity/page.tsx`** — Removed CompanyReadiness + InterviewReadiness imports. Removed 8-card stat section. New layout: Mission hero → Calendar + Quick Stats → Insights → Revision Queue → readiness link.

#### Unchanged Files (moved to /readiness)
- `src/app/components/CompanyReadiness.tsx`
- `src/app/components/InterviewReadiness.tsx`
- `src/hooks/useCompanyReadiness.ts`
- `src/hooks/useInterviewReadiness.ts`

### Design
- **Today's Mission (Hero)**: Full-width gradient card with large SVG donut ring for daily %, stacked weekly/monthly progress bars, and compact sub-goal row with checkmarks.
- **Calendar + Quick Stats**: 2-column layout on desktop. Calendar is compact focal point. Quick Stats is a single 4-item row (Streak, Best, Active, Avg/Day).
- **Calendar Day Click**: Inline panel slides open below grid showing problem titles with difficulty colors. "View Full History →" opens `/progress?date=YYYY-MM-DD`.
- **Insights**: 2 equal cards. Highlights (best day/week/month with trophy icons). Trends (combined monthly + weekly horizontal bars).
- **Revision Queue**: Only "Review Today" + "Overdue" buckets, both collapsed by default. No analytics row.
- **Time Filters**: Scrollable row on mobile. Custom date picker via inline date inputs. New presets: Yesterday, Last 90 Days, This Quarter.
- **Readiness Page**: Two stacked sections (Company Readiness, Interview Readiness) with a back link to Activity. Room to grow into interview control center.

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

### Scoring Algorithm
- **Company Completion (25%)**: Average solved% across all loaded companies.
- **Topic Coverage (20%)**: % of topics with at least one solved problem.
- **Difficulty Balance (15%)**: Average difficulty completion % minus spread between highest/lowest.
- **Revision Completion (15%)**: % of revision tasks marked as reviewed.
- **Consistency (15%)**: Active days / 30 (capped at 100).
- **Current Streak (10%)**: Streak / 30 (capped at 100).
- **Overall**: Weighted sum, clamped to [0, 100].

### Recommendations
- Finds topics with < 70% completion AND > 3 days since last practiced.
- Recommends 1–3 problems per topic (more if longer gap).
- Reason: "{Topic} has not been practiced for {N} days."
- No AI/external APIs — pure heuristic based on existing data.

## Previous: Phase 17 — Company Readiness — ✅

### Changes Made
- **`src/hooks/useCompanyReadiness.ts`** — New hook that fetches CSV data for 9 companies (Google, Amazon, Microsoft, Meta, Uber, Atlassian, Agoda, Netflix, Apple) in parallel using `Promise.allSettled`. Parses each CSV with `papaparse`, extracts `problemId` via `getProblemId`, cross-references with `progressMap` for solved counts. Returns per-company stats, difficulty/topic breakdown, and a `solvedSet` for fast lookup. CSVs cached in `sessionStorage` (existing cache key pattern).
- **`src/app/components/CompanyReadiness.tsx`** — Section component with two views:
  - **Grid view**: 3-column company cards showing solved/total, progress bar, completion % with color coding (green ≥80%, amber ≥50%, muted otherwise). Loading skeletons while data fetches.
  - **Detail view**: Click a company card to drill in. Shows overall progress card, difficulty breakdown (Easy/Medium/Hard bars with counts and %), topic breakdown (top 20 topics sorted by total, scrollable), and a filterable problem list with difficulty/status/topic dropdowns.
  - **Filters**: 3 dropdowns (Difficulty: All/Easy/Medium/Hard, Status: All/Solved/Unsolved, Topic: All + dynamic topic list). Problem list updates in real-time, shows checkmark/circle icons for solved/unsolved, difficulty color tags.
- **`src/app/activity/page.tsx`** — Replaced "Company Readiness" placeholder with live `CompanyReadiness` section. Imported `useCompanyReadiness` hook. Remaining placeholders now: Revision Tracker + Interview Readiness (2-column grid).

### Data Model
- No Firestore schema changes. All data fetched from GitHub CSV repo: `https://raw.githubusercontent.com/prakash144/leetcode-company-wise-problems/main/{Company}/5.%20All.csv`
- Solved status computed from existing `progressMap` by `problemId` cross-reference.
- 9 parallel fetches, gracefully handled via `Promise.allSettled` (individual company failures don't block others).

### Design
- Company cards: compact 3-column grid, rounded borders, hover effects, gradient progress bars.
- Detail panel: back button, nested cards for progress/difficulty/topics, scrollable problem list (capped at 50 + overflow indicator).
- Filters: compact dropdown row with `Filter` icon.
- Consistent with app's existing card, typography, and color system.

## Previous: Phase 16 — Daily Mission & Goal Tracking — ✅

Added daily mission widget with sub-goals, weekly/monthly progress bars, and configurable goal settings via localStorage.

### Changes Made
- **`src/hooks/useGoals.ts`** — New hook managing goal settings (daily/weekly/monthly targets, medium/company/revision sub-targets). Persisted in localStorage.
- **`src/app/components/TodayMission.tsx`** — New dashboard widget showing today's date, 4 sub-goals with checkbox-style progress (solve N problems, N Medium, N Company, revise N), daily progress bar with percentage, compact weekly + monthly mini-cards.
- **`src/app/components/GoalSettingsDialog.tsx`** — Modal dialog with number inputs for all 6 goal targets, save/cancel actions, backdrop blur.
- **`src/app/activity/page.tsx`** — Added `monthlySolved` computation, integrated TodayMission + GoalSettingsDialog, replaced Daily Mission placeholder with live widget, added monthly progress bar to Today's Summary hero, changed remaining placeholders to 3-column grid.

### Data Model
- No Firestore schema changes — all goal settings stored in `localStorage` under `goal-settings`.
- Daily/weekly/monthly solved counts computed inline from existing `progressMap` + `solvedAt` timestamps.
- Medium/company/revision counts filtered against `questions` array using `difficulty` and `company` fields.

### Design
- Sub-goals show checked/unchecked state + X/Y fraction (e.g., "2/3").
- Daily progress bar uses gradient (`from-zap to-success`).
- Weekly/Monthly mini-cards use info/success colors with thin progress bars.
- Settings dialog uses backdrop blur, same card/input styling as rest of app.

## Previous: Activity Page — Productivity Workspace Redesign — ✅

Redesigned `/activity` from a statistics dashboard into a productivity-focused daily workspace.

### Changes Made
- **Layout restructuring**: Header (Activity title + subtitle) → Time Filters (equal-width grid) → Today's Summary hero (4 metrics + Weekly Goal progress bar) → Calendar (full-width) → Insights (Highlights + Trends) → Future Features placeholder grid
- **Today's Summary hero**: Replaced 8 small stat cards with 4 large-typography metrics (Solved, Current Streak, Best Streak, Active Days) + weekly goal progress bar. Computes weekly solved count inline from progressMap.
- **ProgressFilters**: Redesigned with equal-width `grid-cols-3 sm:grid-cols-6` layout, subtle active state with `shadow-sm scale-[1.02]`, smoother `transition-all duration-200` hover/active transitions.
- **PracticeCalendar**: Added selected-date state with ring highlight and scale, improved day cell layout (aspect-square), tooltip on hover showing problem titles, today ring indicator, empty/future day styling, streaks footer with flame/trophy/check icons + hint text.
- **CalendarInsights**: Redesigned with 3 equal-height cards (Highlights, Monthly Trend, Weekly Trend) with icon headers, gradient-filled trend bars.
- **Future Features placeholders**: 2×2 grid of styled placeholder cards (Daily Mission, Revision Tracker, Company Readiness, Interview Readiness) with "Coming Soon" badges, icons, and descriptions.
- **Removed**: `ProgressSummary` import (replaced by inline hero section), `PageHeader` import (replaced by inline header).

### Files Modified
- `src/app/activity/page.tsx` — complete rewrite
- `src/app/components/ProgressFilters.tsx` — restyled layout and active states
- `src/app/components/PracticeCalendar.tsx` — added interactions, tooltips, empty states
- `src/app/components/CalendarInsights.tsx` — redesigned cards with gradient bars

### Design Principles Applied
- **Productivity-first**: Page now answers "what should I practice?" instead of "how did I do?"
- **Visual hierarchy**: Large bold metrics in hero section, smaller supporting text
- **Future-ready**: Reserved placeholder sections for planned features without empty-state clutter
- **Premium feel**: Smooth transitions, shadows, hover effects, gradient progress bars
- **Lightweight**: No new dependencies, no Firestore schema changes, no heavy re-renders

## Completed Phases

### 1. Heatmap Redesign — ✅
LeetCode-style contribution heatmap with SVG grid, month/day labels, green intensity scale, streak stats, time-range filters (Current/2025/2024/2023/180d/90d/30d), tooltip, legend.

### 2. Progress Page Enhancement — ✅
Two-column layout (Practice History + Summary sidebar). Sortable columns, debounced search, multi-filters (difficulty/status/company/topic), pagination (10/25/50), ProgressRingChart, monthly trend, recent stats + insights.

### 3. Dashboard Enhancement — ✅
Restructured layout with overall progress, difficulty breakdown with progress bars, company progress, quick actions, recent activity, weekly goal. Reuses Heatmap component.

### 4. Global Optimization & Polish — ✅
React.memo on key components, deleted unused code (MetricCard, StatusBadge, DonutChart, Checkbox, unused types/functions), `/analytics` → `/progress` redirect, company logos via Simple Icons CDN with CompanyBadge fallback, CSS variable card backgrounds.

### 5. Navigation Update — ✅
TopNav: Dashboard, Problems, Progress, Favorites, My Lists, Settings. Profile dropdown: My Profile, My Lists, Settings, Sign Out. (Theme selector moved to Settings page.)

### 6. Final Visual Consistency Pass — ✅
Difficulty color system (Easy=green, Medium=yellow, Hard=red) verified across all components. LeetCode-style ProgressRingChart (SVG ring with gaps, animated, clickable). Unified card backgrounds. Green focus/accent states. CompanyLogo component.

### 7. Production Theme System — ✅
Light / Dark / System modes with localStorage persistence. Semantic CSS variable system replacing all hardcoded dark colors across 32+ files. Flash-prevention inline script. 3-mode selector in Settings (Light / Dark / System buttons with active state). Accent color picker (Green / Blue / Purple / Orange) applied to focus rings. No `dark:` prefix variants — all theme-aware via CSS variables.

### 8. Notes Editor — Markdown & Code Formatting — ✅
Markdown editor with syntax-highlighted code blocks inside NotesDialog. Edit/Preview tabs with `react-markdown` + `rehype-highlight`. Theme-aware syntax highlighting via custom OKLCH CSS variables in `globals.css`. Supports 190+ languages (Python default, extensible to Java/C++/Go/JS without code changes).

### 9. GitHub Pages Favicon — ✅
Complete favicon asset set generated from SVG (16×16, 32×32, 48×48, 180×180, 192×192, 512×512). Deleted conflicting `src/app/favicon.ico`. Updated metadata with basePath-aware icon links and manifest. Fixed OG/Twitter image URLs (double basePath). Updated manifest.json with relative asset paths.

### 10. Activity Page & NeetCode-Style Calendar — ✅
New top-level `/activity` page with a NeetCode-style monthly calendar, time-range filters, progress summary, and insights. Separated from the Progress page to keep the app modular.
- Created `/activity` page with `useCalendarData` hook combining `progressMap` + Firestore activity data
- Rewrote `PracticeCalendar` to match NeetCode style: month navigation (◀ ▶), day counter, checkmark/X icons on day cells, color coding for activity/missed/future, current+best streak badges with fire/trophy icons
- Added month navigation (`navigateMonth`, `goToToday`) to `useCalendarData` hook
- Created `ProgressFilters`, `ProgressSummary`, `CalendarInsights` as reusable components
- Added "Activity" to TopNav nav items with `CalendarDays` icon (between Progress and Favorites)
- Removed calendar section from Progress page (reverted to original clean state)
- No schema changes — reuses existing `UserProblemProgress.solvedAt` and `DailyActivity` documents

### 8. Notes Editor – Python Code Formatting — ✅
Markdown editor with syntax-highlighted code blocks. Edit/Preview toggle in NotesDialog.
- Installed `react-markdown` + `rehype-highlight` (highlight.js-based)
- Created `src/app/components/MarkdownRenderer.tsx` — reusable markdown renderer supporting fenced code blocks with automatic language detection
- Enhanced `NotesDialog.tsx` — Edit/Preview tab toggle; textarea uses monospace font; preview renders with full Markdown + syntax highlighting
- Added highlight.js CSS theme in `globals.css` (custom OKLCH colors for both light/dark themes)
- Extensible by design — `rehype-highlight` supports 190+ languages out of the box; no code changes needed to add Java, C++, Go, JS, etc.

### 9. GitHub Pages Favicon — ✅
Favicon not appearing on deployed GitHub Pages site. Root cause: `src/app/favicon.ico` auto-generated a `<link>` that may not respect `basePath`; missing standard favicon assets (16×16, 32×32, apple-touch-icon); manifest icons used absolute paths without basePath.
- Deleted `src/app/favicon.ico` (removes conflicting auto-generated link)
- Generated favicon assets from SVG using `sharp`: `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png`, `icon-192x192.png`, `icon-512x512.png`
- Updated `layout.tsx` metadata: `icons.icon` array with SVG + 32×32 + 16×16; `apple` for apple-touch-icon; `manifest` with basePath
- Removed manual `<link rel="icon">` and `<link rel="manifest">` from `<head>` (metadata handles them)
- Fixed OG/Twitter image URLs (double basePath → resolved against `metadataBase`)
- Updated `manifest.json` with all icon sizes and relative `start_url`/`src` paths

### 10. Practice Calendar & Progress Tracking — ✅
Monthly calendar with activity intensity, time-range filters, summary stats, and insights.
- Created `src/hooks/useCalendarData.ts` — combines `progressMap` (solvedAt timestamps + problem titles) with Firestore `DailyActivity` data to build per-day analytics, calendar grids, stats, streaks, and insights
- Created `src/app/components/PracticeCalendar.tsx` — 7-column monthly grid with intensity-colored day cells, hover tooltips with solved problem names/titles, click to expand details
- Created `src/app/components/ProgressFilters.tsx` — preset button row: Today, This Week, Last 7 Days, This Month, Last 30 Days, This Year
- Created `src/app/components/ProgressSummary.tsx` — 8 stat cards using lucide icons: Solved, Attempted, Submissions, Acceptance Rate, Current Streak, Best Streak, Active Days, Avg/Day
- Created `src/app/components/CalendarInsights.tsx` — best day/week/month highlights, inactive days count, weekly and monthly trend bar charts
- Integrated into `/progress` page above the existing history table, keeping all existing functionality intact
- No Firestore schema changes — reuses existing `UserProblemProgress.solvedAt` and `DailyActivity` documents

---

## Production Readiness Review — ✅

### Issues Found & Fixed

| Issue | Severity | Fix |
|---|---|---|
| Missing `React` import in `CompanySearch.tsx` (used `React.Dispatch`/`React.SetStateAction` without import) | Critical | Added `import React` |
| `DonutChart.tsx` — unused component (dead code) | Critical | Removed file |
| `Checkbox.tsx` — unused component (dead code) | Critical | Removed file |
| `TopicSelector.tsx` missing `"use client"` directive | High | Added directive |
| `fetchQuestions.ts` (contains hook `useFetchQuestions`) missing `"use client"` | High | Added directive |
| Non-functional "Heatmap Visibility" toggle in Settings (plain `<div>` with no interaction) | High | Replaced with functional `<button role="switch">` with `aria-checked`, keyboard support |
| `formatRelativeTime.ts` — no null/undefined/NaN guard | Medium | Added guard returning `"—"` |
| Redundant second `useEffect` in `useTheme.ts` | Medium | Removed dead code |
| `hasError` passes `string | null` to `ErrorState`'s required `string` prop (Dashboard + Progress) | Medium | Added `typeof hasError === "string"` guard |
| Duplicate `key` values in Heatmap day labels (`""` for empty labels) | Medium | Changed to `key={i}` |
| SVG click handlers (`<g>`, `<circle>`) lack keyboard accessibility in ProgressRingChart | Medium | Added `role="button"`, `tabIndex`, `onKeyDown` (Enter/Space), `aria-label` |
| Clear search button in Progress page lacks `aria-label` | Medium | Added `aria-label="Clear search"` |
| Inline SVG chevron in Heatmap instead of lucide icon | Low | Replaced with `ChevronDown` from lucide-react |
| Duplicate Tailwind directives (`@import` v4 + `@tailwind` v3) in globals.css | Medium | Removed v3 directives |
| Universal `* { @apply border-border }` applies borders to all elements | Medium | Kept as-is (scoped via `border-border` var which defaults to transparent) |

### Validation Results

| Check | Result |
|---|---|
| `npm run build` | ✅ Passes — 11/11 static pages |
| `npm run lint` | ✅ Passes — 0 errors, 1 pre-existing warning (`<img>` in CompanyLogo) |
| Typecheck | ✅ Passes (included in build) |
| Console errors | ✅ None (only `console.error` for API failures, no `console.log`) |
| Dead code | ✅ Removed `DonutChart.tsx`, `Checkbox.tsx` |
| Unused imports | ✅ None detected |

### Performance Optimizations
- Removed unused components reducing bundle size
- Fixed `useSyncExternalStore` + `useEffect` pattern in `useTheme.ts`
- React.memo already applied on Heatmap, ProgressRingChart, DifficultyBadge, TopicBadge

### Accessibility Improvements
- `role="button"` + `tabIndex` + `onKeyDown` on SVG chart segments
- `aria-label` on clear search button
- `aria-checked` + `role="switch"` on functional toggle
- Focus rings use `var(--accent-color)` CSS variable

---

## Final Validation

All checks pass:

| Check | Status |
|---|---|
| `npm run build` | ✅ Passes — 10/10 static pages generated |
| `npm run lint` | ✅ Passes — only pre-existing `<img>` warning in CompanyLogo.tsx |
| Typecheck | ✅ Passes (included in build) |
| Light mode | ✅ All components render correctly |
| Dark mode | ✅ All components render correctly |
| System mode | ✅ Follows OS preference, live updates via matchMedia listener |
| Theme persistence | ✅ Survives refresh, logout, browser restart |
| Accent color persistence | ✅ Stored in localStorage, applied via CSS variable |
| No hardcoded dark colors | ✅ All 32+ files use semantic CSS variables |
| No flash of incorrect theme | ✅ Inline script runs before first paint |
| Responsive | ✅ Tested at desktop, tablet, mobile |
| Accessibility | ✅ Keyboard nav, ARIA labels, semantic HTML, focus states |
| Markdown rendering | ✅ Edit/Preview tabs, syntax-highlighted code blocks (Python) |
| Code highlighting themes | ✅ Light + Dark via custom OKLCH CSS variables |
| Backward compat (notes) | ✅ Existing plain-text notes render correctly in preview |
| Favicon — local | ✅ Correct paths in dev mode (no basePath) |
| Favicon — build output | ✅ All icon links use `/Interview-Tracly/` basePath |
| OG/Twitter images | ✅ Correct full URLs without double basePath |
| Activity page — renders | ✅ 11/11 static pages include `/activity` |
| Practice Calendar — NeetCode style | ✅ Month nav, day counter, checkmark/X icons, streak badges |
| Progress Filters — all presets | ✅ Today, Week, 7d, Month, 30d, Year filter day data correctly |
| Progress Summary — stats | ✅ 8 stat cards compute correctly from filtered date range |
| Calendar Insights — trends | ✅ Weekly/monthly trends, best day/week/month, inactive days |
| TopNav — Activity link | ✅ Nav item with CalendarDays icon between Progress and Favorites |
| Progress page — reverted | ✅ Calendar section removed, original clean state restored |
| No schema changes | ✅ Reuses existing `progressMap` + `DailyActivity` only |

---

## Open Decisions / Risks (carried forward, not buried in status markers)

- **Company logos**: resolved — initials badges (CompanyBadge) with Simple Icons CDN as enhancement, no bundled trademark assets.
- **Virtualization on the heatmap**: not built — 53 weeks renders fine without it.
- **`onSnapshot` vs `getDocs`**: per-feature decision, applied deliberately per read pattern.
- **Firebase API key exposure**: `NEXT_PUBLIC_*` keys are client-side by design; restrict in GCP Console to specific domains.
- **`dangerouslySetInnerHTML` in layout**: required for flash-prevention; content is a hardcoded string, not user input.

## Production Readiness

✅ **Production Ready**

All blocking issues resolved. Zero build errors, zero lint errors, zero TypeScript errors. The application passes a comprehensive production readiness review covering code quality, performance, accessibility, security, and responsiveness.
