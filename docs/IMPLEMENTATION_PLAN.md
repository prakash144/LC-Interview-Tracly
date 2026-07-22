# Implementation Plan

> *Last updated: July 2026*

This document outlines the phased implementation roadmap for Interview Tracly. Each phase is self-contained, builds on previous phases, and includes validation criteria.

---

## Phase Overview

| Phase | Title | Effort | Status |
|---|---|---|---|---|
| I | Core Gap Fixes | 2-3h | ✅ Done |
| II | Sprint Planning Overhaul | 8-12h | ✅ Done |
| III | Critical Infrastructure Fixes | 3h | 🟡 Planned |
| IV | Smart Daily Mission | 3-4h | ✅ Done |
| V | Real-Time Firestore Listeners | 2-3h | ✅ Done |
| VI | Track Merge / Archive | 2-3h | ⬜ Future |
| VII | Problem ↔ Resource Linking | 3-4h | ⬜ Future |
| VII | AI Sprint Suggestions | 4-6h | ⬜ Future |
| VIII | PWA / Offline Support | 3-4h | ⬜ Future |
| IX | Data Export / Import | 2-3h | ⬜ Future |
| X | Collaborative Sprints | 6-8h | ⬜ Future |

---

## Phase I — Core Gap Fixes ✅ DONE

**Goal**: Fix the critical and moderate issues identified in the architecture review without breaking existing functionality.

### I.1 — Add `order` field to SprintTask interface

**Status**: ✅ Complete
**Files**: `src/lib/sprints.ts`
**Change**: Added `order?: number` to `SprintTask` interface.

### I.2 — Optimistic updates for customLists

**Status**: ✅ Complete
**Files**: `src/hooks/useCustomLists.ts`
**Change**: Replaced `reload()` calls with ref mirror + rollback pattern.

### I.3 — Cascade track delete

**Status**: ✅ Complete
**Files**: `src/hooks/useTracks.ts`, `src/services/firebase/trackService.ts`, `src/app/components/tracks/ManageTracksDialog.tsx`
**Change**: Added confirmation dialog with resource count + "Just the track" / "Delete everything" options.

### I.4 — Add problems to Global Search

**Status**: ✅ Complete
**Files**: `src/components/layout/GlobalSearch.tsx`
**Change**: Problems now appear grouped under "Problems" section with distinct icon.

---

## Phase II — Sprint Planning Overhaul ✅ DONE

**Goal**: Transform the sprint section from a simple Kanban into a full Sprint Planning module.

### II.1 — Data Model Expansion
**Status**: ✅ Complete — `SprintTaskV2` (20+ fields), `SprintV2` with `capacityHours`, `migrateTask()`, `createDefaultTaskV2()`

### II.2 — Sprint Dashboard Header
**Status**: ✅ Complete — `SprintDashboardHeader.tsx` with stat cards, progress bar, track breakdown

### II.3 — Five-Column Kanban Board
**Status**: ✅ Complete — Backlog / To Do / In Progress / Review / Done with `@dnd-kit`

### II.4 — Rich Task Cards
**Status**: ✅ Complete — Priority badge, track chip, difficulty, est hours, progress bar, tags, company, edit/delete

### II.5 — Filter + Search
**Status**: ✅ Complete — 6 filter dimensions (search, track, priority, status, company, difficulty) + clear

### II.6 — Task Detail Dialog
**Status**: ✅ Complete — Full editor with all SprintTaskV2 fields, linked problems/resources, tags, notes

### II.7 — Sprint Analytics
**Status**: ✅ Complete — Completed vs remaining, estimated vs actual, track breakdown bars

### II.8 — Dashboard Integration
**Status**: ✅ Complete — Quick task status toggle, progress ring, sprint info

### II.9 — Activity Timeline Integration
**Status**: ✅ Complete — `activityService.ts` logs sprint start/complete and task done events

### II.10 — Backlog Management
**Status**: ✅ Complete — Backlog column in board for uncommitted tasks

---

