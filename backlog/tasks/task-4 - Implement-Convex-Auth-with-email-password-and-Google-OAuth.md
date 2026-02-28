---
id: TASK-4
title: Implement Convex Auth with email/password and Google OAuth
status: Done
assignee: []
created_date: '2026-02-28 09:52'
updated_date: '2026-02-28 10:39'
labels:
  - backend
  - auth
  - gdpr
dependencies:
  - TASK-3
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Configure Convex Auth for two providers: email/password and Google OAuth.

Implement:
- Email/password: bcrypt hashing via Convex Auth default
- Google OAuth: scopes limited to profile and email only
- Registration flow: store privacyAcceptedAt (timestamp), privacyPolicyVersion, marketingConsent, registeredAt, ipHash (SHA-256 of IP — never raw IP), userAgent
- Soft-delete guard: on login, check isDeleted flag; if true, return deletion info instead of session

convex/lib/auth.ts — requireOwner() helper:
- Gets identity from ctx.auth.getUserIdentity()
- Looks up user by email via by_email index
- Throws UNAUTHENTICATED | FORBIDDEN | ACCOUNT_DELETED
- Returns user record
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 User can register with email + password; user record created in users table with all compliance fields
- [ ] #2 Google OAuth flow completes and stores email, name, avatarUrl, authProvider=google
- [ ] #3 requireOwner() throws ACCOUNT_DELETED when user.isDeleted is true
- [ ] #4 requireOwner() throws FORBIDDEN when authenticated user tries to access another user resource
- [ ] #5 ipHash stored as SHA-256 hex string, not raw IP address
<!-- AC:END -->
