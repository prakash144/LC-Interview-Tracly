# 🎯 Interview Tracly

Master Coding Interviews.

Track your journey. Crack your dream company. 🚀

A modern web app to track your coding problem-solving progress. Easily browse, filter, and mark problems as solved while staying up to date with the latest company-wise problem sets.

> 📅 **Problem Set – Updated on 20 Jun 2025**

---

## 🌐 Live Site

🔗 [Visit Interview Tracly](https://prakash144.github.io/Interview-Tracly/)

---

## 📌 Features

### Core
- ✅ Track your progress across company-wise coding problems
- 🏷️ Filter by company, topic, difficulty, or status (Solved / Attempted / Unsolved)
- ⭐ Bookmark favorites for quick review
- 🔍 Search problems by name or number
- 📱 Fully responsive design (desktop, tablet, mobile)

### Dashboard
- 📊 Overall stats with difficulty breakdown and progress bars
- 🔥 LeetCode-style activity heatmap with month labels, streak tracking, and time-range filters (Current / 2025 / 2024 / 2023 / 180d / 90d / 30d)
- 🏢 Company progress tracking with logos
- ⚡ Quick actions (Continue Solving, Random Problem, My Lists, Progress)
- 📈 Recent solved problems and weekly goal tracking

### Progress Page
- 📋 Two-column layout: practice history table + summary sidebar
- 🔀 Sortable columns (Last Submitted, Problem, Difficulty)
- 🔎 Debounced search + multi-filters (difficulty, status, company, topic)
- 📄 Pagination (10 / 25 / 50 per page)
- 🍩 Difficulty breakdown ring chart (LeetCode-style progress rings)
- 📊 Monthly submission trend chart
- 📈 Recent stats + insights (streaks, active days, acceptance rate)

### Problems Page
- 📖 Full workspace with search, filters, and sortable table
- 🏢 Company and topic badges with company logos
- ✏️ Inline notes and bookmark management
- 📋 Add to custom lists with search and loading states

### Favorites
- ⭐ Bookmarked problems overview

### My Lists
- 📂 Create, rename, delete, and view custom problem lists

### Settings
- 🌗 **Light / Dark / System** theme modes — persisted to localStorage
- 🎨 Accent color picker (Green / Blue / Purple / Orange)
- 🔐 Account and preferences management

### Sprints
- 🏃 Sprint planning with Kanban board (drag & drop via @dnd-kit)
- 📊 Sprint analytics (completion %, capacity, track breakdown)
- 🔄 Sprint retrospective with rating, weaknesses, action items
- 🔍 Filter + search tasks within sprint

### Interview Tracks
- 🗂️ 7 built-in tracks (DSA, System Design, Backend, Behavioral, Leadership, Interview Experience, AI/ML)
- ➕ Fully dynamic — add/edit/delete custom tracks (Book Reading, Gym, Meditation, etc.)
- 📚 Knowledge resources with status tracking, revision, personal notes
- 🔎 Global search across all tracks (Cmd+K)

### Collections
- 📁 Favorites, built-in lists (Blind 75, NeetCode 150), and custom problem lists
- 🔗 Cross-collection filtering

### Theme System
- 🌙 Three modes: Light, Dark, and System (follows OS preference)
- 💾 Persisted across sessions (refresh, logout, browser restart)
- 🚫 No flash of incorrect theme — inline script runs before first paint
- 🎯 Semantic CSS variable system for consistent colors across all components
- ✅ WCAG AA contrast in both modes

---

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Architecture](docs/ARCHITECTURE.md) | High-level architecture, data flow, component tree, gap analysis |
| [Implementation Plan](docs/IMPLEMENTATION_PLAN.md) | Phased roadmap for features and fixes |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router)
- **State Management:** React hooks + context
- **Styling:** Tailwind CSS v4 / shadcn UI
- **Data Source:** Dynamic GitHub CSV/API problem metadata
- **Persistence:** Firebase Authentication and Cloud Firestore for user progress
- **Charts:** Custom SVG components (ProgressRingChart, DonutChart, Heatmap)
- **Icons:** Lucide
- **Deployment:** GitHub Pages (static export)

---

## Firebase Setup

The app is statically hosted on GitHub Pages. Firebase is used from the client SDK only.

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Firestore stores only user-specific progress:
- solved
- attempted
- bookmarked
- revision list
- notes
- activity counts for the heatmap

Problem metadata such as title, link, acceptance, difficulty, frequency, topic, company, and list continues to come from the GitHub CSV/API source.

Deploy the rules in `firestore.rules` to protect per-user progress data.