## Phase III — Critical Infrastructure Fixes

**Goal**: Fix the remaining critical issues that will cause runtime failures or poor UX as data grows.

### III.1 — Add Firestore Indexes Configuration

**Files**: `firestore.indexes.json` (new)
**Change**: Create Firestore index configuration for all compound queries with `orderBy`:
- `sprints` by `createdAt desc`
- `tasks` by `order`
- `activity` by `timestamp desc`
- `resources` by `createdAt desc`
- `tracks` by `createdAt desc`

### III.2 — Cascade Delete for Sprint Tasks

**Files**: `src/services/firebase/sprintService.ts`
**Change**: In `deleteSprint()`, first query and delete all docs in the `tasks` subcollection before deleting the sprint document.

### III.3 — Enable Offline Persistence

**Files**: `src/lib/firebase.ts` (or `firebaseClient.ts`)
**Change**: Add `enableMultiTabIndexedDbPersistence(firestore)` after initialization.

### III.4 — Add Toast Notification System

**Files**: New provider + integration in all data hooks
**Change**: Add Sonner (or react-hot-toast) with auto-dismiss toasts on every CRUD operation (add, update, delete, error).

### III.5 — Fix Task Query Ordering

**Files**: `src/services/firebase/sprintService.ts`
**Change**: Switch `orderBy("addedAt")` → `orderBy("order")` in `fetchSprintTasks()` to respect drag-reordered positions.

### Validation

```bash
npm run build      # 0 errors
npm run lint       # 0 warnings
```

Verify: Sprints, Tracks, Activity pages load without index errors. Deleting a sprint removes all tasks. App works offline after first load.

---

## Phase IV — Smart Daily Mission ✅ DONE

**Goal**: A widget that picks the most relevant tasks for today from the active sprint.

### IV.1 — Mission Algorithm

**Status**: ✅ Complete — `src/lib/mission.ts` with `computeDailyMission()` pure function

Logic:
1. Pick 1 task from active sprint that is "In Progress" (highest priority first)
2. Pick 1 task from "To Do" that is due soonest or highest priority
3. Pick 1 resource from revision list (spaced repetition — longest since last review)
4. Return as "Today's Focus" items

### IV.2 — Dashboard / Activity Integration

**Status**: ✅ Complete — DailyMissionWidget component on Dashboard (below Active Sprint widget) and Activity page (after TodayMission)

### Files Created/Modified

| File | Change |
|---|---|
| `src/lib/mission.ts` | New — mission algorithm |
| `src/app/components/DailyMission.tsx` | New — widget component |
| `src/app/page.tsx` | Added DailyMissionWidget + revision tracker |
| `src/app/activity/page.tsx` | Added DailyMissionWidget + revision items

---

## Phase V — Real-Time Firestore Listeners ✅ DONE

**Goal**: Switch from one-shot `getDocs()` to `onSnapshot()` for live updates.

### Changes

All 5 service files now have `subscribe*` functions returning an unsubscribe callback. All 6 data hooks switched from `useEffect` + `getDocs` to `useEffect` + `onSnapshot` with cleanup.

### Files Modified

| File | Change |
|---|---|
| `src/services/firebase/sprintService.ts` | Added `subscribeSprints`, `subscribeTasks` |
| `src/services/firebase/resourceService.ts` | Added `subscribeResources`, `subscribeResourceProgress` |
| `src/services/firebase/trackService.ts` | Added `subscribeTracks` |
| `src/services/firebase/customListService.ts` | Added `subscribeCustomLists` |
| `src/services/firebase/progressService.ts` | Added `subscribeProgress` |
| `src/hooks/useSprints.ts` | Switched sprints + tasks to `onSnapshot` |
| `src/hooks/useResources.ts` | Switched to `onSnapshot` with sample merge |
| `src/hooks/useTracks.ts` | Switched to `onSnapshot` |
| `src/hooks/useCustomLists.ts` | Switched to `onSnapshot`, removed `reload()` |
| `src/hooks/useResourceProgress.ts` | Switched to `onSnapshot` |

