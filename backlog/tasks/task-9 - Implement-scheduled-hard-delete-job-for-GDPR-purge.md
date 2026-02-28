---
id: TASK-9
title: Implement scheduled hard-delete job for GDPR purge
status: To Do
assignee: []
created_date: '2026-02-28 09:53'
labels:
  - backend
  - gdpr
  - cron
dependencies:
  - TASK-8
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement convex/scheduled/hardDeleteUsers.ts — a Convex cron job that permanently purges soft-deleted users after the 30-day window.

Logic:
1. Query all users where isDeleted=true AND deletionScheduledAt <= now
2. For each user:
   a. Delete all notes owned by user (ownerId = user._id)
   b. Delete all tasks owned by user
   c. Delete the user record itself
3. Schedule this job to run daily (or every few hours)

This is a hard delete — no recovery possible after this runs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Cron job is registered in convex/crons.ts (or equivalent Convex cron config)
- [ ] #2 Job deletes all notes and tasks before deleting the user record (no orphaned records)
- [ ] #3 Job does not process users whose deletionScheduledAt is still in the future
- [ ] #4 Job does not affect users where isDeleted=false
<!-- AC:END -->
