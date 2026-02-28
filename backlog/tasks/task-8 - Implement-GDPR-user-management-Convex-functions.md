---
id: TASK-8
title: Implement GDPR user management Convex functions
status: To Do
assignee: []
created_date: '2026-02-28 09:53'
labels:
  - backend
  - gdpr
  - users
dependencies:
  - TASK-4
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement convex/users.ts with all GDPR-required user management functions.

Mutations:
- updateProfile: update name only (email is immutable)
- updateMarketingConsent: toggle marketingConsent boolean + set marketingConsentUpdatedAt
- requestDeletion: set isDeleted=true, deletionRequestedAt=now, deletionScheduledAt=now+30days. Returns nothing — caller must sign out the user.
- cancelDeletion: clear isDeleted, deletionRequestedAt, deletionScheduledAt (only within 30-day window)

Actions:
- exportData: fetch all user notes + tasks, return JSON string (exclude ipHash, userAgent, internal _id fields). Format: { exportedAt, account: {email,name,registeredAt,authProvider}, notes: [...], tasks: [...] }
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 updateProfile changes name but leaves email unchanged
- [ ] #2 requestDeletion sets deletionScheduledAt to exactly now + 30 days (2592000000 ms)
- [ ] #3 cancelDeletion clears all three deletion fields; user can log in again after cancellation
- [ ] #4 exportData JSON contains no ipHash, no userAgent, no Convex internal _id fields
- [ ] #5 exportData includes all notes and tasks owned by the user
<!-- AC:END -->
