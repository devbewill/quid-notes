---
id: TASK-6
title: Implement Convex functions for tasks (queries and mutations)
status: To Do
assignee: []
created_date: '2026-02-28 09:52'
labels:
  - backend
  - tasks
dependencies:
  - TASK-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement all Convex queries and mutations in convex/tasks.ts.

Functions:
1. listAll (query): fetch all tasks for ownerId via by_owner index. Call requireOwner().
2. createFromNotes (mutation): atomically — insert new task with linkedNoteIds=selectedNoteIds, then for each note set parentTaskId=newTaskId and updatedAt=now. Call requireOwner().
3. deleteAndRestoreNotes (mutation): for each note in task.linkedNoteIds, set parentTaskId=undefined and updatedAt=now. Then delete the task. Call requireOwner().

Critical rule: deleting a task NEVER deletes its linked notes — it restores them to the top-level feed by clearing parentTaskId.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 listAll returns only tasks owned by the authenticated user
- [ ] #2 createFromNotes inserts the task and sets parentTaskId on all linked notes in a single mutation
- [ ] #3 After createFromNotes, calling notes.listTopLevel no longer returns the linked notes
- [ ] #4 deleteAndRestoreNotes deletes the task and sets parentTaskId=undefined on all previously linked notes
- [ ] #5 After deleteAndRestoreNotes, calling notes.listTopLevel returns the restored notes
<!-- AC:END -->
