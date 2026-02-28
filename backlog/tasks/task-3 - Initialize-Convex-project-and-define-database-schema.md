---
id: TASK-3
title: Initialize Convex project and define database schema
status: Done
assignee: []
created_date: '2026-02-28 09:51'
updated_date: '2026-02-28 10:07'
labels:
  - setup
  - backend
  - database
dependencies:
  - TASK-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Run npx convex dev to initialize Convex. Define all tables in convex/schema.ts.

Tables:
- users: email, name?, avatarUrl?, authProvider, privacyAcceptedAt, privacyPolicyVersion, marketingConsent, marketingConsentUpdatedAt?, registeredAt, lastActiveAt?, ipHash?, userAgent?, isDeleted, deletionRequestedAt?, deletionScheduledAt?
- notes: ownerId, title, text, status (idle|active|completed), startDate?, dueDate?, parentTaskId?, createdAt, updatedAt
- tasks: ownerId, title, text, status (idle|active|completed), startDate?, dueDate?, linkedNoteIds[], aiProposals?, createdAt, updatedAt

Required indexes:
- notes: by_owner ["ownerId"], by_owner_and_parent ["ownerId","parentTaskId"]
- tasks: by_owner ["ownerId"]
- users: by_email ["email"]
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 convex/schema.ts compiles without errors (npx convex dev shows no schema errors)
- [ ] #2 All 3 tables (users, notes, tasks) defined with correct field types
- [ ] #3 All 4 required indexes are present in the schema
- [ ] #4 status field uses v.union(v.literal(...)) pattern with idle|active|completed on both notes and tasks
<!-- AC:END -->
