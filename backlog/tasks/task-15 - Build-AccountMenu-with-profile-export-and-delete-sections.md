---
id: TASK-15
title: 'Build AccountMenu with profile, export, and delete sections'
status: Done
assignee: []
created_date: '2026-02-28 09:55'
updated_date: '2026-02-28 10:40'
labels:
  - frontend
  - gdpr
  - users
dependencies:
  - TASK-8
  - TASK-13
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build components/AccountMenu.tsx — slide-over panel triggered from a user avatar/initials button in the sidebar bottom-left.

Sections:

ACCOUNT
- Edit Profile: inline form to edit name only (email is immutable)
- Change Password: only visible if authProvider === "email"
- Marketing emails: toggle switch → calls users.updateMarketingConsent

DATA & PRIVACY
- Export my data → renders ExportDataButton component
- Privacy Policy → opens /privacy in new tab
- Terms of Service → opens /terms in new tab

DANGER ZONE
- Delete my account → opens DeleteAccountModal

Sign out button at the bottom.

All strings via useLocale (IT/EN).
Style: slide-over from left or elegant dropdown — choose the more elegant option for the dark aesthetic.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Clicking the avatar/initials button opens the account panel
- [ ] #2 Edit profile form updates name via users.updateProfile; email field is read-only
- [ ] #3 Change Password option is hidden for Google OAuth users
- [ ] #4 Marketing emails toggle calls users.updateMarketingConsent and reflects current DB value
- [ ] #5 Sign out button signs the user out and redirects to login
- [ ] #6 All text is localized (IT/EN) via useLocale
<!-- AC:END -->
