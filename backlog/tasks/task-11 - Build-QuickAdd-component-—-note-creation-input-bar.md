---
id: TASK-11
title: Build QuickAdd component — note creation input bar
status: Done
assignee: []
created_date: '2026-02-28 09:54'
updated_date: '2026-02-28 10:39'
labels:
  - frontend
  - core
dependencies:
  - TASK-2
  - TASK-5
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build components/QuickAdd.tsx — the persistent minimal input bar at the top of the feed for creating notes.

Collapsed state (default):
  [ + Add a note or task... ]   [Add]

Expanded state (on focus):
- title (required, autofocus)
- description / text (required)
- start date (optional, date picker)
- due date (optional, date picker)

Behavior:
- Always creates a note with status=idle and parentTaskId=undefined
- On submit: calls notes.create mutation, clears all fields
- New row appears in Feed with Framer Motion fade-in: initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
- Collapses back on blur if fields are empty
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Clicking the input bar expands to show title, text, start date, and due date fields
- [ ] #2 Submitting with title and text calls notes.create and the note appears in the Feed
- [ ] #3 The new row animates in with opacity 0→1 and y -8→0
- [ ] #4 Fields are cleared after successful submission
- [ ] #5 Submitting without a title is blocked (required validation)
<!-- AC:END -->
