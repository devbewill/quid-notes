---
id: TASK-5
title: Implement Convex functions for notes (queries and mutations)
status: To Do
assignee: []
created_date: '2026-02-28 09:52'
labels:
  - backend
  - notes
dependencies:
  - TASK-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement all Convex queries and mutations in convex/notes.ts.

Functions:
1. listTopLevel (query): fetch notes where parentTaskId === undefined, filtered by ownerId via by_owner_and_parent index. Call requireOwner().
2. listByTask (query): fetch notes where parentTaskId === taskId, filtered by ownerId. Call requireOwner().
3. create (mutation): insert a new note with status=idle, parentTaskId=undefined, createdAt/updatedAt=Date.now(). Call requireOwner().

Edge cases:
- listTopLevel must exclude any note with parentTaskId set (use index filter)
- All functions must reject unauthenticated or cross-user requests via requireOwner()
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 listTopLevel returns only notes with parentTaskId === undefined for the authenticated user
- [ ] #2 listByTask returns only notes matching the given taskId and owned by the authenticated user
- [ ] #3 create inserts a note with status=idle and no parentTaskId; createdAt and updatedAt are set
- [ ] #4 Calling any function without auth throws UNAUTHENTICATED
- [ ] #5 Passing another user's ownerId throws FORBIDDEN
<!-- AC:END -->
