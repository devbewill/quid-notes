---
id: TASK-12
title: Build ActivateBar and ActivateModal — ACTIVATE flow
status: Done
assignee: []
created_date: '2026-02-28 09:54'
updated_date: '2026-02-28 10:40'
labels:
  - frontend
  - core
dependencies:
  - TASK-10
  - TASK-6
  - TASK-7
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the core ACTIVATE feature: components/ActivateBar.tsx and components/ActivateModal.tsx.

ActivateBar (floating bottom bar):
- Appears when 1+ top-level notes are selected
- Position: fixed bottom-8 left-1/2 -translate-x-1/2
- Style: bg-surface border border-border rounded-full px-6 py-3 shadow-2xl
- Content: [✕ Clear]  [N notes selected]  [⚡ ACTIVATE]
- Animates in: initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
- Use AnimatePresence

ActivateModal:
- Trigger: clicking ACTIVATE button
- Overlay: bg-black/60 backdrop-blur-sm
- Modal: bg-surface border border-border rounded-2xl p-8 max-w-md
- Animates in: initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}

Manual tab:
- Task title input (required)
- Task description textarea (pre-fill if 1 note selected)
- [Create Task] button → calls tasks.createFromNotes

AI tab:
- Shows selected note titles as chips
- [Analyze with AI] → calls ai.generateProposals → shows 3 proposal cards
- User clicks a card → populates task title input
- [Create Task] button → calls tasks.createFromNotes

After task creation: close modal, deselect all, new task row animates in.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 ActivateBar appears when at least 1 top-level note is selected and is hidden otherwise
- [ ] #2 Clicking ✕ Clear deselects all notes and hides the bar
- [ ] #3 ActivateBar shows the correct count of selected notes
- [ ] #4 Manual tab: filling title and clicking Create Task calls tasks.createFromNotes and the modal closes
- [ ] #5 AI tab: clicking Analyze with AI shows 3 proposal cards; clicking a card populates the title input
- [ ] #6 After task creation, the activated notes disappear from Level 1 and appear under the new task at Level 2
- [ ] #7 All animations (bar slide-up, modal scale-in) use Framer Motion with AnimatePresence
<!-- AC:END -->
