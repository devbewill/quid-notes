---
id: TASK-10
title: Build Feed component — two-level table with selection
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
  - TASK-6
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build components/Feed.tsx — the main table showing notes and tasks in a two-level hierarchy.

Table columns: Title | Type | Status | Start Date | Due Date

Level 1 rows:
- Top-level notes (parentTaskId === undefined)
- All tasks

Level 2 rows (under a task):
- Child notes (parentTaskId === task._id)
- Rendered as indented sub-rows: pl-8 border-l border-border ml-4, slightly reduced opacity
- Toggle expand/collapse by clicking the task row

Row behaviors:
- Hover reveals checkbox on the left
- Cmd+Click / Ctrl+Click toggles selection without hovering
- Click row body (not checkbox) opens edit/detail panel (stub OK for now)
- Only top-level notes can be selected (silently ignore task/child note selection)

Badges:
- Type: pill NOTE (gray) or TASK (white outline), text-xs
- Status: IDLE (muted), ACTIVE (white), COMPLETED (strikethrough + muted)
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Table renders Level 1 notes and tasks from Convex queries
- [ ] #2 Child notes appear as Level 2 rows under their parent task when expanded
- [ ] #3 Clicking a task row toggles the expand/collapse of its child notes
- [ ] #4 Hovering a row shows a checkbox; Cmd+Click also selects without needing to hover
- [ ] #5 Selecting a task or child note has no effect (silent ignore)
- [ ] #6 NOTE and TASK type badges render with correct styles; IDLE/ACTIVE/COMPLETED status badges render correctly
<!-- AC:END -->
