## System Role

You are a Senior Fullstack Engineer specialized in Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Convex. You write production-quality code: typed, modular, and with no placeholders. When something is unclear, you apply the most logical default and document your choice inline with a `// NOTE:` comment.

---

## Project: QUID — "Potential noted. Action defined."

QUID is a minimal web app for managing thoughts and actions. The core concept: **notes and tasks are not different entities, but two states of the same item.** A Note is potential energy (an idea, a thought); a Task is that energy activated and made actionable.

---

## Tech Stack

| Layer        | Technology                           |
| ------------ | ------------------------------------ |
| Frontend     | Next.js 14 (App Router), TypeScript  |
| Styling      | Tailwind CSS (no CSS modules)        |
| Animation    | Framer Motion                        |
| Backend + DB | Convex                               |
| AI           | Google Gemini API (gemini-1.5-flash) |
| Auth         | Convex Auth (email/password)         |

---

## Database Schema (Convex)

Define the following tables in `convex/schema.ts`:

### `users`

```ts
{
  email: v.string(),
  name: v.optional(v.string()),
}
```

### `notes`

```ts
{
  ownerId: v.id("users"),
  title: v.string(),
  text: v.string(),
  status: v.union(v.literal("idle"), v.literal("active"), v.literal("completed")),
  startDate: v.optional(v.number()),   // Unix timestamp ms
  dueDate: v.optional(v.number()),     // Unix timestamp ms
  parentTaskId: v.optional(v.id("tasks")), // null = top-level note; set = linked to a task
  createdAt: v.number(),
  updatedAt: v.number(),
}
```

### `tasks`

```ts
{
  ownerId: v.id("users"),
  title: v.string(),
  text: v.string(),
  status: v.union(v.literal("idle"), v.literal("active"), v.literal("completed")),
  startDate: v.optional(v.number()),
  dueDate: v.optional(v.number()),
  linkedNoteIds: v.array(v.id("notes")),  // notes that originated this task
  aiProposals: v.optional(v.array(v.string())),
  createdAt: v.number(),
  updatedAt: v.number(),
}
```

**Edge case rules (enforce in mutations):**

- A note with `parentTaskId` set must **not** appear in the top-level feed. Query filter: `parentTaskId === undefined`.
- A task can have `linkedNoteIds: []` (manually created with no source notes).
- Deleting a task does **not** delete its linked notes; instead, it sets their `parentTaskId` to `undefined`, restoring them to the top-level feed.
- All items are scoped by `ownerId` — never expose items across users.

---

## UI/UX Specifications

### Design Tokens

```ts
// tailwind.config.ts
colors: {
  bg:      '#0B0B0B',
  surface: '#161616',
  border:  '#262626',
  text:    '#E8E8E8',
  muted:   '#666666',
  accent:  '#FFFFFF',
}
```

### Typography

- Font: **Geist** (import from `next/font/google` or `geist` npm package)
- Headings: `font-semibold tracking-tight`
- Body: `font-normal text-sm text-text`
- Meta/labels: `text-xs text-muted uppercase tracking-widest`

### Layout

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (w-56, fixed left)  │  Main Feed (flex-1)  │
│  - Inbox                     │  [Table + Quick Add] │
│  - Active Tasks              │                      │
└─────────────────────────────────────────────────────┘
```

- Sidebar: `bg-surface border-r border-border`
- Main area: `bg-bg`, centered column `max-w-4xl mx-auto`
- All spacing: multiples of 4px; prefer `p-6`, `gap-4`, `gap-6`

---

## Main Feed: The Table

Render a two-level table with columns: **Title**, **Type**, **Status**, **Start Date**, **Due Date**.

### Level 1 rows — top-level notes and tasks

- Notes where `parentTaskId === undefined`
- All tasks

### Level 2 rows — child notes under a task

- Rendered as indented sub-rows directly below their parent task (toggle expand/collapse on the task row).
- Visually: `pl-8 border-l border-border ml-4`, slightly reduced opacity.

### Row behaviors

- Hover reveals a checkbox on the left (for multi-selection).
- `Cmd+Click` (or `Ctrl+Click`) also toggles selection without needing to hover.
- Clicking a row (not the checkbox) opens an inline edit panel or a slide-over detail panel.
- Type badge: pill `NOTE` (gray) or `TASK` (white outline), `text-xs`.
- Status badge: `IDLE` (muted), `ACTIVE` (white), `COMPLETED` (strikethrough + muted).

---

## Quick Add Entry

Above the table, render a persistent minimal input bar:

```
[ + Add a note or task...                    ] [Add]
```

On focus, expand to show:

- `title` (required, autofocus)
- `description / text` (required)
- `start date` (optional, date picker)
- `due date` (optional, date picker)

**Default behavior:** always creates a `note` with `status: "idle"` and `parentTaskId: undefined`.

On submit: clear fields, add row to top of list with a subtle Framer Motion fade-in.

---

## Core Logic: ACTIVATE

### Step 1 — Selection

When 1+ notes are selected (checkboxes or Cmd+Click), a floating action bar appears at the bottom-center of the screen:

```
[ ✕ Clear ]   [ 2 notes selected ]   [ ⚡ ACTIVATE ]
```

Style: `fixed bottom-8 left-1/2 -translate-x-1/2`, `bg-surface border border-border rounded-full px-6 py-3 shadow-2xl`.

Only `notes` (not tasks, not child notes) can be selected for activation. If the user tries to select a task or a child note, silently ignore it (no error).

### Step 2 — ACTIVATE Modal

On click, open a centered overlay (`bg-black/60 backdrop-blur-sm`) with a modal (`bg-surface border border-border rounded-2xl p-8 max-w-md`):

```
  ⚡ ACTIVATE

  [  Manual  ]   [  AI (Gemini)  ]   ← toggle tabs
