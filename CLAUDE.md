# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**QUID** — "Potential noted. Action defined."

A minimal web app where notes and tasks are two states of the same item. A Note is potential energy (an idea); a Task is that energy activated and made actionable. The core flow is selecting notes and **ACTIVATING** them into tasks (manually or via AI).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS (no CSS modules) |
| Animation | Framer Motion |
| Backend + DB | Convex |
| AI | Google Gemini API (`gemini-1.5-flash`) |
| Auth | Convex Auth (email/password + Google OAuth) |

## Development Commands

```bash
# Install dependencies
npm install

# Start development (Next.js + Convex)
npx convex dev   # Convex backend (separate terminal)
npm run dev      # Next.js frontend

# Build
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Architecture

### Data Model

Notes and tasks share the same lifecycle. The key differentiator is `parentTaskId` on notes:

- **Top-level note**: `parentTaskId === undefined` — appears in Level 1 feed
- **Child note**: `parentTaskId` set to a task ID — appears as Level 2 under that task
- **Task**: has `linkedNoteIds[]` pointing to its source notes

ACTIVATE flow: select top-level notes → create task → notes get `parentTaskId` set → they move from Level 1 to Level 2 under the new task.

### Directory Structure (target)

```
convex/
  schema.ts              # DB schema (users, notes, tasks tables)
  lib/auth.ts            # requireOwner() helper — used in every query/mutation
  notes.ts               # listTopLevel, listByTask, create
  tasks.ts               # listAll, createFromNotes, deleteAndRestoreNotes
  ai.ts                  # generateProposals (Gemini action)
  users.ts               # exportData, requestDeletion, cancelDeletion, updateProfile, updateMarketingConsent
  scheduled/
    hardDeleteUsers.ts   # Cron job: hard-delete users 30 days after soft-delete

app/
  layout.tsx             # Geist font, global providers
  page.tsx               # Main dashboard: sidebar + feed
  privacy/page.tsx       # Privacy Policy (IT/EN toggle)
  terms/page.tsx         # Terms of Service

components/
  Feed.tsx               # Two-level table (notes + tasks)
  QuickAdd.tsx           # Minimal input bar for creating notes
  ActivateBar.tsx        # Floating bottom bar when notes are selected
  ActivateModal.tsx      # Modal with Manual/AI tabs for task creation
  ConsentBanner.tsx      # First-visit cookie banner (localStorage)
  AccountMenu.tsx        # Slide-over panel: profile, export, delete
  DeleteAccountModal.tsx # "Type DELETE to confirm" modal
  ExportDataButton.tsx   # Triggers JSON download via users.exportData

hooks/
  useLocale.ts           # IT/EN locale context

lib/
  cn.ts                  # classnames utility
```

### Key Patterns

**Data isolation**: Every Convex query/mutation touching `notes` or `tasks` must call `requireOwner()` from `convex/lib/auth.ts`. Never accept `userId` from the client — always derive it from the authenticated session server-side.

```ts
// convex/lib/auth.ts pattern
const user = await requireOwner(ctx, resourceOwnerId);
// throws UNAUTHENTICATED, FORBIDDEN, or ACCOUNT_DELETED
```

**Indexes** (define in schema.ts):
- `notes`: `by_owner` on `["ownerId"]`, `by_owner_and_parent` on `["ownerId", "parentTaskId"]`
- `tasks`: `by_owner` on `["ownerId"]`
- `users`: `by_email` on `["email"]`

**Task deletion rule**: Deleting a task does NOT delete its linked notes. Instead, set `parentTaskId = undefined` on each linked note to restore them to the top-level feed.

### UI Conventions

**Design tokens** (tailwind.config.ts):
```ts
colors: {
  bg: '#0B0B0B', surface: '#161616', border: '#262626',
  text: '#E8E8E8', muted: '#666666', accent: '#FFFFFF',
}
```

**Font**: Geist (from `next/font/google` or `geist` npm package)

**Layout**: Sidebar `w-56` fixed left (`bg-surface border-r border-border`) + main area `max-w-4xl mx-auto` on `bg-bg`. All spacing in multiples of 4px.

**Animations** (Framer Motion, always use `AnimatePresence`):
- New row: `initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}`
- Row removed: `exit={{ opacity: 0, height: 0 }}`
- ACTIVATE bar: `initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}`
- Modal: `initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}`

**Selection rules**: Only top-level notes (not tasks, not child notes) can be selected for activation. Silently ignore attempts to select tasks or child notes.

### Compliance (GDPR — mandatory for EU users)

**User soft-delete flow**:
1. `requestDeletion`: sets `isDeleted: true`, `deletionScheduledAt: now + 30 days`
2. During 30-day window: user cannot log in; show reactivation screen
3. `cancelDeletion`: resets the flags
4. `hardDeleteUsers` cron: after 30 days, permanently deletes user + all their notes/tasks

**Registration**: requires unchecked-by-default consent checkbox accepting Privacy Policy + Terms. Store `privacyAcceptedAt` (timestamp) and `privacyPolicyVersion`.

**Data export** (`users.exportData` action): returns JSON with account info, notes, tasks. Exclude `ipHash`, `userAgent`, internal Convex IDs from the export.

**Consent banner**: stores `quid_consent_v1 = "accepted"` in `localStorage`. Only essential session cookies — no tracking.

### Locale

All user-facing strings in components must support Italian (IT) and English (EN) via `useLocale()` hook. Privacy Policy and Terms pages include a language toggle.

### Gemini AI Prompt

Used in `ai.generateProposals` (server-side Convex action):

```
You are an assistant that converts raw notes into actionable tasks.
Given the following notes, extract the underlying intent and generate exactly 3 concise, actionable task proposals.
Each proposal must be a single sentence starting with a verb (e.g., "Request", "Schedule", "Define").
Return ONLY a JSON array of 3 strings. No explanation.

Notes:
{{notes_content}}
```

## Environment Variables

```
CONVEX_DEPLOYMENT=          # Convex project URL
NEXT_PUBLIC_CONVEX_URL=     # Convex public URL
GEMINI_API_KEY=             # Google Gemini API key
```