### Additional Changes

- Rollback patterns simplified: all mutation catch blocks now use pre-mutation snapshots (`prevSnapshot`) instead of calling `get*()` to re-fetch
- Error callbacks passed to all `subscribe*` functions for error handling
- `useCustomLists.reload()` removed (no longer needed with real-time sync)

---

## Phase VI — Track Merge / Archive

**Goal**: Full lifecycle management for tracks.

### VI.1 — Cascade Delete

When deleting a track, user chooses:
- "Delete track only" — resources become "unassigned" (track = `""` or `"uncategorized"`)
- "Delete track and all resources" — cascade delete from Firestore

### VI.2 — Merge Tracks

Dialog with source track + target track selector. All resources from source get `track` field updated to target. Source track is deleted.

### VI.3 — Archive

Toggle on track card. Archived tracks are hidden from main listing but visible in a "Show Archived" toggle. Their resources still appear in search.

---

## Phase VII — Problem ↔ Resource Linking

**Goal**: Bridge the two parallel data systems.

### VII.1 — Link Problem to Resource

In `ResourceDialog` (or `TrackDetailView`): "Linked Problems" section that searches the problem workspace and stores `problemId` references on the resource.

### VII.2 — Link Resource to Problem

In `NotesDialog` on problems: "Linked Resources" section.

### VII.3 — Display

On Problem cards, show linked resources as small chips. On Resource cards, show linked problems as chips. Click navigates to the linked item.

---

## Phase VIII — AI Sprint Suggestions

**Goal**: After completing a sprint retro, suggest the next sprint based on weaknesses.

### VIII.1 — Weakness → Task Mapping

Build a static mapping:
```
"Time management" → [task: "Practice timed coding", resource: "Time management strategies"]
"System design scope" → [task: "Review system design primer", resource: "System Design Interview"]
...
```

### VIII.2 — Next Sprint Generator

After retro, analyze weaknesses + unfinished tasks + low-completion tracks and auto-generate:
- Sprint name suggestion
- Goal suggestion  
- Pre-populated task list

---

## Phase IX — PWA / Offline Support

### IX.1 — Service Worker

Register a service worker that caches static assets on first load. Use `Cache-first` strategy for next-static assets, `Network-first` for Firestore data.

### IX.2 — Offline Fallback

When offline:
- Show cached pages
- Show "You're offline" banner
- Queue Firestore writes for later sync (Pending writes indicator)

---

## Phase X — Data Export / Import

### X.1 — Export

Button in Settings → "Export My Data" → Downloads JSON with all Firestore collections (progress, resources, tracks, sprints, customLists).

### X.2 — Import

Button → "Import Data" → File upload → Validate JSON → Merge or Replace option.

---

## Phase XI — Collaborative Sprints

**Goal**: Share a sprint with another user.

### XI.1 — Sprint Sharing

Generate share link → recipient sees sprint in "Shared with me" → can view/add tasks.

### XI.2 — Task Assignment

Tasks have an `assignedTo` field (UID). Filter by assignee.

### XI.3 — Real-Time Collaboration

Using Firestore `onSnapshot`, multiple users see task status changes in real-time.

---

## Appendix — Effort Estimation

| Phase | Files Changed | New Components | Risk | Effort |
|---|---|---|---|---|---|
| I | 5-7 | 0 | Low | 2-3h ✅ |
| II | 10-15 | 8-10 | Medium | 8-12h ✅ |
| III | 4-5 | 0 | Low | 3h |
| IV | 3-4 | 1-2 | Low | 3-4h |
| V | 8-10 | 0 | Medium | 2-3h |
| VI | 4-5 | 1 | Low | 2-3h |
| VII | 4-5 | 1-2 | Low | 3-4h |
| VIII | 2-3 | 1 | Medium | 4-6h |
| IX | 3-4 | 0 | High | 3-4h |
| X | 2-3 | 0 | Low | 2-3h |
| XI | 5-7 | 2-3 | High | 6-8h |