```

**Manual tab:**

- Input: Task title (required)
- Text area: Task description (optional, pre-filled if only 1 note selected)
- `[Create Task]` button

**AI tab:**

- Show the titles of selected notes as chips.
- `[Analyze with AI]` button → calls Gemini API.
- **Gemini prompt to use (send server-side via Convex action):**

```
You are an assistant that converts raw notes into actionable tasks.
Given the following notes, extract the underlying intent and generate exactly 3 concise, actionable task proposals.
Each proposal must be a single sentence starting with a verb (e.g., "Request", "Schedule", "Define").
Return ONLY a JSON array of 3 strings. No explanation.

Notes:
{{notes_content}}
```

- Display the 3 proposals as selectable cards. User clicks one → it populates a task title input for final confirmation.
- `[Create Task]` button.

### Step 3 — Task Creation (both paths)

On task creation:

1. Insert new record into `tasks` table with `linkedNoteIds` = selected note IDs.
2. For each selected note, run a mutation: set `parentTaskId` = new task ID.
3. These notes disappear from Level 1 of the feed and appear as Level 2 children under the new task.
4. Close modal. Deselect all. Show new task row in feed with Framer Motion slide-in.

---

## Convex Functions to Implement

| Type     | Name                          | Description                                                     |
| -------- | ----------------------------- | --------------------------------------------------------------- |
| query    | `notes.listTopLevel`          | Notes where `parentTaskId === undefined`, filtered by `ownerId` |
| query    | `tasks.listAll`               | All tasks for `ownerId`                                         |
| query    | `notes.listByTask`            | Notes where `parentTaskId === taskId`                           |
| mutation | `notes.create`                | Create a top-level note                                         |
| mutation | `tasks.createFromNotes`       | Create task + update linked notes' `parentTaskId`               |
| mutation | `tasks.deleteAndRestoreNotes` | Delete task, set `parentTaskId = undefined` on linked notes     |
| action   | `ai.generateProposals`        | Server-side call to Gemini API, returns string[3]               |

---

## Animations (Framer Motion)

- New row added: `initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}`
- Row removed (task absorbed): `exit={{ opacity: 0, height: 0 }}`
- ACTIVATE bar: `initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}`
- Modal: `initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}`
- Use `AnimatePresence` for all conditional renders.

---

## Deliverables (generate all of the following)

1. `convex/schema.ts` — complete schema
2. `convex/notes.ts` — all note queries and mutations
3. `convex/tasks.ts` — all task queries and mutations
4. `convex/ai.ts` — Gemini action
5. `app/layout.tsx` — font setup, global providers
6. `app/page.tsx` — main dashboard (sidebar + feed)
7. `components/Feed.tsx` — two-level table
8. `components/QuickAdd.tsx` — quick add bar
9. `components/ActivateBar.tsx` — floating selection bar
10. `components/ActivateModal.tsx` — modal with Manual/AI tabs
11. `tailwind.config.ts` — custom tokens

Generate each file completely. No `// TODO`, no `...rest of code`. Every component must be fully typed with TypeScript interfaces.
