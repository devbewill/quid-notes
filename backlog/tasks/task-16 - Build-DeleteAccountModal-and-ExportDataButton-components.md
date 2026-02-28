---
id: TASK-16
title: Build DeleteAccountModal and ExportDataButton components
status: To Do
assignee: []
created_date: '2026-02-28 09:56'
labels:
  - frontend
  - gdpr
dependencies:
  - TASK-8
  - TASK-13
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build components/DeleteAccountModal.tsx and components/ExportDataButton.tsx.

DeleteAccountModal:
- Triggered from AccountMenu DANGER ZONE
- Content:
  ⚠️ Delete your account
  All your notes and tasks will be permanently deleted within 30 days. You can cancel this within the window.
  Type "DELETE" to confirm:
  [ _________________ ]
  [Cancel]   [Confirm deletion]
- Confirm button disabled until user types exactly "DELETE"
- On confirm: calls users.requestDeletion → signs user out
- Localized via useLocale

ExportDataButton:
- Calls users.exportData action
- On success: triggers browser download of quid-export-YYYY-MM-DD.json
- Shows loading state while action runs
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Confirm deletion button is disabled until the user types DELETE exactly
- [ ] #2 On confirmation, users.requestDeletion is called and the user is signed out immediately
- [ ] #3 ExportDataButton downloads a file named quid-export-YYYY-MM-DD.json
- [ ] #4 Downloaded JSON file contains account info, notes, and tasks but no ipHash or userAgent
- [ ] #5 ExportDataButton shows a loading/spinner state while the Convex action runs
- [ ] #6 Modal text is localized via useLocale
<!-- AC:END -->
